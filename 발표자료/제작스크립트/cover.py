import numpy as np
from scipy import ndimage
from PIL import Image, ImageFilter, ImageDraw
W,H=1480,800
rng=np.random.default_rng(7)
yy,xx=np.mgrid[0:H,0:W].astype(float)
# seeds (jittered grid for field-like parcels)
seeds=[]
for gy in np.linspace(40,H-40,6):
    for gx in np.linspace(40,W-40,10):
        seeds.append((gx+rng.uniform(-55,55),gy+rng.uniform(-45,45)))
seeds=np.array(seeds)
# domain warp so borders are slightly organic
wx=ndimage.gaussian_filter(rng.normal(size=(H,W)),40)*900; wy=ndimage.gaussian_filter(rng.normal(size=(H,W)),40)*900
d=((xx[...,None]+wx[...,None]-seeds[:,0])**2+(yy[...,None]+wy[...,None]-seeds[:,1])**2)
lab=d.argmin(-1)
# class assignment: forest on upper-left & right ridges, paddy near river, grass scattered
river_y=H*0.78+60*np.sin(xx/170.0)+30*np.sin(xx/63.0)
cls={}
for i,(sx,sy) in enumerate(seeds):
    ry=H*0.78+60*np.sin(sx/170.0)+30*np.sin(sx/63.0)
    if sy<H*0.22 or (sx>W*0.83 and sy<H*0.6) or (sx<W*0.12 and sy<H*0.55): c='forest'
    elif abs(sy-ry)<95: c='paddy'
    elif rng.random()<0.16: c='grass'
    else: c='field'
    cls[i]=c
cls[ [i for i in range(len(seeds)) if cls[i]=='field'][rng.integers(0,3)] ]='field'
img=np.zeros((H,W,3))
fine=rng.normal(size=(H,W))
canopy=ndimage.gaussian_filter(rng.normal(size=(H,W)),2.2); canopy=(canopy-canopy.mean())/canopy.std()
canopy2=ndimage.gaussian_filter(rng.normal(size=(H,W)),9); canopy2=(canopy2-canopy2.mean())/canopy2.std()
field_pal=[(0.62,0.70,0.40),(0.55,0.66,0.36),(0.70,0.62,0.45),(0.48,0.60,0.32),(0.66,0.56,0.40)]
for i,c in cls.items():
    m=lab==i
    if c=='forest':
        v=0.5+0.18*canopy[m]+0.08*canopy2[m]
        col=np.stack([0.13+0.10*v,0.27+0.16*v,0.14+0.07*v],-1)
    elif c=='paddy':
        g=((np.mod(xx[m]+yy[m]*0.2,26)<1.4)|(np.mod(yy[m],22)<1.4))
        base=np.array([0.38,0.58,0.50]); col=np.tile(base,(m.sum(),1))+0.02*fine[m][:,None]; col[g]=col[g]*0.82
    elif c=='grass':
        v=ndimage.gaussian_filter(rng.normal(size=(H,W)),1.5)[m]
        col=np.stack([0.66+0.05*v,0.72+0.05*v,0.42+0.03*v],-1)
    else:
        th=rng.uniform(0,np.pi); per=rng.uniform(9,15)
        s=np.sin((xx[m]*np.cos(th)+yy[m]*np.sin(th))*2*np.pi/per)
        base=np.array(field_pal[i%len(field_pal)])
        bare=rng.random()<0.35
        if bare: base=np.array([0.62,0.50,0.38])
        col=base+np.where(s>0.15,0.06,-0.05)[:,None]+0.015*fine[m][:,None]
    img[m]=col
# river
rv=np.abs(yy-river_y)<9
img[rv]=np.array([0.36,0.50,0.58])+0.02*fine[rv][:,None]
# road
road=np.abs(xx-(W*0.42+0.35*(yy-H*0.5)+40*np.sin(yy/120)))<4.5
img[road&~rv]=np.array([0.80,0.78,0.72])
# parcel borders
ckey={'forest':0,'paddy':1,'grass':2,'field':3}
cm=np.vectorize(lambda i: ckey[cls[i]])(lab)
e0=(lab!=np.roll(lab,1,0)); e1=(lab!=np.roll(lab,1,1))
same0=(cm==np.roll(cm,1,0)); same1=(cm==np.roll(cm,1,1))
keep=lambda e,same: e & ~(same & (cm==0))
edge=keep(e0,same0)|keep(e1,same1)
edge=ndimage.binary_dilation(edge,iterations=1)
img[edge]=img[edge]*0.72
np.save('cm.npy',cm)
img=np.clip(img,0,1)
im=Image.fromarray((img*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
# highlight one field parcel near center
cand=[i for i,c in cls.items() if c=='field']
ci=min(cand,key=lambda i:(seeds[i,0]-W*0.55)**2+(seeds[i,1]-H*0.48)**2)
m=(lab==ci)
outline=m & ~ndimage.binary_erosion(m,iterations=4)
arr=np.array(im).astype(float)
inner=m & ~outline
arr[inner]=arr[inner]*0.75+np.array([255,236,150])*0.25
arr[outline]=np.array([255,214,64])
# vignette
r=np.sqrt(((xx-W/2)/(W/2))**2+((yy-H/2)/(H/2))**2)
arr=arr*(1-0.18*np.clip(r-0.6,0,1))[...,None]
Image.fromarray(np.clip(arr,0,255).astype(np.uint8)).save('cover_plain.png')
print('parcel center',seeds[ci])
