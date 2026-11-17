import sys, json, numpy as np, pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
from scipy import stats
B=sys.argv[1]; K=['REGION_KEY','ID','UID']
d=pd.read_csv(B+'/02_피처와데이터/preprocessed_input_40.csv',dtype=dict.fromkeys(K,str),encoding='utf-8-sig')
X=pd.read_csv(B+'/02_피처와데이터/model_matrix.csv',dtype=dict.fromkeys(K,str),encoding='utf-8-sig')
assert (d.UID.values==X.UID.values).all() and (d.cluster.values==X.cluster.values).all()
zc=[c for c in X.columns if c.startswith('z')]; M=X[zc].values; lab=X.cluster.values.astype(int)
out={'shape':M.shape,'counts':pd.Series(lab).value_counts().sort_index().to_dict()}
# check model centers reproduce
m=json.load(open(B+'/03_모델/model_final40.json',encoding='utf-8-sig')); print(list(m.keys()))
C=np.array(m['centers']); pred=((M[:,None]-C[None])**2).sum(2).argmin(1)
print('center-match', (pred+1==lab).mean(), (pred==lab).mean())
rng=np.random.RandomState(42); idx=rng.choice(len(M),6000,replace=False); ks={}
for k in range(2,9):
    km=KMeans(k,n_init=10,random_state=42,max_iter=500).fit(M)
    ks[k]={'inertia':float(km.inertia_),'sil':float(silhouette_score(M[idx],km.labels_[idx]))}; print(k,ks[k],flush=True)
out['k']=ks
p=PCA(2).fit(M); out['pca']=p.explained_variance_ratio_.tolist(); np.save('pca.npy',np.c_[p.transform(M),lab])
out['region_cluster']=pd.crosstab(d.REGION_KEY,d.cluster).to_dict()
out['region_station']=d.groupby('REGION_KEY').station_id.unique().apply(list).to_dict()
feats=[c for c in d.columns if c not in K+['station_id','cluster']]
rows=[]
for f in feats:
    if d[f].nunique()<2: continue
    g=[d.loc[d.cluster==k,f].values for k in range(1,5)]
    F,pv=stats.f_oneway(*g); gm=d[f].mean(); ssb=sum(len(x)*(x.mean()-gm)**2 for x in g); sst=((d[f]-gm)**2).sum()
    H,pk=stats.kruskal(*g)
    rows.append((f,ssb/sst,pv,pk))
r=pd.DataFrame(rows,columns=['f','eta2','p','pk']).sort_values('eta2',ascending=False)
r['q']=stats.false_discovery_control(r.p); r['qk']=stats.false_discovery_control(r.pk)
out['eta']=r.head(14).round(5).values.tolist(); out['n_sig']=[int((r.q<.05).sum()),len(r),int((r.qk<.05).sum())]
prot=d[['PCT_311','PCT_321','PCT_331','PCT_411','PCT_423']].sum(axis=1)
d['prot']=prot
cf=['LS_mean','ELEV_MEAN','PCT_221','PCT_222','PCT_423','prot','spring_rain_mm','summer_rain_mm','autumn_rain_mm','winter_rain_mm','max_daily_mm','max_60min_mm','summer_share']
out['cl_med']=d.groupby('cluster')[cf].median().round(3).to_dict(); out['cl_mean']=d.groupby('cluster')[cf].mean().round(3).to_dict()
out['all_med']=d[cf].median().round(3).to_dict(); out['LSq75']=float(d.LS_mean.quantile(.75))
out['skew']={c:[round(float(d[c].skew()),2),round(float(np.log1p(d[c]).skew()),2)] for c in ['LS_mean','spring_rain_mm','summer_rain_mm','autumn_rain_mm','max_daily_mm','max_60min_mm']}
rf=['LS_mean','ELEV_MEAN','summer_rain_mm','autumn_rain_mm','max_daily_mm','max_60min_mm','summer_share','PCT_221']
out['region_z']=((d.groupby('REGION_KEY')[rf].mean()-d[rf].mean())/d[rf].std(ddof=0)).round(2).to_dict()
out['region_med']=d.groupby('REGION_KEY')[rf].median().round(2).to_dict()
d.to_csv('raw.csv',index=False,encoding='utf-8-sig')
json.dump(out,open('an.json','w'),ensure_ascii=False,indent=1,default=str)
print(json.dumps({k:v for k,v in out.items() if k!='k'},ensure_ascii=False,default=str))
