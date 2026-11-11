import sys, glob, numpy as np, pandas as pd, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
for f in glob.glob('node_modules/pretendard/dist/public/static/*.otf'): fm.fontManager.addfont(f)
plt.rcParams.update({'font.family':'Pretendard','axes.unicode_minus':False,'axes.spines.top':False,'axes.spines.right':False,
 'axes.edgecolor':'#BDBDBD','xtick.color':'#555','ytick.color':'#555','axes.labelcolor':'#555','font.size':13})
D=sys.argv[1]
raw=pd.read_csv(D+'/01_데이터/군집학습_44피처_군집번호포함.csv',dtype={'ID':str,'UID':str},encoding='utf-8-sig')
COL={1:'#1E7A46',2:'#4C8FD6',3:'#E39A2D',4:'#B8457A'}
GREEN='#4F6F4C'; LG='#8FBC7F'
# --- histogram before/after log
fig,ax=plt.subplots(2,3,figsize=(12,5.2),dpi=200)
items=[('LS_mean','LS (지형)',60),('GEOM_AREA_M2','필지 면적 (㎡)',20000),('STREAM_PARCEL_M','하천거리 (m)',300)]
for j,(c,t,cap) in enumerate(items):
    x=raw[c]
    ax[0,j].hist(x.clip(upper=cap),bins=45,color='#BDBDBD',edgecolor='white',linewidth=.4)
    ax[0,j].set_title(f'{t}',fontsize=15,fontweight='bold',color='#222',loc='left')
    ax[0,j].text(.97,.9,f'원자료 · 왜도 {x.skew():+.2f}',transform=ax[0,j].transAxes,ha='right',fontsize=12.5,color='#555')
    y=np.log1p(x)
    ax[1,j].hist(y,bins=45,color=GREEN,edgecolor='white',linewidth=.4)
    ax[1,j].text(.97,.9,f'ln(1+x) · 왜도 {y.skew():+.2f}',transform=ax[1,j].transAxes,ha='right',fontsize=12.5,color='#2F5D2C',fontweight='bold')
    for a in ax[:,j]:
        a.set_ylim(top=a.get_ylim()[1]*1.22)
        a.yaxis.grid(True,color='#EEE'); a.set_axisbelow(True); a.tick_params(labelsize=11,length=0)
ax[0,0].set_ylabel('필지 수'); ax[1,0].set_ylabel('필지 수')
fig.tight_layout(h_pad=1.2); fig.savefig('img_hist.png',facecolor='white'); plt.close(fig)
# --- PCA scatter
Z=np.load('pca.npy'); rng=np.random.RandomState(0); idx=rng.permutation(len(Z))[:9000]
fig,ax=plt.subplots(figsize=(7.2,5.6),dpi=200)
for k in (3,2,4,1):
    m=idx[Z[idx,2]==k]; ax.scatter(Z[m,0],Z[m,1],s=7,color=COL[k],alpha=.45,linewidths=0)
for k in (1,2,3,4):
    c=Z[Z[:,2]==k][:,:2].mean(0)
    ax.scatter(*c,s=260,color=COL[k],edgecolor='white',linewidth=2.5,zorder=5)
    ax.annotate(f'{k}번',c,xytext=(0,14),textcoords='offset points',ha='center',fontsize=15,fontweight='bold',color='#222',zorder=6,
                bbox=dict(boxstyle='round,pad=.25',fc='white',ec='none',alpha=.85))
ax.set_xlabel('주성분 1 (분산 19.4%)'); ax.set_ylabel('주성분 2 (분산 14.0%)')
ax.grid(True,color='#EEE'); ax.set_axisbelow(True); ax.tick_params(length=0,labelsize=11)
fig.tight_layout(); fig.savefig('img_pca.png',facecolor='white'); plt.close(fig)
# --- box plots (individual)
def box(c,title,fname,scale=1,symlog=False,unit='',size=(4.3,3.3),fmt='{:.1f}'):
    fig,ax=plt.subplots(figsize=size,dpi=200)
    data=[raw.loc[raw.cluster==k,c].values*scale for k in (1,2,3,4)]
    bp=ax.boxplot(data,showfliers=False,patch_artist=True,widths=.55,medianprops=dict(color='white',linewidth=2.2),
                  whiskerprops=dict(color='#888'),capprops=dict(color='#888'))
    for p,k in zip(bp['boxes'],(1,2,3,4)): p.set(facecolor=COL[k],edgecolor=COL[k])
    if symlog: ax.set_yscale('symlog',linthresh=1); ax.set_ylim(bottom=-0.15)
    ax.set_xticks([1,2,3,4]); ax.set_xticklabels(['1번','2번','3번','4번'],fontsize=13,color='#222')
    ax.set_title(title,fontsize=15,fontweight='bold',color='#222',loc='left',pad=10)
    ax.yaxis.grid(True,color='#EEE'); ax.set_axisbelow(True); ax.tick_params(length=0,labelsize=11)
    for i,d in enumerate(data):
        md=np.median(d); q3=np.percentile(d,75)
        ax.annotate(fmt.format(md),(i+1.3,md),fontsize=10.5,color='#333',va='center',ha='left')
    ax.set_xlim(.5,4.85)
    fig.tight_layout(); fig.savefig(fname,facecolor='white'); plt.close(fig)
box('LS_mean','LS · 지형 부담','box_ls.png')
box('R_2025_RANK1','연간 R · 강우 침식력','box_r.png',fmt='{:,.0f}')
box('STREAM_PARCEL_M','하천거리 (m, 로그축)','box_stream.png',symlog=True)
box('TC_canopy_EI30_weighted_pct_partial','EI30 가중 피복률 (%, 가정)','box_tc.png')
box('R_summer_JunSep_share','6~9월 R 비중 (%)','box_summer.png',scale=100)
box('GEOM_AREA_M2','필지 면적 (㎡)','box_area.png',fmt='{:,.0f}')
box('TC_low_canopy_EI30_fraction_annual_known_only','저피복 구간 EI30 비중 (%, 가정)','box_low.png',scale=100)
box('RAIN_PRIMARY_obs_max_60min_mm','최대 1시간 강수량 (mm)','box_60.png')
box('PCT_221','경지정리 밭 비율 (%)','box_221.png',fmt='{:.0f}')
box('ELEV_MEAN','평균 고도 (m)','box_elev.png',fmt='{:.0f}')
# 밭 유형 stacked (mean share) small chart
print(raw.groupby('cluster')[['R_2025_RANK1','RAIN_PRIMARY_obs_max_60min_mm','TC_canopy_EI30_weighted_pct_partial']].nunique())
print(raw.groupby('cluster')['RAIN_PRIMARY_obs_max_60min_mm'].quantile([.25,.5,.75]).unstack())
print(raw.groupby('cluster')['LS_mean'].quantile([.25,.5,.75]).unstack())
