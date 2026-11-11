import sys, json, numpy as np, pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score
from sklearn.decomposition import PCA
D=sys.argv[1]
raw=pd.read_csv(D+'/01_데이터/군집학습_44피처_군집번호포함.csv',dtype={'ID':str,'UID':str},encoding='utf-8-sig')
X=pd.read_csv(D+'/01_데이터/군집학습_최종변환42차원_28815필지.csv',dtype={'ID':str,'UID':str},encoding='utf-8-sig')
assert (raw.UID.values==X.UID.values).all()
feat=[c for c in X.columns if c not in('REGION_KEY','ID','UID')]
M=X[feat].values; lab=raw.cluster.values
out={}
rng=np.random.RandomState(42); idx=rng.choice(len(M),5000,replace=False)
ks={}
for k in range(2,9):
    km=KMeans(k,n_init=10,random_state=42).fit(M)
    ks[k]=dict(inertia=float(km.inertia_),sil=float(silhouette_score(M[idx],km.labels_[idx])))
    if k==4: out['ari_refit_vs_saved']=float(adjusted_rand_score(lab,km.labels_))
out['k']=ks
out['seed_ari']={s:float(adjusted_rand_score(lab,KMeans(4,n_init=10,random_state=s).fit(M).labels_)) for s in (7,19,73)}
# eta^2 per transformed feature
gm=M.mean(0); sst=((M-gm)**2).sum(0); ssb=np.zeros(M.shape[1])
for c in np.unique(lab):
    m=M[lab==c]; ssb+=len(m)*(m.mean(0)-gm)**2
eta=pd.Series(ssb/np.where(sst>0,sst,1),index=feat).sort_values(ascending=False)
out['eta2']=eta.round(4).to_dict()
out['ssb_share']=(pd.Series(ssb,index=feat)/ssb.sum()).sort_values(ascending=False).round(4).head(15).to_dict()
p=PCA(2).fit(M); out['pca_var']=p.explained_variance_ratio_.tolist()
Z=p.transform(M); np.save('pca.npy',np.c_[Z,lab])
num=['LS_mean','GEOM_AREA_M2','ELONGATION','STREAM_PARCEL_M','R_2025_RANK1','RAIN_PRIMARY_obs_max_60min_mm','RAIN_PRIMARY_obs_max_calendar_day_mm']
out['skew']={c:[float(raw[c].skew()),float(np.log1p(raw[c]).skew())] for c in num}
# 3 sigma outliers on log scale for 4 terrain/shape/stream feats
flag=np.zeros(len(raw),bool); cnt={}
for c in ['LS_mean','GEOM_AREA_M2','ELONGATION','STREAM_PARCEL_M']:
    y=np.log1p(raw[c]); f=(np.abs(y-y.mean())>3*y.std(ddof=0)); cnt[c]=int(f.sum()); flag|=f
out['out3']=cnt; out['out3_union']=int(flag.sum())
out['counts']=raw.cluster.value_counts().sort_index().to_dict()
cols=['LS_mean','ELEV_MEAN','GEOM_AREA_M2','R_2025_RANK1','R_summer_JunSep_share','RAIN_PRIMARY_obs_max_60min_mm','RAIN_PRIMARY_estimated_top5_EI30_share','STREAM_PARCEL_M','TC_canopy_EI30_weighted_pct_partial','TC_low_canopy_EI30_fraction_annual_known_only','PCT_222','PCT_221','PCT_423','PCT_623','PCT_211']
out['median']=raw.groupby('cluster')[cols].median().round(3).to_dict()
out['mean_cover']=raw.groupby('cluster')[['PCT_222','PCT_221','PCT_423','PCT_623','PCT_211']].mean().round(2).to_dict()
out['overall_median']=raw[cols].median().round(3).to_dict()
res=pd.read_csv(D+'/03_결과/최종_필지별결과.csv',dtype=str,encoding='utf-8-sig')
out['types']=res.groupby(['candidate_cluster','유형해석','관리검토사항']).size().to_dict().__repr__()
out['decision_by_cluster']=res.groupby(['candidate_cluster','decision']).size().to_dict().__repr__()
out['reasons']=res.reason.value_counts().head(8).to_dict()
json.dump(out,open('analysis.json','w'),ensure_ascii=False,indent=1,default=str)
print(json.dumps(out,ensure_ascii=False,indent=1,default=str))
