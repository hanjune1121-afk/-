import numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import LightSource, LinearSegmentedColormap
from scipy import ndimage
from PIL import Image
rng=np.random.default_rng(11)
N=260
y,x=np.mgrid[0:N,0:N]/N
def fbm(n,oct=6):
    z=np.zeros((n,n));amp=1;freq=4
    for o in range(oct):
        g=rng.normal(size=(freq+3,freq+3)); zz=ndimage.zoom(g,(n/(freq+3)),order=3)[:n,:n]
        z+=amp*zz;amp*=0.5;freq*=2
    return z
z=fbm(N)
ridge=2.0*np.exp(-((x-0.32)**2/0.06+(y-0.82)**2/0.10))+1.4*np.exp(-((x-0.80)**2/0.05+(y-0.88)**2/0.07))
valley=-0.5*np.exp(-((x-0.58)**2)/0.025)
Z=0.32*z+ridge+valley+1.1*y
Z=ndimage.gaussian_filter(Z,1.3)
cmap=LinearSegmentedColormap.from_list('t',[(0,'#3d6a36'),(0.35,'#5f8d48'),(0.6,'#86a35f'),(0.82,'#a59069'),(1,'#d9d2c2')])
ls=LightSource(azdeg=300,altdeg=35)
rgb=ls.shade(Z,cmap=cmap,vert_exag=0.7,blend_mode='soft')
# cultivated slopes with clean rows running across the slope
for cx,cy,hw,hh in [(0.42,0.40,0.11,0.07),(0.66,0.30,0.08,0.06),(0.20,0.28,0.07,0.05)]:
    m=(np.abs(x-cx)<hw)&(np.abs(y-cy)<hh)
    rows=np.mod(y*N/3.2,1)<0.5
    soil=np.array([0.66,0.55,0.40]); crop=np.array([0.52,0.66,0.36])
    shade=np.clip(rgb[...,:3].mean(-1,keepdims=True)/0.55,0.75,1.2)
    rgb[m,:3]=np.where(rows[m][:,None],soil,crop)*shade[m]
    edge=m & ~ndimage.binary_erosion(m,iterations=1)
    rgb[edge,:3]=np.array([0.40,0.33,0.24])
fig=plt.figure(figsize=(18,18),dpi=100)
ax=fig.add_axes([0,0,1,1],projection='3d')
ax.plot_surface(x,y,Z,rstride=1,cstride=1,facecolors=rgb,linewidth=0,antialiased=False,shade=False)
ax.plot_wireframe(x,y,Z+0.012,rstride=20,cstride=20,color=(1,1,1,0.22),linewidth=0.6)
ax.view_init(elev=26,azim=-60)
ax.set_box_aspect((1.7,1.0,0.55),zoom=1.3)
ax.set_axis_off(); ax.set_facecolor((0,0,0,0))
fig.savefig('terrain_raw.png',transparent=True)
im=Image.open('terrain_raw.png').convert('RGBA')
bb=im.getbbox(); print('bbox',bb)
cx=(bb[0]+bb[2])//2; w=min(bb[2]-bb[0],1800)-80; h=int(w*800/1480); top=max(bb[1]-50,0); im=im.crop((cx-w//2,top,cx+w//2,top+h)).resize((1480,800),Image.LANCZOS)
W,H=im.size
sky=Image.new('RGBA',(W,H))
px=sky.load()
for j in range(H):
    t=j/H; c=(int(198+30*t),int(212+22*t),int(222+16*t),255)
    for i in range(W): px[i,j]=c
sky.alpha_composite(im)
sky.convert('RGB').save('terrain_plain.png')
