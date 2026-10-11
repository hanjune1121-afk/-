# RUSLE 토양침식성인자(K) — 강원 고랭지 일대

RUSLE(A = R·K·LS·C·P)의 **K인자** 산정 자료다. 신청·승인 없이 내려받을 수 있는 공개자료만 썼고, 같은 결과를 `make_k_factor.py`로 다시 만들 수 있다.

## 1. 파일 목록

| 파일 | 내용 | 용도 |
|---|---|---|
| `K_factor_강원고랭지_250m_EPSG5186.tif` | K 래스터, 250 m, **EPSG:5186** (Korea 2000 중부원점) | DEM·팜맵·토지피복도와 겹치기 (권장) |
| `K_factor_강원고랭지_250m_EPSG4326.tif` | K 래스터, 원자료 격자 (약 230 m, WGS84) | 원본 보관용 |
| `K_factor_강원고랭지_격자.csv` | 격자별 모래·미사·점토·유기탄소·토성·K·지역 백분위 (207,606행) | 엑셀·통계 분석 |
| `K_factor_고랭지_대표지점.csv` | 고랭지 대표 7개 지점의 K와 지역 내 백분위 | 보고서 표 |
| `K_factor_지도.png` | K 분포 지도 | 발표 자료 |
| `make_k_factor.py` | 산정 스크립트 | 재현·범위 변경 |

- 범위: 경도 128.2–129.3°E, 위도 37.0–38.0°N (홍천 내면, 평창, 강릉 왕산, 정선 임계, 태백, 삼척 하장 포함)
- 단위: **t·ha·h / (ha·MJ·mm)** (SI). 미국 관용단위로 바꾸려면 0.1317로 나눈다.
- 자료 없음(바다 등) 값: `-9999`

## 2. 사용한 공개자료

| 자료 | 제공 | 내용 | 라이선스 / 접근 |
|---|---|---|---|
| SoilGrids 2.0 | ISRIC – World Soil Information | 모래(sand)·미사(silt)·점토(clay) [g/kg], 유기탄소(soc) [dg/kg], 0–5 cm·5–15 cm 평균, 250 m | CC-BY 4.0, WCS(`maps.isric.org`)에서 바로 내려받음 (가입·신청 없음) |

출처 표기: Poggio, L. et al. (2021). SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. *SOIL* 7: 217–240. https://doi.org/10.5194/soil-7-217-2021

## 3. 산정 방법

1. **표토 0–15 cm 평균**: 0–5 cm와 5–15 cm 값을 층 두께(5:10)로 가중평균했다. 경운층 깊이에 맞춘 것이다.
2. **입경 비율 정규화**: 모래+미사+점토 합이 100%가 되도록 맞췄다. 유기탄소는 dg/kg ÷ 100으로 %로 바꿨다.
3. **K 계산: Williams (1995) EPIC 식**. 입경 분포와 유기탄소만으로 K를 구한다. Wischmeier 노모그래프에 필요한 극세사 비율·토양구조·투수등급은 공개 격자자료에 없어서 쓰지 않았다.

```
K = f_csand · f_cl-si · f_orgC · f_hisand × 0.1317

f_csand  = 0.2 + 0.3·exp[−0.256·SAN·(1 − SIL/100)]
f_cl-si  = [SIL / (CLA + SIL)]^0.3
f_orgC   = 1 − 0.25·C / [C + exp(3.72 − 2.95·C)]
f_hisand = 1 − 0.7·SN1 / [SN1 + exp(−5.51 + 22.9·SN1)],  SN1 = 1 − SAN/100
(SAN, SIL, CLA: 모래·미사·점토 %, C: 유기탄소 %)
```

4. **지역 백분위(`K_percentile`)**: 범위 안 전체 격자에서 그 격자의 K가 몇 % 지점에 있는지 나타낸다. 서비스 문서의 "같은 지역 안 상대 순위" 방식에 맞춘 값이다.
5. **EPSG:5186 변환**: 250 m 격자로 쌍선형 보간했다.

## 4. 결과 요약

| 통계 | K (SI) |
|---|---|
| 평균 | 0.0170 |
| 최소 – 최대 | 0.0158 – 0.0198 |
| 하위 25% – 상위 25% | 0.0167 – 0.0171 |

토성은 식양토(53%)와 양토(47%)가 대부분이다.

| 대표 지점 | 토성 | K (3×3 평균) | 지역 백분위 |
|---|---|---|---|
| 강릉 왕산면 안반데기 | 양토 | 0.0172 | 76 |
| 평창 대관령면 횡계 | 양토 | 0.0169 | 45 |
| 평창 진부면 | 식양토 | 0.0168 | 55 |
| 홍천 내면 자운리 | 양토 | 0.0172 | 79 |
| 정선 임계면 | 식양토 | 0.0165 | 4 |
| 삼척 하장면 귀네미마을 | 식양토 | 0.0168 | 35 |
| 태백 매봉산 | 양토 | 0.0175 | 91 |

지점 좌표는 마을·단지 중심의 근사값이다. 필지 단위 값이 아니다.

## 5. 한계 (보고서에 그대로 써도 됨)

- **해상도**: SoilGrids는 전 지구 모델 예측값이고 격자가 250 m다. 정밀토양도(1:25,000)보다 거칠고, 필지 하나는 보통 격자 1칸 안에 들어간다.
- **값의 폭이 좁다**: 범위 전체에서 K가 0.016–0.020으로 거의 같다. SoilGrids가 산림 토양의 높은 유기탄소(약 4–6%)를 반영해 `f_orgC`가 하한(0.75)에 붙고, 입경 비율도 지역 안에서 크게 다르지 않기 때문이다. 따라서 이 자료만으로 "② 토양 취약형"을 가려내기는 어렵다. 위험 순위를 정할 때는 LS·C의 차이가 결과를 좌우한다.
- **절댓값은 낮게 나올 수 있다**: 실제 고랭지 밭은 경작으로 유기물이 줄고 사질 풍화토가 많다. 그래서 국내 토양통별 K값보다 이 자료의 값이 낮을 가능성이 있다. 이 K는 **상대 비교용**으로 쓰고, 유실량(t/ha)의 절댓값을 주장하는 근거로 쓰지 않는다.
- **분석상 처리 제안**: 필지 취약도 계산에서는 K를 (a) 지역 평균값 0.017로 고정하거나 (b) 백분위로 넣되 가중치를 낮춘다. 어느 쪽을 택했는지 보고서에 적는다.

## 6. 정밀도를 높이려면 (신청 필요, 선택 사항)

신청 없는 공개자료만으로는 위 해상도가 한계다. 더 정밀한 값이 필요하면 아래 자료가 다음 단계다. 둘 다 **활용신청이 필요하다**.

- 공공데이터포털 「농촌진흥청 국립농업과학원_토양도 기반 토양특성 상세 정보 V3」(OpenAPI, data.go.kr/data/15144225): 필지 위치의 토양통·토성을 조회할 수 있다. 활용신청 후 인증키를 받아야 한다.
- 흙토람(soil.rda.go.kr) 정밀토양도: 토양통별로 K를 붙이면 1:25,000 해상도가 된다.

참고로 「농촌진흥청 국립농업과학원_토양종류(토양통) 목록 데이터」(data.go.kr/data/15067775)는 신청 없이 볼 수 있지만, 토양통 설명표(PDF)일 뿐 지도가 아니어서 이번 산정에는 쓰지 않았다.

## 7. 다시 만들기

```bash
pip install numpy pandas rasterio pyproj matplotlib
# 1) SoilGrids 내려받기 (sand, silt, clay, soc × 0-5cm, 5-15cm = 8개 파일)
for p in sand silt clay soc; do for d in 0-5cm 5-15cm; do
  curl -o ${p}_${d}.tif "https://maps.isric.org/mapserv?map=/map/${p}.map&SERVICE=WCS&VERSION=2.0.1&REQUEST=GetCoverage&COVERAGEID=${p}_${d}_mean&FORMAT=image/tiff&SUBSET=long(128.2,129.3)&SUBSET=lat(37.0,38.0)&SUBSETTINGCRS=http://www.opengis.net/def/crs/EPSG/0/4326&OUTPUTCRS=http://www.opengis.net/def/crs/EPSG/0/4326&RESOLUTION=long(0.002083333)&RESOLUTION=lat(0.002083333)"
done; done
# 2) K 산정
python make_k_factor.py <tif 폴더> <출력 폴더>
```

범위를 바꾸려면 내려받기 URL의 `SUBSET` 값과 스크립트의 `BBOX`를 같이 고친다.

## 참고 문헌

- Williams, J.R. (1995). The EPIC model. In: Singh, V.P. (ed.), *Computer Models of Watershed Hydrology*. Water Resources Publications, pp. 909–1000.
- Sharpley, A.N., Williams, J.R. (1990). EPIC – Erosion/Productivity Impact Calculator: 1. Model Documentation. USDA Technical Bulletin No. 1768.
- Renard, K.G. et al. (1997). Predicting Soil Erosion by Water: A Guide to Conservation Planning with RUSLE. USDA Agriculture Handbook No. 703.
- Poggio, L. et al. (2021). SoilGrids 2.0. *SOIL* 7: 217–240.
