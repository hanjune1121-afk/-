const RATIO = { oc: 470 / 350, mc: 330 / 430, ls: 530 / 330, cm: 400 / 340, set: 470 / 350 };
const FN = { oc: pkgOrangeChicken, mc: pkgMalaCup, ls: pkgLambSkewer, cm: pkgChowmein, set: pkgSetBox };
function place(key, x, yBottom, w, extra = {}) {
  const h = w / RATIO[key];
  return FN[key]({ attrs: `x="${x}" y="${yBottom - h}" width="${w}" height="${h}"`, card: false, ...extra });
}
function priceLabel(x, y, name, price, w = 200, h = 40) {
  return `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" rx="8" fill="${K}"/>
    <text x="12" y="${h / 2 + 7}" font-family="Noto" font-weight="700" font-size="15" fill="#fff">${name}</text>
    <text x="${w - 12}" y="${h / 2 + 9}" text-anchor="end" font-family="BHS" font-size="24" fill="${Y}">${price}</text></g>`;
}
function phone(x, y, w, h, inner, rot = 0) {
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);background:#111;border-radius:${w * 0.13}px;padding:${w * 0.035}px;box-shadow:18px 22px 0 rgba(0,0,0,.18)">
    <div style="position:relative;width:100%;height:100%;border-radius:${w * 0.1}px;overflow:hidden;background:#fff">${inner}
      <div style="position:absolute;top:10px;left:50%;transform:translateX(-50%);width:${w * 0.28}px;height:${w * 0.07}px;background:#111;border-radius:99px"></div></div></div>`;
}
// Fist holding a yellow card (logo motif, large)
function handCard(x, y, s = 1, rot = -6, label = '반칙!', cardRot = 10) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
    <g stroke="${K}" stroke-width="14" stroke-linecap="round">
      <line x1="120" y1="-330" x2="160" y2="-385"/><line x1="150" y1="-260" x2="215" y2="-280"/><line x1="150" y1="-185" x2="205" y2="-160"/></g>
    <g transform="rotate(${cardRot} 0 -170)">
      <rect x="-120" y="-340" width="240" height="330" rx="26" fill="${Y}" stroke="${K}" stroke-width="14"/>
      <text x="0" y="-150" text-anchor="middle" font-family="BHS" font-size="76" fill="${K}">${label}</text></g>
    <rect x="-150" y="70" width="160" height="420" rx="40" fill="${K}"/>
    <rect x="-165" y="-70" width="200" height="190" rx="70" fill="${K}"/>
    ${[0, 1, 2, 3].map(i => `<rect x="-20" y="${-74 + i * 46}" width="96" height="52" rx="26" fill="${K}" stroke="${Y}" stroke-width="7"/>`).join('')}
    <rect x="-150" y="-112" width="150" height="56" rx="28" fill="${K}" stroke="${Y}" stroke-width="7" transform="rotate(-28 -75 -84)"/>
  </g>`;
}
function beerMug(x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
    <path d="M60,-60 h40 a40,40 0 0 1 40,40 v70 a40,40 0 0 1 -40,40 h-40" fill="none" stroke="${K}" stroke-width="34" stroke-linejoin="round"/>
    <path d="M60,-60 h40 a40,40 0 0 1 40,40 v70 a40,40 0 0 1 -40,40 h-40" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/>
    <rect x="-80" y="-110" width="160" height="240" rx="18" fill="#F2A007" stroke="${K}" stroke-width="8"/>
    <rect x="-56" y="-80" width="18" height="180" rx="9" fill="#FFD35C"/>
    <circle cx="20" cy="40" r="7" fill="#FFE29A"/><circle cx="-6" cy="80" r="5" fill="#FFE29A"/><circle cx="40" cy="-10" r="5" fill="#FFE29A"/>
    <path d="M-92,-100 q0,-50 40,-46 q14,-34 52,-24 q30,-30 62,0 q42,-6 38,40 q12,30 -18,30 h-156 q-30,0 -18,0 Z" fill="#fff" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  </g>`;
}
function vanTruck(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="0" y="0" width="300" height="150" rx="20" fill="${Y}" stroke="${K}" stroke-width="8"/>
    <path d="M300,40 h50 q30,0 44,30 l18,40 v40 h-112 Z" fill="${Y}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M318,56 h30 q18,0 26,18 l12,28 h-68 Z" fill="#CFE7F2" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="30" y="26" width="170" height="70" rx="10" fill="${K}"/>
    <text x="115" y="72" text-anchor="middle" font-family="BHS" font-size="32" fill="${Y}">반칙 호프</text>
    <path d="M24,26 h182 l-14,-22 h-154 Z" fill="${K}"/>
    ${logo(30, 106, 30)}
    <circle cx="80" cy="160" r="34" fill="${K}"/><circle cx="80" cy="160" r="13" fill="#bbb"/>
    <circle cx="340" cy="160" r="34" fill="${K}"/><circle cx="340" cy="160" r="13" fill="#bbb"/>
    <g stroke="${K}" stroke-width="8" stroke-linecap="round"><line x1="-30" y1="40" x2="-80" y2="40"/><line x1="-20" y1="80" x2="-100" y2="80"/><line x1="-30" y1="120" x2="-70" y2="120"/></g>
  </g>`;
}
