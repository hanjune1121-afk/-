"""강원 고랭지 밭 28,815필지 토양유실 위험 분석 (PPT 수치 재현용)

사용법:
    python analysis.py <입력 CSV 경로> [출력 폴더]

입력 CSV는 블록별 표준화(블록당 분산 합 = 1, 피복 블록 0.5)가 끝난 42개 변수 행렬이다.
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import spearmanr
from sklearn.cluster import KMeans
from sklearn.metrics import adjusted_rand_score, davies_bouldin_score, silhouette_score

SRC = sys.argv[1]
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "outputs")
OUT.mkdir(parents=True, exist_ok=True)

REGION_KR = {
    "jinbu": "평창 진부면", "daegwallyeong": "평창 대관령면", "imgye": "정선 임계면",
    "yeoryang": "정선 여량면", "wangsan": "강릉 왕산면", "hajang": "삼척 하장면", "changjuk": "태백 창죽동",
}

df = pd.read_csv(SRC, encoding="utf-8-sig")
df["REGION"] = df.REGION_KEY.map(REGION_KR)
pct = [c for c in df.columns if c.startswith("PCT_")]
parcel_cols = pct + ["LS_mean", "ELEV_MEAN", "GEOM_AREA_M2", "ELONGATION", "COMPACTNESS", "STREAM_PARCEL_M"]
z = lambda s: (s - s.mean()) / s.std(ddof=0)

# 1) 토지피복 비율 복원: 행 합계 = 100% 제약으로 표준화 이전 비율을 역산
A = (df[pct] - df[pct].min()).to_numpy()
coef = np.linalg.lstsq(A, np.ones(len(df)), rcond=None)[0]
share = pd.DataFrame(A * coef * 100, columns=pct)
assert np.allclose(share.sum(axis=1), 100, atol=1e-6)
farm = share.PCT_221 + share.PCT_222
share.mean().sort_values(ascending=False).round(2).to_csv(OUT / "01_토지피복_평균비율.csv", header=["평균비율(%)"])
share.groupby(df.REGION).mean().round(2).to_csv(OUT / "02_지역별_토지피복비율.csv")

# 2) 지역별 변수 프로파일 (z-score)
cont = ["LS_mean", "ELEV_MEAN", "GEOM_AREA_M2", "ELONGATION", "COMPACTNESS", "STREAM_PARCEL_M",
        "R_2025_RANK1", "RAIN_PRIMARY_obs_max_60min_mm", "RAIN_PRIMARY_estimated_top5_EI30_share",
        "R_summer_JunSep_share", "RAIN_PRIMARY_obs_max_calendar_day_mm",
        "TC_canopy_EI30_weighted_pct_partial", "TC_low_canopy_EI30_fraction_annual_known_only"]
Z = df[cont].apply(z)
Z.groupby(df.REGION).mean().round(2).T.to_csv(OUT / "03_지역별_변수프로파일_z.csv")
Z.corr().round(2).to_csv(OUT / "04_상관행렬.csv")

# 3) 군집분석: 전체 변수 vs 필지 고유 변수
X_all, X_parcel = df.iloc[:, 3:45].to_numpy(), df[parcel_cols].to_numpy()
idx = np.random.RandomState(0).choice(len(df), 8000, replace=False)
rows = []
for name, X in [("전체 42개 변수", X_all), ("필지 고유 35개 변수", X_parcel)]:
    for k in range(2, 11):
        lab = KMeans(k, n_init=10, random_state=42).fit(X).labels_
        rows.append({"변수셋": name, "k": k, "silhouette(8천 표본)": round(silhouette_score(X[idx], lab[idx]), 3),
                     "Davies-Bouldin": round(davies_bouldin_score(X, lab), 3),
                     "지역구분과 일치도(ARI)": round(adjusted_rand_score(df.REGION_KEY, lab), 3)})
pd.DataFrame(rows).to_csv(OUT / "05_군집수_선정지표.csv", index=False)

lab = KMeans(5, n_init=10, random_state=42).fit(X_parcel).labels_
prof = Z.groupby(lab).mean()
prof["밭비율"] = farm.groupby(lab).mean()
prof["경지정리밭"] = share.PCT_221.groupby(lab).mean()
names = {}
names[prof["경지정리밭"].idxmax()] = "B 경지정리 완경사형"
names[prof.STREAM_PARCEL_M.drop(list(names)).idxmax()] = "D 하천원거리 급경사형"
names[prof.ELONGATION.drop(list(names)).idxmax()] = "C 세장형 경사밭"
names[prof.ELEV_MEAN.drop(list(names)).idxmin()] = "E 저지대 소필지·초지혼재형"
names[[c for c in prof.index if c not in names][0]] = "A 하천인접 대형밭형"
df["TYPE"] = pd.Series(lab).map(names)

# 4) 토양유실·유출 위험지수 (RUSLE 개념 요소의 등가중 z 평균, K인자 미포함)
comp = pd.DataFrame({
    "R(강우침식능)": z(df.R_2025_RANK1),
    "LS(경사·경사장)": z(df.LS_mean),
    "C(피복취약)": z(z(df.TC_low_canopy_EI30_fraction_annual_known_only) - z(df.TC_canopy_EI30_weighted_pct_partial)),
    "연결성(하천근접)": -z(df.STREAM_PARCEL_M),
    "노출(밭비율)": z(farm),
})
df["RISK"] = comp.mean(axis=1)
df["RISK_PCTL"] = (df.RISK.rank(pct=True) * 100).round(1)
top = df.RISK >= df.RISK.quantile(0.9)
df["PRIORITY"] = top

def summary(by):
    g = df.groupby(by)
    t = pd.DataFrame({"필지수": g.size(), "밭비율(%)": farm.groupby(df[by]).mean().round(1),
                      "평균위험지수": g.RISK.mean().round(2), "우선관리필지수": top.groupby(df[by]).sum()})
    t["지역내 우선관리비율(%)"] = (t["우선관리필지수"] / t["필지수"] * 100).round(1)
    t["우선관리 점유율(%)"] = (t["우선관리필지수"] / top.sum() * 100).round(1)
    return pd.concat([t, comp.groupby(df[by]).mean().round(2)], axis=1).sort_values("평균위험지수", ascending=False)

summary("REGION").to_csv(OUT / "06_지역별_위험요약.csv")
t = summary("TYPE")
t = pd.concat([t, prof.rename(index=names)[["LS_mean", "ELEV_MEAN", "GEOM_AREA_M2", "ELONGATION",
                                          "STREAM_PARCEL_M", "경지정리밭"]].round(2)], axis=1)
t.to_csv(OUT / "07_유형별_프로파일_위험요약.csv")
pd.crosstab(df.REGION, df.TYPE, margins=True).to_csv(OUT / "08_지역x유형_필지수.csv")
pd.crosstab(df.REGION, df.TYPE, values=top, aggfunc="sum").fillna(0).astype(int).to_csv(OUT / "09_지역x유형_우선관리필지수.csv")

# 5) 민감도: 요소 하나씩 제외
sens = []
for c in comp.columns:
    r = comp.drop(columns=c).mean(axis=1)
    t2 = r >= r.quantile(0.9)
    sens.append({"제외요소": c, "Spearman ρ": round(spearmanr(df.RISK, r)[0], 3),
                 "상위10% 중첩률": round((t2 & top).sum() / top.sum(), 3),
                 "진부 점유율(%)": round(t2[df.REGION_KEY == "jinbu"].sum() / t2.sum() * 100, 1)})
pd.DataFrame(sens).to_csv(OUT / "10_위험지수_민감도.csv", index=False)

# 6) 위험을 기후 요인(R·C, 관측소 단위)과 필지 요인(LS·연결성·노출)으로 분리
clim = comp[["R(강우침식능)", "C(피복취약)"]].mean(axis=1)
parc = comp[["LS(경사·경사장)", "연결성(하천근접)", "노출(밭비율)"]].mean(axis=1)
top_p = parc >= parc.quantile(0.9)
pd.DataFrame({"기후위험(평균 z)": clim.groupby(df.REGION).mean().round(2),
              "필지위험 상위10% 비율(%)": (top_p.groupby(df.REGION).mean() * 100).round(1),
              "종합지수 우선관리비율(%)": (top.groupby(df.REGION).mean() * 100).round(1)}) \
  .sort_values("기후위험(평균 z)", ascending=False).to_csv(OUT / "12_지역별_기후vs필지위험.csv")

df.loc[top, ["ID", "UID", "REGION", "TYPE", "RISK", "RISK_PCTL"]].sort_values("RISK", ascending=False) \
  .to_csv(OUT / "11_우선관리필지_목록.csv", index=False)
print("완료:", OUT.resolve(), "| 우선관리 필지", int(top.sum()))
