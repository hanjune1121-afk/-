import sys, json, numpy as np, pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score
from sklearn.decomposition import PCA
B=sys.argv[1]
m=json.load(open(B+'/02_모델/model_field_focus.json',encoding='utf-8-sig'))
keys=['REGION_KEY','ID','UID']
d=pd.read_csv(B+'/04_입력과예제/학습입력_41피처.csv',dtype=dict.fromkeys(keys,str),encoding='utf-8-sig')
blocks=[];dims={}
for name,s in m['normalizer'].items():
    g=s['group'];a=d[g['columns']].to_numpy(dtype=float,copy=True)
    if g['kind']=='composition': a/=a.sum(1,keepdims=True)
    else:
        for j,c in enumerate(g['columns']):
            if c in g.get('log1p',[]): a[:,j]=np.log1p(a[:,j])
    mean=np.array(s['mean']);sd=np.array(s['sd']);active=np.array(s['active'],bool)
    div=np.where(active,sd,1) if g['kind']=='numeric' else np.ones(len(sd))
    z=(a-mean)/div; blk=z[:,active]/s['scale']*np.sqrt(g['weight']); blocks.append(blk); dims[name]=(len(g['columns']),int(active.sum()),g['weight'])
x=np.column_stack(blocks); C=np.array(m['centers'])
lab=((x[:,None,:]-C[None])**2).sum(2).argmin(1)+1
out={'dims':dims,'xshape':x.shape}
cmp=pd.read_csv(B+'/04_입력과예제/전체필지_모델비교.csv',dtype=dict.fromkeys(keys,str),encoding='utf-8-sig')
mm=d[keys].merge(cmp,on=keys,how='left')
out['label_match']=float((mm.field_focus_cluster.values==lab).mean())
out['counts']=pd.Series(lab).value_counts().sort_index().to_dict()
# status per cluster
cmp['assigned']=cmp.field_focus_geometric_assigned.fillna(0)>0
out['status_total']={'all':len(cmp),'trained':int(cmp.학습포함.sum()),'assigned':int(cmp.assigned.sum())}
out['assigned_by_cluster']=cmp[cmp.학습포함].groupby('field_focus_cluster').assigned.agg(['sum','count']).to_dict()
# k sweep
rng=np.random.RandomState(42); idx=rng.choice(len(x),6000,replace=False); ks={}
for k in range(2,9):
    km=KMeans(k,n_init=10,random_state=19,max_iter=500).fit(x)
    ks[k]={'inertia':float(km.inertia_),'sil':float(silhouette_score(x[idx],km.labels_[idx]))}
    print(k,ks[k],flush=True)
out['k']=ks
p=PCA(2).fit(x); out['pca_var']=p.explained_variance_ratio_.tolist(); Z=p.transform(x); np.save('pca.npy',np.c_[Z,lab])
d['cluster']=lab; d.to_csv('raw_with_cluster.csv',index=False,encoding='utf-8-sig')
reg=pd.crosstab(d.REGION_KEY,d.cluster); out['region_cluster']=reg.to_dict()
# region elevation stats incl excluded rows? use trained
out['region_elev']=d.groupby('REGION_KEY').ELEV_MEAN.agg(['count','median',lambda s:(s>=400).mean(),lambda s:(s>=600).mean()]).round(3).to_dict()
out['all_elev']={'median':float(d.ELEV_MEAN.median()),'ge400':float((d.ELEV_MEAN>=400).mean()),'ge600':float((d.ELEV_MEAN>=600).mean())}
feats=['LS_mean','ELEV_MEAN','R_2025_RANK1','RAIN_PRIMARY_obs_max_60min_mm','RAIN_PRIMARY_obs_max_calendar_day_mm','R_summer_JunSep_share','PCT_221','PCT_222','GEOM_AREA_M2']
zs=(d.groupby('REGION_KEY')[feats].mean()-d[feats].mean())/d[feats].std(ddof=0)
out['region_z']=zs.round(2).to_dict()
out['region_med']=d.groupby('REGION_KEY')[feats].median().round(2).to_dict()
out['region_nuniq_rain']=d.groupby('REGION_KEY')[['R_2025_RANK1','RAIN_PRIMARY_obs_max_60min_mm']].nunique().to_dict()
out['rain_nuniq']=d[['R_2025_RANK1','RAIN_PRIMARY_obs_max_60min_mm','RAIN_PRIMARY_obs_max_calendar_day_mm','R_summer_JunSep_share']].nunique().to_dict()
cf=['LS_mean','ELEV_MEAN','GEOM_AREA_M2','ELONGATION','COMPACTNESS','PCT_221','PCT_222','PCT_423','R_2025_RANK1','R_summer_JunSep_share','RAIN_PRIMARY_obs_max_60min_mm','RAIN_PRIMARY_obs_max_calendar_day_mm','RAIN_PRIMARY_estimated_top5_EI30_share']
out['cl_med']=d.groupby('cluster')[cf].median().round(3).to_dict()
out['cl_mean']=d.groupby('cluster')[cf].mean().round(3).to_dict()
out['all_med']=d[cf].median().round(3).to_dict()
out['skew']={c:[round(float(d[c].skew()),2),round(float(np.log1p(d[c]).skew()),2)] for c in ['LS_mean','GEOM_AREA_M2','ELONGATION','R_2025_RANK1','RAIN_PRIMARY_obs_max_60min_mm','RAIN_PRIMARY_obs_max_calendar_day_mm']}
# between share per group recompute
gm=x.mean(0); cols=[];
for name,(n,a,w) in dims.items(): cols+= [name]*a
cols=np.array(cols); ssb=np.zeros(x.shape[1])
for c in range(1,5):
    xc=x[lab==c]; ssb+=len(xc)*(xc.mean(0)-gm)**2
out['between_group']={g:float(ssb[cols==g].sum()/ssb.sum()) for g in dims}
json.dump(out,open('an.json','w'),ensure_ascii=False,indent=1,default=str)
print(json.dumps({k:v for k,v in out.items() if k not in('k',)},ensure_ascii=False,default=str)[:6000])
