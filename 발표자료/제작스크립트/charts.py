import glob, numpy as np, pandas as pd, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
for f in glob.glob('node_modules/pretendard/dist/public/static/*.otf'): fm.fontManager.addfont(f)
plt.rcParams.update({'font.family':'Pretendard','axes.unicode_minus':False,'axes.spines.top':False,'axes.spines.right':False,
 'axes.edgecolor':'#BDBDBD','xtick.color':'#555','ytick.color':'#555','axes.labelcolor':'#555','font.size':13})
raw=pd.read_csv('raw_with_cluster.csv',dtype={'ID':str,'UID':str},encoding='utf-8-sig')
COL={1:'#1E7A46',2:'#4C8FD6',3:'#E39A2D',4:'#B8457A'}; GREEN='#4F6F4C'
# Q2 check
prot=raw[['PCT_311','PCT_321','PCT_331','PCT_411','PCT_423']].sum(1)
q75=raw.LS_mean.quantile(.75); rmed=raw.R_2025_RANK1.median(); pmed=prot.median()
print('LSq75',q75,'Rmed',rmed,'protmed',pmed)
for c in range(1,5):
    s=raw.cluster==c
    print(c, raw.LS_mean[s].median()>q75, raw.R_2025_RANK1[s].median()>rmed, prot[s].median()<pmed, round(prot[s].median(),2))
# hist
fig,ax=plt.subplots(2,3,figsize=(12,5.2),dpi=200)
items=[('LS_mean','LS (지형)',60),('GEOM_AREA_M2','필지 면적 (㎡)',20000),('ELONGATION','장단축비',8)]
for j,(c,t,cap) in enumerate(items):
    x=raw[c]
    ax[0,j].hist(x.clip(upper=cap),bins=45,color='#BDBDBD',edgecolor='white',linewidth=.4)
    ax[0,j].set_title(t,fontsize=15,fontweight='bold',color='#222',loc='left')
    ax[0,j].text(.97,.9,f'원자료 · 왜도 {x.skew():+.2f}',transform=ax[0,j].transAxes,ha='right',fontsize=12.5,color='#555')
    y=np.log1p(x)
    ax[1,j].hist(y,bins=45,color=GREEN,edgecolor='white',linewidth=.4)
    ax[1,j].text(.97,.9,f'ln(1+x) · 왜도 {y.skew():+.2f}',transform=ax[1,j].transAxes,ha='right',fontsize=12.5,color='#2F5D2C',fontweight='bold')
    for a in ax[:,j]:
        a.set_ylim(top=a.get_ylim()[1]*1.22); a.yaxis.grid(True,color='#EEE'); a.set_axisbelow(True); a.tick_params(labelsize=11,length=0)
ax[0,0].set_ylabel('필지 수'); ax[1,0].set_ylabel('필지 수')
fig.tight_layout(h_pad=1.2); fig.savefig('img_hist.png',facecolor='white'); plt.close(fig)
# PCA
Z=np.load('pca.npy'); rng=np.random.RandomState(0); idx=rng.permutation(len(Z))[:9000]
fig,ax=plt.subplots(figsize=(7.2,5.6),dpi=200)
for k in (4,3,2,1):
    m=idx[Z[idx,2]==k]; ax.scatter(Z[m,0],Z[m,1],s=7,color=COL[k],alpha=.42,linewidths=0)
for k in (1,2,3,4):
    c=Z[Z[:,2]==k][:,:2].mean(0)
    ax.scatter(*c,s=260,color=COL[k],edgecolor='white',linewidth=2.5,zorder=5)
    ax.annotate(f'{k}번',c,xytext=(0,14),textcoords='offset points',ha='center',fontsize=15,fontweight='bold',color='#222',zorder=6,
                bbox=dict(boxstyle='round,pad=.25',fc='white',ec='none',alpha=.88))
v=pd.Series([0])
ax.set_xlabel('주성분 1 (분산 31.3%)'); ax.set_ylabel('주성분 2 (분산 21.8%)')
ax.grid(True,color='#EEE'); ax.set_axisbelow(True); ax.tick_params(length=0,labelsize=11)
fig.tight_layout(); fig.savefig('img_pca.png',facecolor='white'); plt.close(fig)
# box plots
def box(c,title,fname,scale=1,fmt='{:.1f}',size=(4.3,4.0),log=False):
    fig,ax=plt.subplots(figsize=size,dpi=200)
    data=[raw.loc[raw.cluster==k,c].values*scale for k in (1,2,3,4)]
    bp=ax.boxplot(data,showfliers=False,patch_artist=True,widths=.55,medianprops=dict(color='white',linewidth=2.2),
                  whiskerprops=dict(color='#888'),capprops=dict(color='#888'))
    for p,k in zip(bp['boxes'],(1,2,3,4)): p.set(facecolor=COL[k],edgecolor=COL[k])
    if log: ax.set_yscale('log')
    ax.set_xticks([1,2,3,4]); ax.set_xticklabels(['1번','2번','3번','4번'],fontsize=13,color='#222')
    ax.set_title(title,fontsize=15,fontweight='bold',color='#222',loc='left',pad=10)
    ax.yaxis.grid(True,color='#EEE'); ax.set_axisbelow(True); ax.tick_params(length=0,labelsize=11)
    for i,d in enumerate(data):
        md=np.median(d); ax.annotate(fmt.format(md),(i+1.3,md),fontsize=10.5,color='#333',va='center',ha='left')
    ax.set_xlim(.5,4.85); fig.tight_layout(); fig.savefig(fname,facecolor='white'); plt.close(fig)
box('LS_mean','LS · 지형 부담','box_ls.png')
box('ELEV_MEAN','평균 고도 (m)','box_elev.png',fmt='{:.0f}')
box('PCT_221','경지정리된 밭 비율 (%)','box_221.png',fmt='{:.0f}')
box('PCT_222','경지정리 안 된 밭 비율 (%)','box_222.png',fmt='{:.0f}')
box('GEOM_AREA_M2','필지 면적 (㎡)','box_area.png',fmt='{:,.0f}')
box('R_2025_RANK1','연간 R · 강우 침식력','box_r.png',fmt='{:,.0f}')
box('R_summer_JunSep_share','6~9월 R 비중 (%)','box_summer.png',scale=100)
box('ELONGATION','장단축비','box_elong.png',fmt='{:.2f}')
box('COMPACTNESS','형상 조밀도','box_comp.png',fmt='{:.2f}')
