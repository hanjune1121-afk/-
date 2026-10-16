const COPY = {
  oc: { l1: '중식당 그 맛을', l2: '혼자서도 4,800원', deco: () => '' },
  mc: { l1: '마라탕 2만 원 대신', l2: '컵 하나로 1,800원', deco: () => chili(0, 0, 1.6, -25) },
  ls: { l1: '여럿이 가야 먹던 양꼬치', l2: '혼자서 8,900원', deco: () => skewer(-90, 60, 90, -60, 0.9, 31) },
  cm: { l1: '여행지에서 먹던 볶음면', l2: '편의점에서 1,800원', deco: () => '' },
};
function renderProduct(key) {
  const p = PRODUCTS.find(x => x.key === key), c = COPY[key];
  let pkgH = 460, pkgW = Math.min(680, pkgH * p.ratio); pkgH = pkgW / p.ratio;
  const top = 592 - pkgH / 2;
  document.body.innerHTML = `
  <div class="canvas" style="width:1080px;height:1080px;background:var(--y)">
    <svg class="abs" style="left:0;top:0" width="1080" height="1080">
      <defs><pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="3.2" fill="#E9B800"/></pattern>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
      <mask id="m"><rect width="1080" height="1080" fill="url(#fade)"/></mask></defs>
      <rect width="1080" height="1080" fill="url(#dots)" mask="url(#m)" opacity=".8"/>
      <circle cx="540" cy="592" r="300" fill="#FFF4C2"/>
      <circle cx="540" cy="592" r="300" fill="none" stroke="${K}" stroke-width="6" stroke-dasharray="2 22" stroke-linecap="round"/>
      ${yellowCard(880, 400, 110, 150, 16, '반칙!', { fs: 32, sw: 7 })}
      <g transform="translate(205,720) rotate(-12)">${c.deco()}</g>
    </svg>
    <img class="abs" src="../assets/logo_mark_k.png" style="left:64px;top:62px;height:62px">
    <div class="abs tag" style="right:64px;top:70px;font-size:28px;padding:8px 26px 6px">NEW 중식</div>
    <div class="abs bhs" style="left:64px;top:170px;font-size:66px;line-height:1.12">${c.l1}<br><span style="background:var(--k);color:var(--y);padding:0 14px;border-radius:10px">${c.l2}</span></div>
    <div class="abs" style="left:${540 - pkgW / 2}px;top:${top}px;width:${pkgW}px">${p.svg({ attrs: `width="${pkgW}"`, card: false })}</div>
    <div class="abs" style="left:0;right:0;bottom:0;height:200px;background:var(--y);border-top:6px solid var(--k)"></div>
    <div class="abs" style="left:64px;bottom:62px">
      <div class="bhs" style="font-size:${p.name.length > 6 ? 58 : 70}px;line-height:1">${p.name}</div>
      <div style="font-weight:700;font-size:28px;margin-top:12px">${p.spec}</div>
    </div>
    <div class="abs" style="right:56px;bottom:46px;transform:rotate(-5deg);background:var(--k);color:var(--y);border-radius:22px;padding:18px 34px 14px;text-align:right;box-shadow:10px 10px 0 rgba(0,0,0,.18)">
      <div style="color:#fff;font-weight:700;font-size:24px">편의점 가격</div>
      <div class="bhs" style="font-size:92px;line-height:1">${p.price}<span style="font-size:52px">원</span></div>
    </div>
  </div>`;
}
