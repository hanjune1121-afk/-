// Shared illustration kit: food, packages, yellow-card motif. All return SVG markup strings.
const Y = '#FCCA03', K = '#111111', W = '#FFFFFF';
const LOGO_K = '../assets/logo_mark_k.png', LOGO_Y = '../assets/logo_mark_y.png', LOGO_W = '../assets/logo_mark_w.png';
const LOGO_RATIO = 1772 / 534;
let _uid = 0; const uid = p => `${p}${++_uid}`;

function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647, (s - 1) / 2147483646); }

// Smooth closed blob around (cx,cy)
function blob(cx, cy, r, seed, n = 7, jit = 0.22, sy = 0.85) {
  const R = rng(seed), pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + R() * 0.3, rr = r * (1 - jit / 2 + R() * jit);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy]);
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    if (i === 0) d += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

function logo(x, y, h, href = LOGO_K) { return `<image href="${href}" x="${x}" y="${y}" height="${h}" width="${h * LOGO_RATIO}"/>`; }

// Yellow card with motion lines (logo motif)
function yellowCard(cx, cy, w, h, rot = 12, label = '', opts = {}) {
  const fs = opts.fs || w * 0.36, sw = opts.sw || Math.max(3, w * 0.07), fill = opts.fill || Y;
  const lines = opts.lines === false ? '' : `
    <g stroke="${opts.lineColor || K}" stroke-width="${sw * 1.1}" stroke-linecap="round">
      <line x1="${w * 0.62}" y1="${-h * 0.62}" x2="${w * 0.8}" y2="${-h * 0.78}"/>
      <line x1="${w * 0.72}" y1="${-h * 0.42}" x2="${w * 0.98}" y2="${-h * 0.5}"/>
      <line x1="${w * 0.7}" y1="${-h * 0.2}" x2="${w * 0.92}" y2="${-h * 0.12}"/>
    </g>`;
  return `<g transform="translate(${cx},${cy}) rotate(${rot})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * 0.1}" fill="${fill}" stroke="${K}" stroke-width="${sw}"/>
    ${label ? `<text x="0" y="${fs * 0.36}" text-anchor="middle" font-family="BHS" font-size="${fs}" fill="${K}">${label}</text>` : ''}
    ${lines}
  </g>`;
}

// ---------- Food ----------
function orangeChicken(cx, cy, s = 1, seed = 3) {
  const P = [[-20, -40, 30], [25, -36, 28], [-62, -10, 30], [-14, -8, 34], [36, -4, 32], [74, 6, 26],
             [-80, 26, 24], [-42, 24, 30], [6, 28, 32], [50, 30, 28], [-14, 52, 24], [30, 56, 22]];
  const R = rng(seed);
  let g = `<g transform="translate(${cx},${cy}) scale(${s})">`;
  P.sort((a, b) => a[1] - b[1]).forEach(([x, y, r], i) => {
    g += `<path d="${blob(x, y, r, seed * 7 + i, 7, 0.3)}" fill="#D9700F" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="${blob(x - r * 0.12, y - r * 0.14, r * 0.68, seed * 11 + i, 6, 0.3)}" fill="#F39A2B"/>`;
    g += `<ellipse cx="${x - r * 0.3}" cy="${y - r * 0.38}" rx="${r * 0.22}" ry="${r * 0.1}" fill="#FFE2A8" transform="rotate(-25 ${x - r * 0.3} ${y - r * 0.38})"/>`;
  });
  for (let i = 0; i < 16; i++) {
    const x = -85 + R() * 165, y = -40 + R() * 95, a = R() * 180;
    g += `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="2.2" fill="#FFF8E6" stroke="${K}" stroke-width="1.4" transform="rotate(${a} ${x} ${y})"/>`;
  }
  [[-50, -30], [10, -52], [58, -20], [-30, 40], [70, 40], [-75, 5]].forEach(([x, y]) => {
    g += `<circle cx="${x}" cy="${y}" r="7.5" fill="#4FAE3E" stroke="${K}" stroke-width="2.2"/><circle cx="${x}" cy="${y}" r="3" fill="#D8F5BF"/>`;
  });
  return g + '</g>';
}

function skewer(x1, y1, x2, y2, s = 1, seed = 5) {
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, R = rng(seed);
  let g = `<g>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${K}" stroke-width="${11 * s}" stroke-linecap="round"/>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#DDB47A" stroke-width="${5 * s}" stroke-linecap="round"/>`;
  for (let i = 0; i < 5; i++) {
    const t = 0.2 + i * 0.125, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    const w = 30 * s, h = 34 * s;
    g += `<g transform="translate(${x},${y}) rotate(${ang + (R() - 0.5) * 16})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${9 * s}" fill="${i % 2 ? '#8A3A1C' : '#9E4824'}" stroke="${K}" stroke-width="${3.5 * s}"/>
      <rect x="${-w / 2 + 5 * s}" y="${-h / 2 + 4 * s}" width="${w * 0.45}" height="${h * 0.3}" rx="${5 * s}" fill="#C0693A"/>`;
    for (let j = 0; j < 6; j++) {
      const fx = (R() - 0.5) * w * 0.75, fy = (R() - 0.5) * h * 0.75;
      g += j % 2 ? `<rect x="${fx}" y="${fy}" width="${4.5 * s}" height="${2.5 * s}" fill="#E8341C" transform="rotate(${R() * 180} ${fx} ${fy})"/>`
                 : `<circle cx="${fx}" cy="${fy}" r="${1.8 * s}" fill="#3B2410"/>`;
    }
    g += '</g>';
  }
  return g + '</g>';
}

function noodlePile(cx, cy, s = 1, color = '#C98A3E', seed = 9, veg = true) {
  const R = rng(seed), id = uid('np');
  let g = `<g transform="translate(${cx},${cy}) scale(${s})">
    <defs><clipPath id="${id}"><ellipse cx="0" cy="0" rx="92" ry="52"/></clipPath></defs>
    <ellipse cx="0" cy="0" rx="92" ry="52" fill="#7A4A1A" stroke="${K}" stroke-width="5"/>
    <g clip-path="url(#${id})">`;
  for (let i = 0; i < 12; i++) {
    const y0 = -50 + i * 9.5, ph = R() * 6, amp = 5 + R() * 4;
    let d = `M-100,${y0}`;
    for (let x = -100; x <= 100; x += 10) d += ` L${x},${(y0 + Math.sin(x / 13 + ph) * amp).toFixed(1)}`;
    g += `<path d="${d}" fill="none" stroke="${K}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<path d="${d}" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  g += `</g><ellipse cx="0" cy="0" rx="92" ry="52" fill="none" stroke="${K}" stroke-width="5"/>`;
  if (veg) {
    [[-48, -18, 18], [30, -24, 16], [55, 14, 14]].forEach(([x, y, r], i) =>
      g += `<path d="${blob(x, y, r, seed + i * 5, 6, 0.4)}" fill="#BFE38A" stroke="${K}" stroke-width="3"/>`);
    [[-20, -4, 30], [10, 20, -20], [-60, 18, 60], [40, -6, 70]].forEach(([x, y, a]) =>
      g += `<rect x="${x - 14}" y="${y - 3.5}" width="28" height="7" rx="3.5" fill="#F07A1E" stroke="${K}" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`);
    [[-6, -28], [-40, 30], [22, 38]].forEach(([x, y]) =>
      g += `<circle cx="${x}" cy="${y}" r="6.5" fill="#4FAE3E" stroke="${K}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="2.6" fill="#D8F5BF"/>`);
  }
  return g + '</g>';
}

function tomato(cx, cy, r = 30) {
  return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#FF4B33" stroke="${K}" stroke-width="${r * 0.15}"/>
    <ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.35}" rx="${r * 0.22}" ry="${r * 0.12}" fill="#FFB3A3" transform="rotate(-35 ${cx - r * 0.35} ${cy - r * 0.35})"/>
    <path d="M${cx},${cy - r * 0.85} l${-r * 0.42},${-r * 0.22} l${r * 0.3},${r * 0.05} l${r * 0.12},${-r * 0.3} l${r * 0.12},${r * 0.3} l${r * 0.3},${-r * 0.05} Z" fill="#3E9B35" stroke="${K}" stroke-width="${r * 0.08}" stroke-linejoin="round"/></g>`;
}

function chili(cx, cy, s = 1, rot = 0) {
  return `<g transform="translate(${cx},${cy}) rotate(${rot}) scale(${s})">
    <path d="M-30,-6 C-10,-14 20,-10 34,10 C18,4 -6,6 -28,6 Z" fill="#E3241B" stroke="${K}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M-30,-6 C-38,-8 -42,-2 -44,-10" fill="none" stroke="#3E9B35" stroke-width="5" stroke-linecap="round"/>
    <path d="M-30,-6 C-38,-8 -42,-2 -44,-10" fill="none" stroke="${K}" stroke-width="1.5" stroke-linecap="round" opacity="0"/></g>`;
}

function peppercorns(cx, cy, n = 6, seed = 2) {
  const R = rng(seed); let g = '';
  for (let i = 0; i < n; i++) g += `<circle cx="${cx + (R() - 0.5) * 60}" cy="${cy + (R() - 0.5) * 30}" r="5" fill="#7B2D12" stroke="${K}" stroke-width="2"/>`;
  return g;
}

function malaBowl(cx, cy, s = 1) {
  const id = uid('mb');
  return `<g transform="translate(${cx},${cy}) scale(${s})">
    <defs><clipPath id="${id}"><ellipse cx="0" cy="0" rx="96" ry="30"/></clipPath></defs>
    <path d="M-104,0 C-100,70 100,70 104,0 Z" fill="${W}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-88,30 C-50,46 50,46 88,30" fill="none" stroke="#E3241B" stroke-width="7"/>
    <ellipse cx="0" cy="0" rx="104" ry="34" fill="${W}" stroke="${K}" stroke-width="5"/>
    <ellipse cx="0" cy="0" rx="96" ry="30" fill="#D6341C"/>
    <g clip-path="url(#${id})">
      ${[-18, -8, 2, 12].map((y, i) => `<path d="M-90,${y} q15,-9 30,0 t30,0 t30,0 t30,0 t30,0 t30,0" fill="none" stroke="#F6D88A" stroke-width="5" stroke-linecap="round"/>`).join('')}
    </g>
    <path d="M30,-6 a20,20 0 0 1 40,0 Z" fill="#FF6A4D" stroke="${K}" stroke-width="3"/>
    <path d="M-62,-10 c10,-14 26,-14 34,-4 c-10,10 -24,10 -34,4Z" fill="#5DBB46" stroke="${K}" stroke-width="3"/>
    ${chili(-8, 6, 0.55, -20)}
  </g>`;
}

// ---------- Packages ----------
function shadow(cx, cy, rx, ry = rx * 0.12) { return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".16"/>`; }

function outlinedText(x, y, txt, fs, fill = W, anchor = 'start', sw) {
  return `<text x="${x}" y="${y}" font-family="BHS" font-size="${fs}" fill="${fill}" stroke="${K}" stroke-width="${sw || fs * 0.16}" stroke-linejoin="round" paint-order="stroke" text-anchor="${anchor}">${txt}</text>`;
}

function pkgOrangeChicken(opts = {}) {
  const id = uid('oc'), cid = uid('oci');
  return `<svg viewBox="0 0 470 350" ${opts.attrs || ''}>
  <defs><clipPath id="${id}"><rect x="20" y="86" width="360" height="234" rx="14"/></clipPath>
        <clipPath id="${cid}"><circle cx="292" cy="220" r="74"/></clipPath></defs>
  ${shadow(232, 326, 230, 16)}
  <path d="M20,100 L86,30 L446,30 L380,100 Z" fill="#F79257" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M380,100 L446,30 L446,252 L380,320 Z" fill="#C9531A" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M60,58 L410,58" stroke="#C9531A" stroke-width="4" opacity=".6"/>
  <rect x="20" y="86" width="360" height="234" rx="14" fill="#F26A21"/>
  <g clip-path="url(#${id})">
    <rect x="20" y="86" width="360" height="54" fill="${Y}"/>
    <line x1="20" y1="140" x2="380" y2="140" stroke="${K}" stroke-width="5"/>
    ${logo(36, 97, 32)}
    <text x="364" y="122" font-family="Noto" font-weight="900" font-size="15" text-anchor="end" fill="${K}">CHINESE</text>
    <circle cx="292" cy="220" r="74" fill="#FFF1D2"/>
    <g clip-path="url(#${cid})">${orangeChicken(292, 222, 0.78, 3)}</g>
    <circle cx="292" cy="220" r="74" fill="none" stroke="${K}" stroke-width="5"/>
    ${outlinedText(38, 200, '오렌지', 48)}
    ${outlinedText(36, 258, '치킨', 62)}
    <rect x="38" y="275" width="128" height="30" rx="15" fill="${K}"/>
    <text x="102" y="296" text-anchor="middle" font-family="Noto" font-weight="900" font-size="17" fill="${Y}">냉장 · 180g</text>
  </g>
  <rect x="20" y="86" width="360" height="234" rx="14" fill="none" stroke="${K}" stroke-width="6"/>
  ${opts.card === false ? '' : yellowCard(360, 92, 52, 72, 14, '반칙!', { fs: 15, sw: 4 })}
</svg>`;
}

function pkgMalaCup(opts = {}) {
  const id = uid('mc'), gid = uid('mcg');
  const body = 'M26,74 L62,394 Q64,406 78,406 L252,406 Q266,406 268,394 L304,74 Z';
  return `<svg viewBox="0 0 330 430" ${opts.attrs || ''}>
  <defs><clipPath id="${id}"><path d="${body}"/></clipPath>
    <linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>
  ${shadow(165, 410, 120, 14)}
  <path d="${body}" fill="#D8262B"/>
  <g clip-path="url(#${id})">
    <rect x="0" y="104" width="330" height="56" fill="${Y}"/>
    <line x1="0" y1="104" x2="330" y2="104" stroke="${K}" stroke-width="5"/>
    <line x1="0" y1="160" x2="330" y2="160" stroke="${K}" stroke-width="5"/>
    ${logo(165 - 34 * LOGO_RATIO / 2, 115, 34)}
    ${outlinedText(165, 228, '토마토', 58, W, 'middle')}
    ${outlinedText(165, 306, '마라', 84, Y, 'middle')}
    <rect x="108" y="322" width="114" height="30" rx="15" fill="${K}"/>
    <text x="165" y="343" text-anchor="middle" font-family="Noto" font-weight="900" font-size="17" fill="${W}">컵라면</text>
    ${tomato(98, 378, 22)} ${chili(236, 380, 0.75, -15)}
    <rect x="0" y="0" width="330" height="430" fill="url(#${gid})"/>
  </g>
  <path d="${body}" fill="none" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <ellipse cx="165" cy="74" rx="146" ry="30" fill="#F4F0E6" stroke="${K}" stroke-width="6"/>
  <ellipse cx="165" cy="72" rx="118" ry="20" fill="none" stroke="#D8262B" stroke-width="5"/>
  <path d="M20,70 q-18,-4 -16,10 q4,10 22,4" fill="#F4F0E6" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <text x="165" y="80" text-anchor="middle" font-family="BHS" font-size="20" fill="#D8262B">TOMATO MALA</text>
  ${opts.card === false ? '' : yellowCard(286, 120, 52, 72, 14, '반칙!', { fs: 15, sw: 4 })}
</svg>`;
}

function pkgLambSkewer(opts = {}) {
  const id = uid('ls'), wid = uid('lsw');
  return `<svg viewBox="0 0 530 330" ${opts.attrs || ''}>
  <defs><clipPath id="${id}"><rect x="20" y="78" width="420" height="222" rx="14"/></clipPath>
        <clipPath id="${wid}"><rect x="252" y="146" width="172" height="140" rx="12"/></clipPath></defs>
  ${shadow(262, 306, 260, 16)}
  <path d="M20,92 L84,26 L506,26 L440,92 Z" fill="#8F3532" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M440,92 L506,26 L506,234 L440,300 Z" fill="#4F1312" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <rect x="20" y="78" width="420" height="222" rx="14" fill="#6E1E1C"/>
  <g clip-path="url(#${id})">
    <rect x="20" y="78" width="420" height="54" fill="${Y}"/>
    <line x1="20" y1="132" x2="440" y2="132" stroke="${K}" stroke-width="5"/>
    ${logo(36, 89, 32)}
    <g transform="translate(398,105)"><circle r="17" fill="${W}" stroke="${K}" stroke-width="3"/>
      <g stroke="#2E7FD8" stroke-width="3" stroke-linecap="round"><line x1="0" y1="-10" x2="0" y2="10"/><line x1="-9" y1="-5" x2="9" y2="5"/><line x1="-9" y1="5" x2="9" y2="-5"/></g></g>
    <text x="362" y="112" text-anchor="end" font-family="Noto" font-weight="900" font-size="17" fill="${K}">냉동</text>
    <text x="40" y="180" font-family="BHS" font-size="32" fill="${Y}">냉동 양념</text>
    ${outlinedText(36, 248, '양꼬치', 66)}
    <rect x="40" y="262" width="190" height="28" rx="14" fill="${Y}"/>
    <text x="135" y="282" text-anchor="middle" font-family="Noto" font-weight="900" font-size="16" fill="${K}">시즈닝 포함 · 5개입</text>
    <rect x="252" y="146" width="172" height="140" rx="12" fill="#2A0D0B"/>
    <g clip-path="url(#${wid})">
      ${skewer(240, 300, 420, 160, 0.82, 4)} ${skewer(262, 330, 446, 196, 0.82, 8)} ${skewer(222, 262, 392, 134, 0.82, 12)}
    </g>
    <rect x="252" y="146" width="172" height="140" rx="12" fill="none" stroke="${K}" stroke-width="5"/>
  </g>
  <rect x="20" y="78" width="420" height="222" rx="14" fill="none" stroke="${K}" stroke-width="6"/>
  ${opts.card === false ? '' : yellowCard(30, 92, 52, 72, -14, '반칙!', { fs: 15, sw: 4, lines: false })}
</svg>`;
}

function pkgChowmein(opts = {}) {
  const id = uid('cm'), gid = uid('cmg'), cid = uid('cmc');
  const body = 'M30,96 L62,300 Q64,314 80,314 L320,314 Q336,314 338,300 L370,96 Z';
  return `<svg viewBox="0 0 400 340" ${opts.attrs || ''}>
  <defs><clipPath id="${id}"><path d="${body}"/></clipPath>
    <clipPath id="${cid}"><circle cx="300" cy="236" r="54"/></clipPath>
    <linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>
  ${shadow(200, 318, 170, 14)}
  <path d="${body}" fill="#1E2D5E"/>
  <g clip-path="url(#${id})">
    <rect x="0" y="96" width="400" height="22" fill="${Y}"/>
    <line x1="0" y1="118" x2="400" y2="118" stroke="${K}" stroke-width="4"/>
    <text x="64" y="160" font-family="BHS" font-size="24" fill="${Y}">중화 볶음면</text>
    ${outlinedText(56, 234, '차오멘', 64)}
    <text x="64" y="276" font-family="Noto" font-weight="900" font-size="15" fill="${W}" letter-spacing="2">CHOW MEIN</text>
    <circle cx="300" cy="236" r="54" fill="#FFF1D2"/>
    <g clip-path="url(#${cid})">${noodlePile(300, 240, 0.6, '#C98A3E', 9)}</g>
    <circle cx="300" cy="236" r="54" fill="none" stroke="${K}" stroke-width="5"/>
    <rect x="0" y="0" width="400" height="340" fill="url(#${gid})"/>
  </g>
  <path d="${body}" fill="none" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M40,58 Q40,34 66,34 L334,34 Q360,34 360,58 L368,96 Q368,108 352,108 L48,108 Q32,108 32,96 Z" fill="${Y}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <g transform="translate(200,72) scale(1,.72)">${logo(-34 * LOGO_RATIO / 2, -17, 34)}</g>
  ${opts.card === false ? '' : yellowCard(360, 120, 52, 72, 14, '반칙!', { fs: 15, sw: 4 })}
</svg>`;
}

const PRODUCTS = [
  { key: 'oc', name: '오렌지치킨', spec: '180g · 냉장', price: '4,800', svg: pkgOrangeChicken, accent: '#F26A21', ratio: 470 / 350 },
  { key: 'mc', name: '토마토마라컵라면', spec: '컵라면', price: '1,800', svg: pkgMalaCup, accent: '#D8262B', ratio: 330 / 430 },
  { key: 'ls', name: '냉동양념양꼬치', spec: '5개입 · 시즈닝 포함 · 냉동', price: '8,900', svg: pkgLambSkewer, accent: '#6E1E1C', ratio: 530 / 330 },
  { key: 'cm', name: '차오멘', spec: '중화 볶음면', price: '1,800', svg: pkgChowmein, accent: '#1E2D5E', ratio: 400 / 340 },
];

function pkgSetBox(opts = {}) {
  const id = uid('sb'), label = opts.label || '중식 4종 기획세트';
  return `<svg viewBox="0 0 470 350" ${opts.attrs || ''}>
  <defs><clipPath id="${id}"><rect x="20" y="86" width="360" height="234" rx="14"/></clipPath></defs>
  ${shadow(232, 326, 230, 16)}
  <path d="M20,100 L86,30 L446,30 L380,100 Z" fill="#FFE066" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M380,100 L446,30 L446,252 L380,320 Z" fill="#D9A900" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M200,100 L266,30" stroke="${K}" stroke-width="5"/>
  <rect x="20" y="86" width="360" height="234" rx="14" fill="${Y}"/>
  <g clip-path="url(#${id})">
    ${logo(200 - 52 * LOGO_RATIO / 2, 112, 52)}
    <text x="200" y="214" text-anchor="middle" font-family="BHS" font-size="46" fill="${K}">${opts.title || '혼중 세트'}</text>
    <rect x="20" y="246" width="360" height="74" fill="${K}"/>
    <text x="200" y="294" text-anchor="middle" font-family="BHS" font-size="27" fill="${Y}">${label}</text>
    <rect x="186" y="86" width="28" height="160" fill="${K}" opacity=".0"/>
  </g>
  <rect x="20" y="86" width="360" height="234" rx="14" fill="none" stroke="${K}" stroke-width="6"/>
  ${opts.card === false ? '' : yellowCard(360, 92, 52, 72, 14, '반칙!', { fs: 15, sw: 4 })}
</svg>`;
}
