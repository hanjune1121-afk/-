import glob, numpy as np, pandas as pd, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
for f in glob.glob('node_modules/pretendard/dist/public/static/*.otf'): fm.fontManager.addfont(f)
plt.rcParams.update({'font.family':'Pretendard','axes.unicode_minus':False,'axes.spines.top':False,'axes.spines.right':False,
 'axes.edgecolor':'#BDBDBD','xtick.color':'#555','ytick.color':'#555','axes.labelcolor':'#555','font.size':13})
d=pd.read_csv('raw.csv',dtype={'ID':str,'UID':str},encoding='utf-8-sig')
COL={1:'#B8457A',2:'#4C8FD6',3:'#E39A2D',4:'#1E7A46'}; GREEN='#4F6F4C'
# LS before/after (compact)
fig,ax=plt.subplots(1,2,figsize=(6.4,2.6),dpi=220)
x=d.LS_mean
ax[0].hist(x.clip(upper=50),bins=40,color='#BDBDBD',edgecolor='white',linewidth=.4); ax[0].set_title('변환 전',fontsize=14,fontweight='bold',color='#555',loc='left')
ax[1].hist(np.log1p(x),bins=40,color=GREEN,edgecolor='white',linewidth=.4); ax[1].set_title('변환 후',fontsize=14,fontweight='bold',color='#2F5D2C',loc='left')
for a in ax: a.set_yticks([]); a.spines['left'].set_visible(False); a.tick_params(length=0,labelsize=10)
fig.tight_layout(w_pad=2); fig.savefig('img_ls.png',facecolor='white'); plt.close(fig)
# PCA
Z=np.load('pca.npy'); rng=np.random.RandomState(0); idx=rng.permutation(len(Z))[:9000]
fig,ax=plt.subplots(figsize=(7.2,5.6),dpi=200)
for k in (2,1,3,4):
    m=idx[Z[idx,2]==k]; ax.scatter(Z[m,0],Z[m,1],s=7,color=COL[k],alpha=.42,linewidths=0)
for k in (1,2,3,4):
    c=Z[Z[:,2]==k][:,:2].mean(0)
    ax.scatter(*c,s=260,color=COL[k],edgecolor='white',linewidth=2.5,zorder=5)
    ax.annotate(f'{k}번',c,xytext=(0,14),textcoords='offset points',ha='center',fontsize=15,fontweight='bold',color='#222',zorder=6,bbox=dict(boxstyle='round,pad=.25',fc='white',ec='none',alpha=.88))
ax.set_xlabel('주성분 1 (분산 40.7%)'); ax.set_ylabel('주성분 2 (분산 28.2%)')
ax.grid(True,color='#EEE'); ax.set_axisbelow(True); ax.tick_params(length=0,labelsize=11)
fig.tight_layout(); fig.savefig('img_pca.png',facecolor='white'); plt.close(fig)
def box(c,title,fname,scale=1,fmt='{:.1f}',size=(4.3,3.6)):
    fig,ax=plt.subplots(figsize=size,dpi=200)
    data=[d.loc[d.cluster==k,c].values*scale for k in (1,2,3,4)]
    bp=ax.boxplot(data,showfliers=False,patch_artist=True,widths=.55,medianprops=dict(color='white',linewidth=2.2),whiskerprops=dict(color='#888'),capprops=dict(color='#888'))
    for p,k in zip(bp['boxes'],(1,2,3,4)): p.set(facecolor=COL[k],edgecolor=COL[k])
    ax.set_xticks([1,2,3,4]); ax.set_xticklabels(['1번','2번','3번','4번'],fontsize=14,color='#222',fontweight='bold')
    ax.set_title(title,fontsize=16,fontweight='bold',color='#222',loc='left',pad=10)
    ax.yaxis.grid(True,color='#EEE'); ax.set_axisbelow(True); ax.tick_params(length=0,labelsize=11)
    for i,v in enumerate(data):
        md=np.median(v); ax.annotate(fmt.format(md),(i+1.3,md),fontsize=11.5,color='#222',va='center',ha='left',fontweight='bold')
    ax.set_xlim(.5,4.9); fig.tight_layout(); fig.savefig(fname,facecolor='white'); plt.close(fig)
box('LS_mean','경사 부담 (LS)','box_ls.png')
box('ELEV_MEAN','평균 고도 (m)','box_elev.png',fmt='{:.0f}')
box('PCT_221','경지정리된 밭 비율 (%)','box_221.png',fmt='{:.0f}')
