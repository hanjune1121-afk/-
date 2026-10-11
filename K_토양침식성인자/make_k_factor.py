"""RUSLE 토양침식성인자(K) 산정 — 강원 고랭지 일대 (SoilGrids 2.0 공개자료).

입력: ISRIC SoilGrids 2.0 (CC-BY 4.0, 별도 신청 없이 WCS로 내려받음)
      sand, silt, clay [g/kg], soc [dg/kg] — 0-5cm, 5-15cm 평균값
식  : Williams (1995) EPIC 식 → SI 단위 (t·ha·h·ha⁻¹·MJ⁻¹·mm⁻¹)
출력: K GeoTIFF(EPSG:4326, EPSG:5186), 격자 CSV, 고랭지 지점 CSV, 지도 PNG
사용: python make_k_factor.py <SoilGrids tif 폴더> <출력 폴더>
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from pyproj import Transformer

BBOX = (128.2, 37.0, 129.3, 38.0)  # lon_min, lat_min, lon_max, lat_max
WCS = ("https://maps.isric.org/mapserv?map=/map/{p}.map&SERVICE=WCS&VERSION=2.0.1"
       "&REQUEST=GetCoverage&COVERAGEID={p}_{d}_mean&FORMAT=image/tiff"
       "&SUBSET=long(128.2,129.3)&SUBSET=lat(37.0,38.0)"
       "&SUBSETTINGCRS=http://www.opengis.net/def/crs/EPSG/0/4326"
       "&OUTPUTCRS=http://www.opengis.net/def/crs/EPSG/0/4326"
       "&RESOLUTION=long(0.002083333)&RESOLUTION=lat(0.002083333)")
DEPTHS = {"0-5cm": 5, "5-15cm": 10}  # 층 두께로 가중평균 → 표토 0-15cm

# 강원 고랭지 대표 지점 (마을·단지 중심 근사 좌표)
SITES = [  # (지점명, 지도용 영문명, 위도, 경도)
    ("강릉 왕산면 안반데기", "Gangneung Anbandegi", 37.6253, 128.7405),
    ("평창 대관령면 횡계 고랭지", "Pyeongchang Hoenggye", 37.6790, 128.7180),
    ("평창 진부면", "Pyeongchang Jinbu", 37.6380, 128.5650),
    ("홍천 내면 자운리", "Hongcheon Jaun-ri", 37.7810, 128.4700),
    ("정선 임계면", "Jeongseon Imgye", 37.4880, 128.8470),
    ("삼척 하장면 귀네미마을", "Samcheok Gwinemi", 37.2900, 128.9880),
    ("태백 매봉산 고랭지", "Taebaek Maebongsan", 37.2190, 128.9620),
]


def load_topsoil(src_dir, prop):
    acc, wsum, profile = None, 0, None
    for d, w in DEPTHS.items():
        with rasterio.open(src_dir / f"{prop}_{d}.tif") as r:
            a = r.read(1).astype("float64")
            profile = r.profile
        a[a <= 0] = np.nan  # 0 = 바다/자료 없음
        acc = a * w if acc is None else acc + a * w
        wsum += w
    return acc / wsum, profile


def k_epic(sand, silt, clay, oc):
    """Williams (1995) EPIC. sand/silt/clay/oc는 %. 반환값은 SI 단위 K."""
    sn1 = 1 - sand / 100
    f_csand = 0.2 + 0.3 * np.exp(-0.256 * sand * (1 - silt / 100))
    f_clsi = (silt / (clay + silt)) ** 0.3
    f_orgc = 1 - 0.25 * oc / (oc + np.exp(3.72 - 2.95 * oc))
    f_hisand = 1 - 0.7 * sn1 / (sn1 + np.exp(-5.51 + 22.9 * sn1))
    k_us = f_csand * f_clsi * f_orgc * f_hisand  # short ton·ac·h/(100 ac·ft·tonf·in)
    return k_us * 0.1317


def usda_texture(sand, silt, clay):
    out = np.full(sand.shape, "", dtype=object)
    rules = [
        ("식토(Clay)", (clay >= 40) & (silt < 40) & (sand <= 45)),
        ("미사질식토(Silty clay)", (clay >= 40) & (silt >= 40)),
        ("사질식토(Sandy clay)", (clay >= 35) & (sand > 45)),
        ("미사질식양토(Silty clay loam)", (clay >= 27) & (clay < 40) & (sand <= 20)),
        ("식양토(Clay loam)", (clay >= 27) & (clay < 40) & (sand > 20) & (sand <= 45)),
        ("사질식양토(Sandy clay loam)", (clay >= 20) & (clay < 35) & (silt < 28) & (sand > 45)),
        ("미사토(Silt)", (silt >= 80) & (clay < 12)),
        ("미사질양토(Silt loam)", ((silt >= 50) & (clay >= 12) & (clay < 27)) | ((silt >= 50) & (silt < 80) & (clay < 12))),
        ("양토(Loam)", (clay >= 7) & (clay < 27) & (silt >= 28) & (silt < 50) & (sand <= 52)),
        ("사토(Sand)", (silt + 1.5 * clay) < 15),
        ("양질사토(Loamy sand)", ((silt + 1.5 * clay) >= 15) & ((silt + 2 * clay) < 30)),
    ]
    for name, m in rules:
        out[(out == "") & m] = name
    out[(out == "") & ~np.isnan(sand)] = "사양토(Sandy loam)"
    return out


def main(src_dir, out_dir):
    src_dir, out_dir = Path(src_dir), Path(out_dir)
    sand, prof = load_topsoil(src_dir, "sand")
    silt, _ = load_topsoil(src_dir, "silt")
    clay, _ = load_topsoil(src_dir, "clay")
    soc, _ = load_topsoil(src_dir, "soc")

    tot = sand + silt + clay  # g/kg, 합이 1000이 되도록 정규화
    sand_p, silt_p, clay_p = sand / tot * 100, silt / tot * 100, clay / tot * 100
    oc_p = soc / 100  # dg/kg → %
    k = k_epic(sand_p, silt_p, clay_p, oc_p).astype("float32")

    # GeoTIFF (WGS84)
    prof.update(dtype="float32", nodata=-9999.0, count=1, compress="deflate")
    k_out = np.where(np.isnan(k), -9999.0, k).astype("float32")
    tif_4326 = out_dir / "K_factor_강원고랭지_250m_EPSG4326.tif"
    with rasterio.open(tif_4326, "w", **prof) as dst:
        dst.write(k_out, 1)
        dst.update_tags(1, UNITS="t·ha·h/(ha·MJ·mm)", METHOD="Williams(1995) EPIC",
                        SOURCE="ISRIC SoilGrids 2.0, topsoil 0-15cm (CC-BY 4.0)")

    # GeoTIFF (Korea 2000 / Central Belt 2010, EPSG:5186) — 국내 DEM·팜맵과 겹치기용
    dst_crs = "EPSG:5186"
    with rasterio.open(tif_4326) as src:
        tr, w, h = calculate_default_transform(src.crs, dst_crs, src.width, src.height,
                                               *src.bounds, resolution=250)
        p2 = src.profile.copy()
        p2.update(crs=dst_crs, transform=tr, width=w, height=h)
        with rasterio.open(out_dir / "K_factor_강원고랭지_250m_EPSG5186.tif", "w", **p2) as dst:
            reproject(rasterio.band(src, 1), rasterio.band(dst, 1), resampling=Resampling.bilinear,
                      src_nodata=-9999.0, dst_nodata=-9999.0)
            dst.update_tags(1, **src.tags(1))

    # 격자 CSV
    t = prof["transform"]
    rows, cols = np.where(~np.isnan(k))
    k_valid = np.sort(k[rows, cols])
    pct = lambda v: np.searchsorted(k_valid, v, side="left") / k_valid.size * 100  # 지역 내 백분위
    lon = t.c + (cols + 0.5) * t.a
    lat = t.f + (rows + 0.5) * t.e
    x, y = Transformer.from_crs(4326, 5186, always_xy=True).transform(lon, lat)
    grid = pd.DataFrame({
        "lon": lon.round(6), "lat": lat.round(6), "x_5186": np.round(x, 1), "y_5186": np.round(y, 1),
        "sand_pct": sand_p[rows, cols].round(1), "silt_pct": silt_p[rows, cols].round(1),
        "clay_pct": clay_p[rows, cols].round(1), "OC_pct": oc_p[rows, cols].round(2),
        "texture_USDA": usda_texture(sand_p[rows, cols], silt_p[rows, cols], clay_p[rows, cols]),
        "K_SI": k[rows, cols].round(4),
    })
    grid["K_percentile"] = pct(k[rows, cols]).round(1)
    grid.to_csv(out_dir / "K_factor_강원고랭지_격자.csv", index=False, encoding="utf-8-sig")

    # 대표 지점 CSV (지점 둘레 3x3 격자 ≈ 750m 평균)
    recs = []
    for name, _, la, lo in SITES:
        c = int((lo - t.c) / t.a); r = int((la - t.f) / t.e)
        sl = (slice(r - 1, r + 2), slice(c - 1, c + 2))
        recs.append({
            "지점": name, "lat": la, "lon": lo,
            "sand_pct": round(float(np.nanmean(sand_p[sl])), 1),
            "silt_pct": round(float(np.nanmean(silt_p[sl])), 1),
            "clay_pct": round(float(np.nanmean(clay_p[sl])), 1),
            "OC_pct": round(float(np.nanmean(oc_p[sl])), 2),
            "K_SI_중심격자": round(float(k[r, c]), 4),
            "K_SI_3x3평균": round(float(np.nanmean(k[sl])), 4),
            "K_지역백분위": round(float(pct(k[r, c])), 1),
        })
    sites = pd.DataFrame(recs)
    sites["texture_USDA"] = usda_texture(sites.sand_pct.values, sites.silt_pct.values, sites.clay_pct.values)
    sites.to_csv(out_dir / "K_factor_고랭지_대표지점.csv", index=False, encoding="utf-8-sig")

    # 지도
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(7.5, 7))
    im = ax.imshow(np.ma.masked_invalid(k), extent=(t.c, t.c + t.a * k.shape[1], t.f + t.e * k.shape[0], t.f),
                   cmap="YlOrBr", vmin=np.nanpercentile(k, 2), vmax=np.nanpercentile(k, 98))
    for i, (_, _, la, lo) in enumerate(SITES, 1):
        ax.plot(lo, la, "o", ms=6, mfc="#1f4e79", mec="white")
        ax.annotate(str(i), (lo, la), xytext=(4, 4), textcoords="offset points", fontsize=9,
                    color="#1f4e79", weight="bold")
    ax.set_xlabel("Longitude (°E)"); ax.set_ylabel("Latitude (°N)")
    ax.set_title("RUSLE K factor, Gangwon highland (SoilGrids 2.0, 0-15 cm, EPIC)")
    cb = fig.colorbar(im, ax=ax, shrink=0.8); cb.set_label("K  [t·ha·h/(ha·MJ·mm)]")
    ax.text(0.01, 0.01, "\n".join(f"{i}. {en}" for i, (_, en, *_) in enumerate(SITES, 1)),
            transform=ax.transAxes, fontsize=7, va="bottom",
            bbox=dict(fc="white", alpha=0.8, ec="none"))
    fig.tight_layout(); fig.savefig(out_dir / "K_factor_지도.png", dpi=150); plt.close(fig)

    print(grid["K_SI"].describe().round(4).to_string())
    print(grid["texture_USDA"].value_counts().to_string())
    print(sites.to_string())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
