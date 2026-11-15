import glob, numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
for f in glob.glob('node_modules/pretendard/dist/public/static/*.otf'): fm.fontManager.addfont(f)
plt.rcParams.update({'font.family':'Pretendard','axes.unicode_minus':False})
COL=['#1E7A46','#4C8FD6','#E39A2D','#B8457A']
rng=np.random.RandomState(3)
cent=np.array([[2,7],[7.5,7.5],[3,2.2],[8,2.5]])
X=np.vstack([c+rng.randn(45,2)*0.95 for c in cent])
init=np.array([[4.5,5.2],[5.5,5.5],[5.0,4.0],[6.0,4.4]])
def assign(C): return ((X[:,None]-C[None])**2).sum(2).argmin(1)
C=init.copy(); lab0=assign(C); C1=np.array([X[lab0==k].mean(0) for k in range(4)])
Cf=C1.copy()
for _ in range(20):
    l=assign(Cf); Cf=np.array([X[l==k].mean(0) for k in range(4)])
labf=assign(Cf)
fig,axs=plt.subplots(1,4,figsize=(13,3.6),dpi=200)
titles=['① 중심 k개 놓기','② 가까운 중심에 배정','③ 그룹 평균으로 중심 이동','④ 바뀌지 않을 때까지 반복']
for i,a in enumerate(axs):
    a.set_xticks([]);a.set_yticks([]);a.set_xlim(-1.5,11);a.set_ylim(-1.5,11)
    for s in a.spines.values(): s.set_color('#DDDDDD')
    a.set_facecolor('white'); a.set_title(titles[i],fontsize=15,fontweight='bold',color='#2F4F2F',pad=8)
axs[0].scatter(X[:,0],X[:,1],s=22,color='#BDBDBD',linewidths=0)
for k in range(4): axs[0].scatter(*init[k],s=230,marker='X',color=COL[k],edgecolor='white',linewidth=1.5,zorder=5)
for k in range(4):
    axs[1].scatter(X[lab0==k,0],X[lab0==k,1],s=22,color=COL[k],alpha=.75,linewidths=0)
    axs[1].scatter(*init[k],s=230,marker='X',color=COL[k],edgecolor='white',linewidth=1.5,zorder=5)
for k in range(4):
    axs[2].scatter(X[lab0==k,0],X[lab0==k,1],s=22,color=COL[k],alpha=.35,linewidths=0)
    axs[2].annotate('',xy=C1[k],xytext=init[k],arrowprops=dict(arrowstyle='-|>',color='#333',lw=1.6),zorder=6)
    axs[2].scatter(*init[k],s=120,marker='X',color='#CFCFCF',zorder=4)
    axs[2].scatter(*C1[k],s=230,marker='X',color=COL[k],edgecolor='white',linewidth=1.5,zorder=5)
for k in range(4):
    axs[3].scatter(X[labf==k,0],X[labf==k,1],s=22,color=COL[k],alpha=.8,linewidths=0)
    axs[3].scatter(*Cf[k],s=260,marker='X',color=COL[k],edgecolor='white',linewidth=1.5,zorder=5)
fig.tight_layout(w_pad=1.2); fig.savefig('img_kmeans.png',facecolor='white'); plt.close(fig)
