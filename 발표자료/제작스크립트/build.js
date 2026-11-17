const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = '강원 고랭지 토양유실 위험 분석 — 데이터 수집·분석·예방전략';
pres.theme = { headFontFace: 'Pretendard', bodyFontFace: 'Pretendard' };
const F = 'Pretendard';
const G = { dk: '2F4F2F', g: '4F6F4C', lg: '8FBC7F', pale: 'D3E5CA', tint: 'EEF3EA', bg: 'F1F1F1', ink: '111111', sub: '7A7A7A', mute: '9A9A9A', brown: '8A5A2B', btint: 'F3EADF' };
const CL = ['B8457A', '4C8FD6', 'E39A2D', '1E7A46'];
const CN = ['높은 곳 · 경사 큰 밭', '정리 안 된 · 경사 작은 밭', '낮은 곳 · 경사 큰 밭', '정리된 · 경사 작은 밭'];
const NAV = ['주제 선정 배경', '데이터 수집 및 전처리', '데이터 분석', '예방전략 및 결론'];
const NAVX = [1.93, 5.17, 8.35, 11.32];
const W = 13.333;
let n = 0; const nm = (p) => `${p}-${++n}`;

function T(s, text, x, y, w, h, o = {}) {
  s.addText(text, Object.assign({ x, y, w, h, fontFace: F, fontSize: 14, color: G.ink, margin: 0, valign: 'top', isTextBox: true, objectName: nm('text') }, o));
}
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: o.r ?? 0.18, fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || o.fill || 'FFFFFF', width: o.line ? (o.lw || 1) : 0 },
    shadow: o.noShadow ? undefined : { type: 'outer', color: '000000', opacity: 0.10, blur: 8, offset: 2, angle: 90 }, objectName: nm('card') });
}
function pill(s, text, x, y, w, o = {}) {
  s.addText(text, { x, y, w, h: o.h || 0.36, shape: pres.ShapeType.roundRect, rectRadius: (o.h || 0.36) / 2, fill: { color: o.fill || G.g }, color: o.color || 'FFFFFF',
    fontFace: F, fontSize: o.fontSize || 13, bold: o.bold ?? true, align: 'center', valign: 'middle', margin: 0, objectName: nm('pill') });
}
function dot(s, text, x, y, d, fill, o = {}) {
  s.addText(String(text), { x, y, w: d, h: d, shape: pres.ShapeType.ellipse, fill: { color: fill }, color: o.color || 'FFFFFF', fontFace: F, fontSize: o.fontSize || 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('dot') });
}
function band(s, runs, x, y, w, h, o = {}) {
  s.addText(runs, { x, y, w, h, shape: pres.ShapeType.roundRect, rectRadius: 0.2, fill: { color: o.fill || G.g }, color: o.color || 'FFFFFF', fontFace: F, fontSize: o.fontSize || 18, bold: o.bold ?? false, align: 'center', valign: 'middle', margin: 0, objectName: nm('band') });
}
function rect(s, x, y, w, h, fill, o = {}) {
  s.addShape(o.round ? pres.ShapeType.roundRect : pres.ShapeType.rect, { x, y, w, h, rectRadius: o.round || 0, fill: { color: fill }, line: { color: o.line || fill, width: o.line ? (o.lw || 0.75) : 0 }, objectName: nm('rect') });
}
function slide(navIdx, tag, kicker, titleRuns) {
  const s = pres.addSlide();
  s.background = { color: G.bg };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.47, fill: { color: 'F8F8F8' }, line: { color: 'F8F8F8', width: 0 },
    shadow: { type: 'outer', color: '000000', opacity: 0.12, blur: 5, offset: 1.5, angle: 90 }, objectName: nm('nav') });
  NAV.forEach((t, i) => {
    const act = i === navIdx;
    T(s, t, NAVX[i] - 1.5, act ? 0.05 : 0.1, 3, 0.26, { fontSize: 13, color: act ? '333333' : 'C4C4C4', align: 'center', valign: 'middle' });
    if (act) T(s, '# ' + tag, NAVX[i] - 1.5, 0.27, 3, 0.18, { fontSize: 9.5, color: G.dk, align: 'center', valign: 'middle' });
  });
  T(s, kicker, 0.5, 0.72, W - 1, 0.38, { fontSize: 18, color: G.sub, align: 'center', valign: 'middle' });
  const runs = titleRuns.map(r => typeof r === 'string' ? { text: r } : { text: r.h, options: { highlight: G.pale } });
  T(s, runs, 0.5, 1.12, W - 1, 0.6, { fontSize: 28, bold: true, align: 'center', valign: 'middle' });
  return s;
}
function divider(num, title, items) {
  const s = pres.addSlide(); s.background = { color: 'EEEEEE' };
  T(s, num, 0.47, 0.55, 4, 0.9, { fontSize: 54, bold: true, color: '0F1F12' });
  T(s, title, 0.47, 1.5, 10, 0.9, { fontSize: 50, color: '333333' });
  items.forEach((t, i) => T(s, t, 9.2, 4.95 + i * 0.54, 3.7, 0.4, { fontSize: 19, bold: true, color: G.dk, underline: { style: 'sng' }, align: 'left' }));
  return s;
}
const src = (s, t, y = 7.05) => T(s, t, 0.5, y, W - 1, 0.25, { fontSize: 10, color: G.mute, align: 'center' });
const chartBase = { catAxisLabelFontFace: F, valAxisLabelFontFace: F, dataLabelFontFace: F, legendFontFace: F, catAxisLabelColor: '444444', valAxisLabelColor: '777777',
  catAxisLabelFontSize: 12, valAxisLabelFontSize: 10, dataLabelFontSize: 11, dataLabelColor: '333333', valGridLine: { color: 'E6E6E6', size: 0.5 }, catGridLine: { style: 'none' },
  catAxisLineShow: false, valAxisLineShow: false };
const hd = (t, o = {}) => ({ text: t, options: Object.assign({ bold: true, color: 'FFFFFF', fill: { color: G.dk }, align: 'center', fontSize: 12, fontFace: F }, o) });
const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 12.5, fontFace: F, align: 'center', color: '333333', fill: { color: 'FFFFFF' } }, o) });
// diverging (z-score) and sequential (ARI / |g|) cell fills
function zFill(z) {
  const a = Math.abs(z);
  if (a < 0.25) return ['ECE9E4', '444444'];
  if (z > 0) return a < 0.75 ? ['F2D9C4', '5A3A1E'] : a < 1.5 ? ['DFA273', '3B230F'] : ['A9581F', 'FFFFFF'];
  return a < 0.75 ? ['D5E4E2', '1F3F3B'] : a < 1.5 ? ['93BDB7', '163330'] : ['3F7F78', 'FFFFFF'];
}
function seqFill(v, lo = 0, hi = 1) {
  const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  const steps = [['F1F5EE', '333333'], ['D6E7CC', '24361F'], ['A9CC97', '1C2E18'], ['6E9C5E', 'FFFFFF'], ['3E6B35', 'FFFFFF']];
  return steps[Math.min(4, Math.floor(t * 5))];
}


/* ---------- extra helpers ---------- */
function gloss(s, items) {
  rect(s, 0.5, 6.86, W - 1, 0.5, 'E4ECDF', { round: 0.1 });
  pill(s, '용어', 0.64, 6.97, 0.62, { fill: G.dk, fontSize: 10, h: 0.28 });
  const runs = [];
  items.forEach(([t, d], i) => {
    runs.push({ text: t, options: { bold: true, color: G.dk } });
    runs.push({ text: '  ' + d + (i < items.length - 1 ? '      ' : ''), options: { color: '3A3A3A' } });
  });
  T(s, runs, 1.4, 6.88, W - 1.95, 0.46, { fontSize: 10.5, valign: 'middle' });
}
function apx(code, tag, kicker, titleRuns) {
  const s = slide(-1, tag, kicker, titleRuns);
  pill(s, '별첨 ' + code, 0.5, 0.78, 1.15, { fill: G.brown, fontSize: 11.5, h: 0.32 });
  return s;
}
function line(s, x, y, w, h, color = 'A8A8A8', width = 1.5, o = {}) {
  s.addShape(pres.ShapeType.line, { x, y, w, h, line: Object.assign({ color, width }, o), objectName: nm('ln') });
}
const RN = { changjuk: '태백 창죽동', daegwallyeong: '평창 대관령면', hajang: '삼척 하장면', imgye: '정선 임계면', jinbu: '평창 진부면', wangsan: '강릉 왕산면', yeoryang: '정선 여량면' };

/* ================= MAIN ================= */
/* M1. 유사 연구 */
{
  const s = slide(0, '유사 연구와 차별점', '기존 연구와 우리 연구는 무엇이 다른가', ['기존 연구는 \'얼마나\', 우리는 ', { h: '\'왜, 무엇을\'' }, '에 답합니다']);
  card(s, 0.5, 1.95, 5.6, 3.75, { fill: 'F7F7F7' }); card(s, 7.23, 1.95, 5.6, 3.75, { fill: 'FFFFFF', line: G.lg, lw: 1.5 });
  pill(s, '기존 연구', 2.55, 2.12, 1.5, { fill: '8C8C8C', fontSize: 14, h: 0.4 });
  pill(s, '우리 연구', 9.28, 2.12, 1.5, { fill: G.g, fontSize: 14, h: 0.4 });
  const rows = [['분석 단위', '유역 · 소유역 (골짜기 단위)', '필지 (밭 한 구획)'], ['답하는 질문', '흙이 얼마나 유실되는가', '이 밭은 왜 위험한가'], ['대책', '대책 하나를 제안·일괄 적용', '밭 조건에 맞는 대책을 골라 줌']];
  rows.forEach((r, i) => {
    const y = 2.8 + i * 0.95;
    T(s, r[0], 0.8, y, 5.0, 0.26, { fontSize: 11.5, color: G.sub, bold: true });
    T(s, r[1], 0.8, y + 0.28, 5.0, 0.42, { fontSize: 18, color: '555555' });
    T(s, r[0], 7.53, y, 5.0, 0.26, { fontSize: 11.5, color: G.g, bold: true });
    T(s, r[2], 7.53, y + 0.28, 5.0, 0.42, { fontSize: 18, bold: true, color: G.dk });
    s.addShape(pres.ShapeType.rightArrow, { x: 6.38, y: y + 0.25, w: 0.58, h: 0.36, fill: { color: G.lg }, line: { color: G.lg, width: 0 }, objectName: nm('arr') });
  });
  T(s, '참고한 선행 연구', 0.5, 5.85, 3, 0.25, { fontSize: 11, bold: true, color: G.sub });
  T(s, '서일규 외(2010) 소유역 유실량 산정·우선관리 유역   ·   성윤수 외(2015) Web GIS 토양 질 등급 평가   ·   김주훈 외(2011) 토양유실 지도 시스템   ·   최용범 외(2012) 고랭지 밭 PAM·바이오폴리머 대책', 0.5, 6.12, W - 1, 0.55, { fontSize: 11, color: '555555' });
  gloss(s, [['유역', '빗물이 같은 하천으로 모이는 땅 전체'], ['필지', '지도에서 하나로 구분된 밭 한 구획'], ['일괄 적용', '모든 밭에 같은 대책을 똑같이 적용하는 것']]);
  s.addNotes('기존 연구는 큰 유역 단위로 흙이 얼마나 유실되는지 계산하거나, 대책 하나를 제안하는 데 집중했습니다. 저희는 밭 한 구획, 즉 필지 단위로 왜 위험한지를 나누고, 그 밭에 맞는 대책을 골라 주는 데 초점을 맞췄습니다.');
}

divider('02', '데이터 수집 및 전처리', ['분석 대상 지역', '데이터 수집', '전처리 대표 사례']);

/* M2. 분석 대상 지역 */
{
  const s = slide(1, '분석 대상 지역', '분석 대상 지역', ['토양유실 문제가 큰 ', { h: '강원 고랭지 7개 지역' }, '을 분석했습니다']);
  const st = [['90%', '전국 완전고랭지밭(해발 600m 이상) 중 강원 비중', '해발 400m 이상 고랭지밭 기준으로도 63.4%'], ['92.8%', '분석한 밭 중 해발 400m 이상', '고랭지 기준(400m)을 거의 모두 충족'], ['54.0%', '분석한 밭 중 해발 600m 이상', '절반 이상이 완전고랭지']];
  st.forEach((r, i) => { const y = 1.95 + i * 1.6; card(s, 0.5, y, 4.55, 1.45); T(s, r[0], 0.75, y + 0.18, 1.9, 0.62, { fontSize: 34, bold: true, color: i === 0 ? G.brown : G.dk }); T(s, r[1], 2.65, y + 0.2, 2.25, 0.62, { fontSize: 13.5, bold: true }); T(s, r[2], 0.75, y + 0.92, 4.15, 0.4, { fontSize: 12, color: '555555' }); });
  const tiles = [['changjuk', 877, 408, 100], ['daegwallyeong', 775, 3929, 94], ['hajang', 709, 3825, 88], ['wangsan', 646, 4305, 62], ['jinbu', 585, 7652, 42], ['imgye', 548, 6042, 29], ['yeoryang', 429, 2703, 16]];
  tiles.forEach((t, i) => {
    const x = 5.3 + (i % 2) * 3.8, y = 1.95 + Math.floor(i / 2) * 1.2;
    card(s, x, y, 3.65, 1.08);
    T(s, RN[t[0]], x + 0.2, y + 0.12, 2.3, 0.42, { fontSize: 20, bold: true, color: '222222' });
    T(s, `고도 ${t[1]}m · ${t[2].toLocaleString('en-US')}필지`, x + 0.2, y + 0.6, 2.3, 0.3, { fontSize: 12, color: '555555' });
    rect(s, x + 2.55, y + 0.62, 0.9, 0.16, 'E6E6E6', { round: 0.04 });
    rect(s, x + 2.55, y + 0.62, Math.max(0.9 * t[3] / 100, 0.04), 0.16, G.g, { round: 0.04 });
    T(s, `${t[3]}%`, x + 2.5, y + 0.16, 1.0, 0.36, { fontSize: 17, bold: true, color: G.dk, align: 'center' });
  });
  card(s, 9.1, 5.55, 3.65, 1.08, { fill: G.tint, noShadow: true });
  T(s, [{ text: '막대·% ', options: { bold: true, color: G.dk } }, { text: '= 그 지역 밭 중 해발 600m 이상(완전고랭지) 비율' }], 9.28, 5.62, 3.35, 0.95, { fontSize: 11.5, color: '333333', valign: 'middle' });
  gloss(s, [['고랭지', '해발 400m 이상 높은 곳의 농경지'], ['완전고랭지', '해발 600m 이상의 고랭지'], ['필지', '지도에서 하나로 구분된 밭 한 구획']]);
  s.addNotes('토양유실은 경사가 크고 비가 센 고랭지에서 특히 문제가 됩니다. 전국 완전고랭지밭의 90%가 강원도에 있어서 강원 고랭지를 골랐고, 그중 대표적인 7개 지역의 밭 2만 8천여 개를 분석했습니다. 분석한 밭의 93%가 해발 400m 이상이고, 절반 이상이 600m 이상인 완전고랭지입니다.');
}
/* M3. 데이터 수집 */
{
  const s = slide(1, '데이터 수집', '데이터 수집', ['흩어진 자료를 ', { h: '밭 한 구획씩' }, ' 모았습니다']);
  const src3 = [['토지피복지도', '환경부', '땅이 무엇으로 덮였나', '31', '밭·숲·초지·도로 등 31종의 면적 비율'], ['수치표고모델 (DEM)', '국토지리정보원', '얼마나 높고 가파른가', '2', '평균 고도, 경사 부담(LS)'], ['분 단위 강우', '기상청 · 관측소 10곳', '비가 언제, 얼마나 왔나', '7', '봄·여름·가을·겨울 강수량, 하루·1시간 최대, 여름 비중']];
  src3.forEach((r, i) => {
    const y = 1.95 + i * 1.6;
    card(s, 0.5, y, 7.0, 1.45);
    dot(s, r[3], 0.75, y + 0.27, 0.9, i === 2 ? G.lg : G.g, { fontSize: 26 });
    T(s, r[0], 1.9, y + 0.17, 3.0, 0.38, { fontSize: 18, bold: true });
    T(s, r[1], 1.9, y + 0.57, 3.0, 0.28, { fontSize: 11.5, color: G.sub });
    T(s, r[2], 4.6, y + 0.17, 2.75, 0.38, { fontSize: 14, bold: true, color: G.dk });
    T(s, r[4], 4.6, y + 0.57, 2.75, 0.75, { fontSize: 11.5, color: '444444' });
  });
  s.addShape(pres.ShapeType.rightArrow, { x: 7.7, y: 3.75, w: 0.6, h: 0.6, fill: { color: G.lg }, line: { color: G.lg, width: 0 }, objectName: nm('arr') });
  card(s, 8.5, 1.95, 4.33, 4.65, { fill: G.g });
  T(s, '팜맵 필지 통합표', 8.75, 2.2, 3.9, 0.4, { fontSize: 18, bold: true, color: 'FFFFFF' });
  T(s, '28,815', 8.75, 2.85, 3.9, 0.8, { fontSize: 46, bold: true, color: 'FFFFFF' });
  T(s, '필지 (밭 구획)', 8.75, 3.65, 3.9, 0.3, { fontSize: 14, color: 'DDEBD5' });
  T(s, '× 40', 8.75, 4.15, 3.9, 0.8, { fontSize: 46, bold: true, color: 'FFFFFF' });
  T(s, '피처 (밭을 설명하는 항목)', 8.75, 4.95, 3.9, 0.3, { fontSize: 14, color: 'DDEBD5' });
  T(s, '전체 28,864필지 중 지형 값이 없는 49필지는 제외', 8.75, 5.6, 3.9, 0.6, { fontSize: 11.5, color: 'DDEBD5' });
  gloss(s, [['팜맵', '농림축산식품부의 농경지 전자지도'], ['피처', '분석에 쓰는 항목 (예: 고도, 경사)'], ['DEM', '땅의 높이를 격자로 기록한 지도'], ['LS', '경사의 길이·가파름을 합친 값 (클수록 빗물이 세게 흐름)']]);
  s.addNotes('세 기관의 자료를 밭 한 구획씩 연결했습니다. 땅이 무엇으로 덮였는지 31개, 높이와 경사 2개, 비가 언제 얼마나 왔는지 7개, 모두 40개 항목입니다. 결과적으로 2만 8,815개 밭에 대해 40개 항목을 가진 표를 만들었습니다.');
}
/* M4. 전처리 대표 사례 */
{
  const s = slide(1, '전처리 대표 사례', '데이터 전처리', ['대표 사례 3가지로 보는 ', { h: '전처리' }]);
  const w = 3.95, gx = 0.24;
  const xs = [0.5, 0.5 + w + gx, 0.5 + 2 * (w + gx)];
  // card 1: rain gap
  card(s, xs[0], 1.95, w, 4.7);
  pill(s, '① 비어 있는 강우 채우기', xs[0] + 0.2, 2.12, 2.6, { fontSize: 12.5 });
  const hts = [0.1, 0.25, 0.4, 0.2, 0.08, 0.3, 0.55, 0.35, 0.2, 0.45, 0.6, 0.5, 0.3, 0.42, 0.25, 0.15, 0.3, 0.2, 0.1, 0.05];
  [['채우기 전', 2.75, false], ['채운 후', 3.65, true]].forEach(([lab, y0, after]) => {
    T(s, lab, xs[0] + 0.2, y0 + 0.2, 0.9, 0.3, { fontSize: 11, bold: true, color: after ? G.dk : G.sub });
    hts.forEach((h, j) => {
      const x = xs[0] + 1.1 + j * 0.135, miss = j >= 8 && j <= 13;
      if (miss && !after) s.addShape(pres.ShapeType.rect, { x, y: y0 + 0.62 - 0.3, w: 0.1, h: 0.3, fill: { color: 'FFFFFF' }, line: { color: 'B0B0B0', width: 0.75, dashType: 'dash' }, objectName: nm('gap') });
      else rect(s, x, y0 + 0.62 - h, 0.1, h, miss ? 'D9A46A' : G.g);
    });
    line(s, xs[0] + 1.05, y0 + 0.63, 2.75, 0, 'CCCCCC', 0.75);
  });
  T(s, [{ text: '■ ', options: { color: G.g } }, { text: '관측값   ' }, { text: '■ ', options: { color: 'D9A46A' } }, { text: '채운 값' }], xs[0] + 1.1, 4.32, 2.7, 0.25, { fontSize: 10.5, color: '555555' });
  T(s, '관측소 10곳의 1년치 분 단위 기록 중 비어 있던 30,122분(0.6%)을 앞뒤 관측과 주변의 비 온 시간 평균으로 채움', xs[0] + 0.2, 4.7, w - 0.4, 0.95, { fontSize: 12, color: '333333' });
  T(s, '확인: 일부러 1시간을 지우고 다시 채워 보니 평균 오차 0.6mm', xs[0] + 0.2, 5.75, w - 0.4, 0.7, { fontSize: 12, bold: true, color: G.dk });
  // card 2: log
  card(s, xs[1], 1.95, w, 4.7);
  pill(s, '② 한쪽으로 치우친 값 펴기', xs[1] + 0.2, 2.12, 2.75, { fontSize: 12.5 });
  s.addImage({ path: 'img_ls.png', x: xs[1] + 0.15, y: 2.7, w: w - 0.3, h: (w - 0.3) * 2.6 / 6.4, altText: '경사 부담 LS의 로그 변환 전후 분포', objectName: 'img-ls' });
  T(s, '경사 부담(LS)은 대부분 작고 일부만 매우 큼 → 큰 값 몇 개가 결과를 좌우', xs[1] + 0.2, 4.4, w - 0.4, 0.7, { fontSize: 12, color: '333333' });
  T(s, '로그 변환으로 고르게 폄 (치우침 1.77 → −0.17)', xs[1] + 0.2, 5.75, w - 0.4, 0.7, { fontSize: 12, bold: true, color: G.dk });
  // card 3: weights
  card(s, xs[2], 1.95, w, 4.7);
  pill(s, '③ 항목 묶음의 비중 맞추기', xs[2] + 0.2, 2.12, 2.75, { fontSize: 12.5 });
  const wts = [['지형', 1, '3D6B45'], ['피복', 0.5, '9CC48A'], ['강우', 0.02, '5B8DB8']];
  wts.forEach((r, j) => { const y = 2.8 + j * 0.5; T(s, r[0], xs[2] + 0.25, y, 0.6, 0.32, { fontSize: 13, bold: true, valign: 'middle' }); rect(s, xs[2] + 0.9, y + 0.06, Math.max(2.3 * r[1], 0.04), 0.22, r[2], { round: 0.04 }); T(s, String(r[1]), xs[2] + 0.98 + Math.max(2.3 * r[1], 0.04), y, 0.6, 0.32, { fontSize: 13, bold: true, color: '333333', valign: 'middle' }); });
  T(s, '강우 값은 관측소 10곳 값이 그대로 반복됨 → 강우 비중이 크면 \'어느 관측소 근처인가\'로 나뉨', xs[2] + 0.2, 4.4, w - 0.4, 0.95, { fontSize: 12, color: '333333' });
  T(s, '강우 비중을 낮춰, 유형이 실제 땅 조건으로 나뉘게 함', xs[2] + 0.2, 5.75, w - 0.4, 0.7, { fontSize: 12, bold: true, color: G.dk });
  gloss(s, [['결측', '값이 비어 있는 것'], ['로그 변환', '큰 값을 줄여 치우친 분포를 고르게 펴는 계산'], ['가중치(비중)', '묶음마다 결과에 미치는 영향의 크기'], ['전체 처리 내역', '별첨 A2·A3']]);
  s.addNotes('전처리 중 대표 사례 세 가지입니다. 첫째, 강우 기록 중 비어 있던 시간을 앞뒤 관측과 주변 평균으로 채웠고, 일부러 지웠다 다시 채워 보니 1시간 기준 평균 오차가 0.6mm였습니다. 둘째, 한쪽으로 치우친 경사 값을 로그 변환으로 고르게 폈습니다. 셋째, 강우는 관측소 10곳 값이 반복되기 때문에 비중을 낮춰 유형이 실제 땅 조건으로 나뉘게 했습니다. 전체 처리 내역은 별첨에 정리했습니다.');
}

divider('03', '데이터 분석', ['분석 방법', '4가지 유형', '지역별 유형', '결과 신뢰도']);

/* M5. 분석 방법 */
{
  const s = slide(2, '분석 방법', '분석 방법: K-means 군집분석', ['비슷한 밭끼리 묶는 ', { h: 'K-means' }, '로 유형을 나눴습니다']);
  card(s, 0.5, 1.95, W - 1, 3.42);
  s.addImage({ path: 'img_kmeans.png', x: 0.75, y: 2.07, w: 11.83, h: 3.276, altText: 'K-means 4단계 원리 예시', objectName: 'img-kmeans' });
  const st = [['4개 유형', '밭을 4가지로 나눔', '대책과 질문을 연결하기 알맞은 수'], ['40개 항목', '밭 하나를 40개 값으로 비교', '피복 31 · 지형 2 · 강우 7'], ['30번 반복', '시작점을 바꿔 30번 계산', '그중 가장 잘 묶인 결과 선택']];
  st.forEach((r, i) => { const x = 0.5 + i * 4.19; card(s, x, 5.5, 3.95, 1.2); T(s, r[0], x + 0.25, 5.6, 1.9, 0.5, { fontSize: 22, bold: true, color: G.dk, valign: 'middle' }); T(s, r[1], x + 2.0, 5.62, 1.85, 0.5, { fontSize: 12, bold: true, valign: 'middle' }); T(s, r[2], x + 0.25, 6.15, 3.55, 0.3, { fontSize: 11, color: G.sub }); });
  gloss(s, [['K-means', '비슷한 것끼리 정해진 수(k개)의 묶음으로 나누는 방법'], ['군집(유형)', '비슷한 밭끼리 묶인 그룹'], ['중심', '각 묶음의 평균 위치 (그림의 ×)']]);
  s.addNotes('분석 방법은 K-means 군집분석입니다. 중심을 정해 놓고, 각 밭을 가장 가까운 중심에 배정하고, 묶음의 평균으로 중심을 옮기는 일을 결과가 바뀌지 않을 때까지 반복합니다. 저희는 밭마다 40개 항목으로 비교해 4개 유형으로 나눴습니다.');
}
/* M6. 4가지 유형 (decision tree) */
{
  const s = slide(2, '4가지 유형', '군집 분석 결과', ['28,815개 밭이 ', { h: '4가지 유형' }, '으로 나뉘었습니다']);
  const box = (x, y, w, h, txt, o = {}) => s.addText(txt, { x, y, w, h, shape: pres.ShapeType.roundRect, rectRadius: 0.14, fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || 'D5D5D5', width: 1 }, color: o.color || '222222', fontFace: F, fontSize: o.fontSize || 14, bold: true, align: 'center', valign: 'middle', margin: 0.05, objectName: nm('node') });
  box(0.5, 3.75, 1.9, 1.0, [{ text: '분석한 밭', options: { breakLine: true, fontSize: 12, color: 'DDEBD5' } }, { text: '28,815', options: { fontSize: 20 } }], { fill: G.g, line: G.g, color: 'FFFFFF' });
  box(2.75, 3.85, 2.2, 0.8, '경사 부담(LS)이\n큰가?', { fill: G.tint, line: G.lg, color: G.dk });
  box(5.45, 2.2, 2.2, 0.8, '고도가\n높은가?', { fill: G.tint, line: G.lg, color: G.dk });
  box(5.45, 5.45, 2.2, 0.8, '경지정리된\n밭인가?', { fill: G.tint, line: G.lg, color: G.dk });
  const G2 = '9A9A9A';
  line(s, 2.4, 4.25, 0.35, 0, G2); line(s, 4.95, 4.25, 0.25, 0, G2); line(s, 5.2, 2.6, 0, 3.25, G2); line(s, 5.2, 2.6, 0.25, 0, G2); line(s, 5.2, 5.85, 0.25, 0, G2);
  T(s, '크다', 4.62, 3.05, 0.55, 0.3, { fontSize: 12, bold: true, color: G.dk, align: 'right' }); T(s, '작다', 4.62, 4.95, 0.55, 0.3, { fontSize: 12, bold: true, color: G.dk, align: 'right' });
  const leaves = [[0, 1.95, '높다'], [2, 3.15, '낮다'], [3, 4.45, '예'], [1, 5.65, '아니오']];
  const info = { 0: ['8,702', '30.2%', '고도 738m · LS 13.1'], 1: ['8,894', '30.9%', '정리 안 된 밭 93% · LS 2.8'], 2: ['7,060', '24.5%', '고도 532m · LS 11.5'], 3: ['4,159', '14.4%', '경지정리된 밭 92% · LS 2.1'] };
  line(s, 7.65, 2.6, 0.2, 0, G2); line(s, 7.85, 2.47, 0, 1.2, G2); line(s, 7.65, 5.85, 0.2, 0, G2); line(s, 7.85, 4.97, 0, 1.2, G2);
  leaves.forEach(([ci, y, lab]) => {
    const yc = y + 0.52; line(s, 7.85, yc, 0.6, 0, G2);
    T(s, lab, 7.85, yc - 0.3, 0.6, 0.26, { fontSize: 11, bold: true, color: G.dk, align: 'center' });
    card(s, 8.45, y, 4.38, 1.04);
    dot(s, ci + 1, 8.6, y + 0.24, 0.56, CL[ci], { fontSize: 19 });
    T(s, CN[ci], 9.27, y + 0.14, 2.6, 0.36, { fontSize: 14.5, bold: true });
    T(s, info[ci][2], 9.27, y + 0.56, 2.6, 0.3, { fontSize: 11, color: '555555' });
    T(s, info[ci][0], 11.65, y + 0.12, 1.05, 0.42, { fontSize: 18, bold: true, color: G.dk, align: 'right' });
    T(s, info[ci][1], 11.65, y + 0.58, 1.05, 0.28, { fontSize: 11.5, color: G.sub, align: 'right' });
  });
  T(s, 'K-means 결과를 쉽게 읽도록 정리한 그림 · 값은 유형별 중앙값 · 번호는 위험 순서가 아님', 0.5, 6.42, 7.4, 0.3, { fontSize: 10.5, color: G.sub });
  gloss(s, [['LS', '경사의 길이·가파름을 합친 값 (경사각 아님)'], ['경지정리', '밭 모양·배수로를 반듯하게 정비한 것'], ['중앙값', '크기순으로 세웠을 때 가운데 값']]);
  s.addNotes('결과는 네 가지 유형입니다. 쉽게 보면 먼저 경사 부담이 큰지로 나뉩니다. 경사가 큰 밭은 높은 곳에 있는 1번과 낮은 곳에 있는 3번으로, 경사가 작은 밭은 경지정리가 된 4번과 안 된 2번으로 나뉩니다. 번호는 위험 순서가 아니라 이름표입니다.');
}
/* M7. 유형별 특징 */
{
  const s = slide(2, '유형별 특징', '유형별 특징 분포', ['그래프로 본 ', { h: '유형별 특징' }]);
  const im = [['box_ls.png', '경사 부담(LS)', '1·3번은 크고, 2·4번은 작다', '중앙값 1번 13.1, 3번 11.5 vs 2번 2.8, 4번 2.1'], ['box_elev.png', '평균 고도', '1번이 가장 높고, 3번이 가장 낮다', '1번 738m, 2번 611m, 4번 545m, 3번 532m'], ['box_221.png', '경지정리된 밭', '4번만 경지정리된 밭', '4번 중앙값 92%, 나머지 유형은 0%']];
  im.forEach((r, i) => {
    const x = 0.5 + i * 4.19, w = 3.95, iw = 3.7, ih = iw * 3.6 / 4.3;
    card(s, x, 1.95, w, 4.75);
    s.addImage({ path: r[0], x: x + 0.12, y: 2.03, w: iw, h: ih, altText: r[1] + ' 유형별 박스플롯', objectName: nm('img-box') });
    T(s, r[2], x + 0.25, 5.2, w - 0.5, 0.4, { fontSize: 15, bold: true, color: G.dk });
    T(s, r[3], x + 0.25, 5.65, w - 0.5, 0.85, { fontSize: 12, color: '444444' });
  });
  gloss(s, [['박스플롯', '상자 = 가운데 50% 밭, 흰 선 = 중앙값(옆 숫자), 수염 = 대부분이 들어가는 범위'], ['LS', '경사의 길이·가파름을 합친 값']]);
  s.addNotes('유형별로 세 가지 항목을 비교했습니다. 경사 부담은 1·3번이 크고 2·4번이 작습니다. 고도는 1번이 가장 높고 3번이 가장 낮습니다. 경지정리된 밭은 4번에만 있습니다.');
}
/* M8. 지역별 유형 구성 */
{
  const s = slide(2, '지역별 유형', '지역별 유형 구성', ['같은 지역 안에서도 ', { h: '유형이 섞여' }, ' 있습니다']);
  card(s, 0.5, 1.95, 8.3, 4.75);
  const reg = ['태백 창죽동', '삼척 하장면', '평창 대관령면', '평창 진부면', '강릉 왕산면', '정선 임계면', '정선 여량면'];
  const v = [[380, 2575, 1579, 1825, 1192, 820, 331], [15, 807, 1904, 2706, 1074, 1864, 524], [0, 169, 83, 2098, 1388, 1925, 1397], [13, 264, 329, 1018, 651, 1433, 451]];
  s.addChart(pres.charts.BAR, v.map((x, i) => ({ name: `${i + 1}번 ${CN[i]}`, labels: reg, values: x })), Object.assign({}, chartBase, { x: 0.6, y: 2.05, w: 8.1, h: 4.6, barDir: 'bar', barGrouping: 'percentStacked', chartColors: CL,
    catAxisOrientation: 'maxMin', showLegend: true, legendPos: 'b', legendFontSize: 11, legendColor: '444444', valAxisLabelFormatCode: '0%', catAxisLabelFontSize: 15, catAxisLabelColor: '222222', barGapWidthPct: 40, objectName: 'chart-region-type' }));
  const ins = [['창죽·하장', '1번(높은 곳·경사 큰 밭)이 93%, 68%'], ['대관령', '2번 49%, 1번 41%'], ['여량', '3번(낮은 곳·경사 큰 밭)이 52%'], ['임계·진부·왕산', '네 유형이 고르게 섞여, 지역 단위 대책으로는 맞추기 어려움']];
  ins.forEach((r, i) => { const y = 1.95 + i * 1.2; card(s, 9.05, y, 3.78, 1.07); T(s, r[0], 9.28, y + 0.12, 3.35, 0.4, { fontSize: 18, bold: true, color: G.dk }); T(s, r[1], 9.28, y + 0.53, 3.35, 0.5, { fontSize: 12, color: '444444' }); });
  gloss(s, [['유형', 'K-means로 나눈 4가지 밭 묶음'], ['필지 단위 대책', '지역 전체가 아니라 밭 한 구획마다 다르게 정하는 대책']]);
  s.addNotes('지역별로 보면, 고도가 높은 창죽과 하장은 1번 유형이 대부분이고, 여량은 3번이 절반입니다. 하지만 임계, 진부, 왕산처럼 네 유형이 고르게 섞인 지역도 많아서, 지역 단위가 아니라 밭 단위로 대책을 정해야 한다는 것을 보여줍니다.');
}
/* M9. 결과 신뢰도 */
{
  const s = slide(2, '결과 신뢰도', '결과 신뢰도 점검', ['조건을 바꿔 다시 해 봐도 ', { h: '같은 결과' }, '가 나왔습니다']);
  const ck = [['1.00', '시작점을 바꿔 다시 계산', '처음 중심을 다르게 놓아도 결과가 완전히 같음'], ['0.97', '일부 자료로 다시 학습', '지역마다 80%만 뽑아 다시 학습해도 나머지 20%의 유형이 거의 같음'], ['0.96', '묶음 비중을 25% 바꿈', '지형·피복·강우 비중을 하나씩 바꿔도 결과가 거의 같음']];
  ck.forEach((r, i) => {
    const x = 0.5 + i * 4.19; card(s, x, 1.95, 3.95, 3.25);
    dot(s, '✓', x + 0.25, 2.15, 0.55, G.g, { fontSize: 18 });
    T(s, r[1], x + 0.95, 2.2, 2.85, 0.45, { fontSize: 15, bold: true, valign: 'middle' });
    T(s, r[0], x + 0.25, 2.9, 3.45, 0.9, { fontSize: 52, bold: true, color: G.dk });
    T(s, '일치도 (1 = 완전히 같음)', x + 0.25, 3.82, 3.45, 0.28, { fontSize: 11, color: G.sub });
    T(s, r[2], x + 0.25, 4.25, 3.45, 0.85, { fontSize: 12.5, color: '333333' });
  });
  card(s, 0.5, 5.4, W - 1, 1.3, { fill: G.g });
  T(s, '유형 간 차이도 통계적으로 확인', 0.8, 5.55, 5, 0.35, { fontSize: 15, bold: true, color: 'DDEBD5' });
  T(s, [{ text: '38개 항목 중 30개', options: { bold: true, fontSize: 22 } }, { text: '에서 유형 간 평균이 다름 (ANOVA)   ·   경사·고도·밭 정리 여부는 모두 뚜렷한 차이', options: { fontSize: 14 } }], 0.8, 5.95, W - 1.6, 0.55, { color: 'FFFFFF', valign: 'middle' });
  gloss(s, [['일치도(ARI)', '두 결과가 같은 정도, 1이면 완전히 같음 (정확도와는 다름)'], ['ANOVA', '여러 그룹의 평균이 서로 다른지 확인하는 통계 검정']]);
  s.addNotes('결과를 믿을 수 있는지 세 가지로 확인했습니다. 시작점을 바꿔도, 자료 일부로 다시 학습해도, 묶음 비중을 바꿔도 결과가 거의 같았습니다. 또 통계 검정으로 유형 간 차이가 실제로 있다는 것도 확인했습니다.');
}

divider('04', '예방전략 및 결론', ['유형별 맞춤 대책', '대책의 효과', '시뮬레이션', '보완점과 결론']);

/* M10. 맞춤 대책 */
{
  const s = slide(3, '유형별 맞춤 대책', '유형별 맞춤 대책', ['우리 밭 유형에 맞는 ', { h: '질문과 대책' }, '을 안내합니다']);
  const d = [[0, '실제 경사와 물이 모이는 방향이 지도와 맞나요?', ['식생수로', '완충식생대', '노출부 피복'], '물이 몰리는 곳만 골라 시설 → 큰비에 흙이 쓸려가는 것을 막음'],
    [2, '비가 올 때 물길·흙 이동이 생기는 곳은 어디인가요?', ['식생수로', '완충식생대'], '흙이 빠져나가는 지점에만 설치 → 시설 비용 절약'],
    [1, '작물과 수확 후 맨흙으로 남는 시기는 언제인가요?', ['피복작물', '볏짚·잔재 피복'], '공사 없이 맨흙 기간만 줄여 표토를 지킴'],
    [3, '실제 밭 정리 상태와 배수로·출구의 막힘은 어떤가요?', ['배수로 점검', '피복 유지'], '이미 정리된 밭은 점검·유지만으로 관리']];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx), ci = r[0];
    card(s, x, 1.95, w, 4.75);
    pill(s, `${ci + 1}번  ${CN[ci]}`, x + 0.15, 2.1, w - 0.3, { fill: CL[ci], fontSize: 12.5, h: 0.42 });
    T(s, '먼저 묻는 질문', x + 0.22, 2.68, w - 0.44, 0.25, { fontSize: 11, bold: true, color: G.g });
    T(s, '"' + r[1] + '"', x + 0.22, 2.95, w - 0.44, 0.85, { fontSize: 13.5, bold: true, color: '222222' });
    T(s, '대책 후보', x + 0.22, 3.95, w - 0.44, 0.25, { fontSize: 11, bold: true, color: G.g });
    let tx = x + 0.2, ty = 4.25;
    r[2].forEach((t) => { const tw = t.length * 0.15 + 0.3; if (tx + tw > x + w - 0.15) { tx = x + 0.2; ty += 0.4; } pill(s, t, tx, ty, tw, { fill: G.tint, color: G.dk, fontSize: 11, h: 0.32 }); tx += tw + 0.07; });
    card(s, x + 0.15, 5.25, w - 0.3, 1.3, { fill: G.pale, noShadow: true, r: 0.12 });
    T(s, '농민에게 도움', x + 0.3, 5.32, w - 0.6, 0.25, { fontSize: 10.5, bold: true, color: G.g });
    T(s, r[3], x + 0.3, 5.58, w - 0.6, 0.9, { fontSize: 12, bold: true, color: G.dk });
  });
  gloss(s, [['식생수로', '물이 모이는 길에 풀을 심어 흙 깎임을 막는 수로'], ['완충식생대', '밭 아래쪽에 심어 흙탕물을 거르는 풀 띠'], ['피복작물', '밭이 비는 기간에 땅을 덮으려고 심는 작물']]);
  s.addNotes('유형마다 먼저 묻는 질문과 대책이 다릅니다. 경사가 큰 1번과 3번은 물이 모이는 곳을 먼저 확인하고, 그곳에만 식생수로나 완충식생대를 둡니다. 경사가 작은 2번은 수확 뒤 맨흙 기간을 줄이는 피복이, 정리된 밭인 4번은 배수로 점검과 피복 유지가 핵심입니다. 모든 밭에 같은 대책을 하는 대신, 필요한 것만 골라 비용과 노력을 아낍니다.');
}
/* M11. 대책 효과 */
{
  const s = slide(3, '대책의 효과', '대책의 효과와 경제적 이점', ['제안한 대책은 ', { h: '효과가 확인된' }, ' 방법입니다']);
  const d = [['88%', '완충식생대 (폭 4m)', '토양유실 감소', '고랭지 배추밭, 경사 17% 시험 · 폭 2m는 59%', '진용익 외(2009)'], ['50~68%', '볏짚 피복', '빗물 유출 감소', '국내 밭 2년 시험', 'Shin et al.(2016)'], ['72%', '피복작물', '토양유실 평균 감소', '맨땅 대비, 여러 시험 종합(메타분석)', 'Clement et al.(2024)']];
  d.forEach((r, i) => {
    const x = 0.5 + i * 4.19; card(s, x, 1.95, 3.95, 2.75);
    T(s, r[0], x + 0.25, 2.1, 3.45, 0.85, { fontSize: 46, bold: true, color: G.dk });
    T(s, r[1], x + 0.25, 3.0, 3.45, 0.35, { fontSize: 16, bold: true });
    T(s, r[2], x + 0.25, 3.35, 3.45, 0.3, { fontSize: 13, color: G.g, bold: true });
    T(s, r[3], x + 0.25, 3.72, 3.45, 0.55, { fontSize: 11, color: '555555' });
    T(s, r[4], x + 0.25, 4.3, 3.45, 0.28, { fontSize: 10, color: G.mute });
  });
  card(s, 0.5, 4.88, W - 1, 1.82, { fill: G.g });
  T(s, '농민에게 돌아가는 경제적 이점', 0.8, 5.0, 6, 0.38, { fontSize: 16, bold: true, color: 'FFFFFF' });
  const ec = [['흙을 지키면 객토 비용을 아낍니다', '경사 7% 이상 농경지의 토양유실을 객토비용으로 환산하면 연 최대 2,840억 원'], ['필요한 대책만 고릅니다', '모든 밭에 같은 시설을 짓지 않아 불필요한 공사·관리 비용을 줄임'], ['생산 기반을 지킵니다', '양분이 많은 표토가 남아 작물을 키우는 힘이 유지됨']];
  ec.forEach((r, i) => { const x = 0.8 + i * 4.05; T(s, r[0], x, 5.45, 3.8, 0.35, { fontSize: 13.5, bold: true, color: 'FFFFFF' }); T(s, r[1], x, 5.82, 3.8, 0.75, { fontSize: 11.5, color: 'DDEBD5' }); });
  gloss(s, [['객토', '깎여 나간 흙 대신 새 흙을 넣는 것'], ['표토', '양분이 많은 흙의 맨 윗부분'], ['수치 출처', '연구별 시험 조건의 결과, 객토비용은 앞 배경 자료(농촌진흥청 조사 보도)']]);
  s.addNotes('제안한 대책들은 연구로 효과가 확인됐습니다. 고랭지 배추밭 시험에서 폭 4m 완충식생대는 토양유실을 88% 줄였고, 볏짚 피복은 빗물 유출을 50~68%, 피복작물은 토양유실을 평균 72% 줄였습니다. 농민에게는 흙을 지켜 객토 비용을 아끼고, 필요한 대책만 골라 불필요한 공사비를 줄이고, 생산 기반을 지키는 이점이 있습니다. 다만 수치는 각 시험 조건의 결과라서 우리 밭의 예상 저감률은 아닙니다.');
}
/* M12. 시뮬레이션 */
function phone(s, x, y, w, h) {
  rect(s, x, y, w, h, '2B2B2B', { round: 0.3 });
  rect(s, x + 0.1, y + 0.12, w - 0.2, h - 0.24, 'FFFFFF', { round: 0.22 });
  rect(s, x + w / 2 - 0.35, y + 0.17, 0.7, 0.06, '2B2B2B', { round: 0.03 });
  return { x: x + 0.18, y: y + 0.32, w: w - 0.36 };
}
function phoneHead(s, sc, title) { rect(s, sc.x - 0.08, sc.y, sc.w + 0.16, 0.42, G.g); T(s, title, sc.x, sc.y, sc.w, 0.42, { fontSize: 11.5, bold: true, color: 'FFFFFF', valign: 'middle' }); }
{
  const s = slide(3, '시뮬레이션', '시뮬레이션 화면 (시안)', ['주소를 넣으면 ', { h: '우리 밭 유형과 대책' }, '을 알려줍니다']);
  const pw = 3.05, ph = 4.82, py = 1.92, xs = [0.6, 3.92, 7.24];
  let sc = phone(s, xs[0], py, pw, ph); phoneHead(s, sc, '우리 밭 토양유실 안내');
  s.addText('평창군 대관령면 ○○리 ○○번지', { x: sc.x, y: sc.y + 0.52, w: sc.w - 0.62, h: 0.34, shape: pres.ShapeType.roundRect, rectRadius: 0.06, fill: { color: 'F3F3F3' }, line: { color: 'D5D5D5', width: 0.75 }, color: '444444', fontFace: F, fontSize: 9, margin: [0, 0.08, 0, 0.08], valign: 'middle', objectName: nm('addr') });
  pill(s, '검색', sc.x + sc.w - 0.56, sc.y + 0.52, 0.56, { fill: G.g, fontSize: 9.5, h: 0.34 });
  rect(s, sc.x, sc.y + 0.96, sc.w, 1.1, 'DCEBD3', { round: 0.08 });
  rect(s, sc.x + 0.2, sc.y + 1.1, 0.85, 0.4, 'C3DDB5'); rect(s, sc.x + 1.15, sc.y + 1.06, 1.0, 0.5, 'C3DDB5'); rect(s, sc.x + 0.3, sc.y + 1.58, 1.1, 0.38, 'C3DDB5');
  s.addShape(pres.ShapeType.rect, { x: sc.x + 1.5, y: sc.y + 1.62, w: 0.85, h: 0.36, fill: { color: CL[0], transparency: 45 }, line: { color: '8C2F5A', width: 1.5 }, objectName: nm('parcel') });
  T(s, '선택한 밭 구획', sc.x + 1.45, sc.y + 1.98, 1.0, 0.2, { fontSize: 8, color: '8C2F5A' });
  card(s, sc.x, sc.y + 2.3, sc.w, 1.38, { fill: 'F8EEF3', noShadow: true, r: 0.1 });
  dot(s, 1, sc.x + 0.12, sc.y + 2.43, 0.4, CL[0], { fontSize: 13 });
  T(s, '우리 밭 유형 1번', sc.x + 0.62, sc.y + 2.4, 1.95, 0.25, { fontSize: 11.5, bold: true });
  T(s, '높은 곳 · 경사 큰 밭', sc.x + 0.62, sc.y + 2.65, 1.95, 0.25, { fontSize: 10.5, color: '555555' });
  T(s, '고도 786m · 경사 부담 큰 편. 비가 오면 물이 몰리는 곳을 먼저 확인해요', sc.x + 0.12, sc.y + 3.0, sc.w - 0.24, 0.6, { fontSize: 9, color: '444444' });
  T(s, '같은 유형 밭: 강원 7개 지역 8,702곳', sc.x, sc.y + 3.82, sc.w, 0.25, { fontSize: 8.8, color: G.sub });
  sc = phone(s, xs[1], py, pw, ph); phoneHead(s, sc, '현장 질문 (1번 유형 순서)');
  const qs = [['실제 경사와 물이 모이는 방향이 지도와 맞나요?', ['맞아요', '달라요', '모름'], 0], ['비가 온 뒤 물은 어떻게 흐르나요?', ['없음', '넓고 얕게', '한곳으로'], 2], ['물이 나가는 곳이 안정적인가요?', ['안정', '이상 있음', '모름'], 0], ['흙이 드러난 부분이 있나요?', ['예', '아니요', '모름'], 0]];
  qs.forEach((q, i) => {
    const y = sc.y + 0.52 + i * 0.9;
    T(s, q[0], sc.x, y, sc.w, 0.3, { fontSize: 9.3, bold: true });
    q[1].forEach((o, j) => { const bw = (sc.w - 0.12) / 3; const sel = j === q[2]; s.addText(o, { x: sc.x + j * (bw + 0.06), y: y + 0.34, w: bw, h: 0.34, shape: pres.ShapeType.roundRect, rectRadius: 0.08, fill: { color: sel ? G.g : 'F3F3F3' }, line: { color: sel ? G.g : 'DDDDDD', width: 0.75 }, color: sel ? 'FFFFFF' : '555555', fontFace: F, fontSize: 9, bold: sel, align: 'center', valign: 'middle', margin: 0, objectName: nm('opt') }); });
  });
  sc = phone(s, xs[2], py, pw, ph); phoneHead(s, sc, '우리 밭 맞춤 대책');
  const rc = [['식생수로 등 물길 관리 상담', '현장 상담', 'DCE8F3', '23476B', '물이 한곳으로 모이고 출구가 안정적이에요. 물길에 풀을 심어 흙 깎임을 막는 방법을 상담하세요'], ['드러난 흙 덮기', '바로 할 수 있음', G.pale, G.dk, '볏짚·작물 잔재로 덮으면 빗물 유출이 50~68% 줄어든 사례가 있어요']];
  rc.forEach((r, i) => {
    const y = sc.y + 0.52 + i * 1.5;
    card(s, sc.x, y, sc.w, 1.38, { fill: 'FFFFFF', line: 'E3E3E3', noShadow: true, r: 0.1 });
    pill(s, r[1], sc.x + 0.1, y + 0.1, 1.15, { fill: r[2], color: r[3], fontSize: 8.5, h: 0.26 });
    T(s, r[0], sc.x + 0.1, y + 0.42, sc.w - 0.2, 0.28, { fontSize: 10.5, bold: true });
    T(s, r[4], sc.x + 0.1, y + 0.72, sc.w - 0.2, 0.62, { fontSize: 8.8, color: '555555' });
  });
  card(s, sc.x, sc.y + 3.6, sc.w, 0.5, { fill: G.tint, noShadow: true, r: 0.1 });
  T(s, '설치 위치·폭은 현장 상담으로 정해요', sc.x + 0.1, sc.y + 3.6, sc.w - 0.2, 0.5, { fontSize: 9, color: G.dk, valign: 'middle' });
  card(s, 10.55, 1.92, 2.28, 4.82);
  ['주소 입력 · 유형 확인', '현장 질문에 답하기', '맞춤 대책 받기'].forEach((t, i) => { const y = 2.12 + i * 1.0; dot(s, i + 1, 10.72, y, 0.4, G.g, { fontSize: 12 }); T(s, t, 11.2, y - 0.03, 1.55, 0.46, { fontSize: 12, bold: true, valign: 'middle' }); });
  T(s, '화면은 시안입니다. 유형은 최종 모델 결과, 질문·대책은 추천 규칙표를 따른 예시(가상 답변)입니다', 10.72, 5.3, 1.98, 1.35, { fontSize: 9.5, color: G.sub });
  gloss(s, [['시뮬레이션', '주소를 넣어 우리 밭 결과를 미리 보는 기능'], ['밭 구획', '팜맵에서 하나로 그려진 밭 경계'], ['현장 상담', '설치 위치·크기를 전문가와 현장에서 정하는 단계']]);
  s.addNotes('시뮬레이션 화면 시안입니다. 주소를 입력하면 지도에서 밭을 찾아 유형을 알려 주고, 그 유형에 맞는 순서로 질문을 합니다. 답변에 따라 식생수로 상담이나 드러난 흙 덮기 같은 대책을 안내합니다.');
}
/* M13. 보완점 */
{
  const s = slide(3, '보완점', '시뮬레이션의 한계와 보완점', ['한계를 알고 ', { h: '이렇게 보완' }, '하겠습니다']);
  const rows = [['주소(번지) 하나가 밭 하나와 꼭 맞지 않음', '한 번지에 밭 구획이 여러 개이거나, 밭 하나가 여러 번지에 걸침', '지도에서 내 밭 구획 직접 선택 · 인접 필지 함께 입력 · 개별 필지 분석 기능'],
    ['지도 정보와 지금 밭 상태가 다름', '토지피복지도는 지금의 작물·멀칭이 아니고, 지형은 90m 격자 기준', '현장 질문과 사진 입력으로 실제 상태 반영'],
    ['강우 빈칸 채우기는 지난 자료용', '앞뒤 관측을 쓰는 방식이라 실시간에는 그대로 못 씀', '서비스에서는 실시간 관측 자료 연결 방식 따로 마련'],
    ['실제 효과는 아직 현장에서 확인 전', '유형과 대책은 자료·연구 근거로 연결한 것', '시범 농가에 적용해 유실량·비용 절감 확인']];
  T(s, '한계', 0.75, 1.92, 4, 0.28, { fontSize: 12, bold: true, color: G.brown }); T(s, '보완 방안', 8.0, 1.92, 4, 0.28, { fontSize: 12, bold: true, color: G.g });
  rows.forEach((r, i) => {
    const y = 2.25 + i * 1.12;
    card(s, 0.5, y, 6.95, 1.0); card(s, 7.8, y, 5.03, 1.0, { fill: G.tint, noShadow: true });
    T(s, r[0], 0.75, y + 0.12, 6.5, 0.35, { fontSize: 15, bold: true, color: G.brown });
    T(s, r[1], 0.75, y + 0.52, 6.5, 0.4, { fontSize: 11.5, color: '555555' });
    s.addShape(pres.ShapeType.rightArrow, { x: 7.5, y: y + 0.36, w: 0.26, h: 0.28, fill: { color: G.lg }, line: { color: G.lg, width: 0 }, objectName: nm('arr') });
    T(s, r[2], 8.0, y + 0.08, 4.68, 0.84, { fontSize: 13, bold: true, color: G.dk, valign: 'middle' });
  });
  gloss(s, [['번지(지번)', '땅마다 매긴 주소 번호'], ['인접 필지', '내 밭과 맞닿은 주변 밭 구획'], ['개별 필지 분석', '선택한 밭 하나만 따로 분석하는 기능']]);
  s.addNotes('시뮬레이션의 한계와 보완 방안입니다. 가장 큰 한계는 주소 하나가 밭 하나와 꼭 맞지 않는다는 점입니다. 그래서 지도에서 내 밭을 직접 고르거나, 붙어 있는 밭을 함께 입력하거나, 밭 하나만 따로 분석하는 기능으로 보완하겠습니다. 또 현장 질문과 사진으로 지금 밭 상태를 반영하고, 시범 농가에서 실제 효과를 확인할 계획입니다.');
}
/* M14. 가설 검증 */
{
  const s = slide(3, '가설 검증 결과', '가설 검증 결과', ['처음 세운 ', { h: '세 가지 가설' }, '은 어떻게 되었을까요?']);
  const d = [['Q1', '취약 조건은 필지마다 다른가?', '맞음', G.g, '밭이 4가지 유형으로 나뉘었고, 조건을 바꿔 다시 해도 같은 결과'],
    ['Q2', '어떤 조건이 겹칠 때 위험이 커지는가?', '일부 맞음', G.brown, '경사가 큰 유형(1·3번)은 숲·초지가 조금 더 많고, 덮인 땅이 적은 유형(2·4번)은 경사가 작음 → 모든 위험 조건이 한 유형에 겹치지는 않음'],
    ['Q3', '유형마다 다른 예방법이 필요한가?', '맞음', G.g, '유형마다 먼저 확인할 질문과 맞는 대책이 다름']];
  d.forEach((r, i) => {
    const y = 1.95 + i * 1.58;
    card(s, 0.5, y, W - 1, 1.42);
    T(s, r[0], 0.8, y + 0.3, 0.9, 0.82, { fontSize: 32, bold: true, color: G.lg, valign: 'middle' });
    T(s, r[1], 1.75, y + 0.3, 4.6, 0.82, { fontSize: 17, bold: true, valign: 'middle' });
    pill(s, r[2], 6.55, y + 0.5, 1.55, { fill: r[3], h: 0.42, fontSize: 14 });
    T(s, r[4], 8.4, y + 0.2, 4.2, 1.02, { fontSize: 12.5, color: '333333', valign: 'middle' });
  });
  gloss(s, [['가설', '분석 전에 세운 예상, 데이터로 맞는지 확인함'], ['피복', '땅을 덮고 있는 것 (작물·풀·숲 등)']]);
  s.addNotes('처음 세운 가설입니다. 밭마다 조건이 다르다는 Q1과 유형마다 다른 예방법이 필요하다는 Q3는 맞았습니다. Q2는 일부만 맞았는데, 위험 조건이 한 유형에 모두 겹치지 않고 서로 다른 유형으로 나뉘어 나타났습니다. 그래서 유형별로 다른 대책이 필요하다는 결론으로 이어집니다.');
}
/* M15. 결론 */
{
  const s = slide(3, '결론', '결론', ['농민 한 사람 한 사람의 ', { h: '밭에 맞는 대안' }, '을 드립니다']);
  const d = [['내 밭 상태를 바로 압니다', '주소만 넣으면 우리 밭이 어떤 유형인지, 무엇부터 확인할지 알려 줌'], ['필요한 대책만 고릅니다', '모든 밭에 같은 시설 대신 우리 밭에 맞는 대책 → 불필요한 비용 절감'], ['흙을 지킵니다', '표토를 지켜 객토 비용과 생산성 손실을 줄임']];
  d.forEach((r, i) => { const x = 0.5 + i * 4.19; card(s, x, 1.95, 3.95, 3.15); dot(s, i + 1, x + 0.3, 2.2, 0.75, G.g, { fontSize: 24 }); T(s, r[0], x + 0.3, 3.15, 3.4, 0.45, { fontSize: 19, bold: true, color: G.dk }); T(s, r[1], x + 0.3, 3.7, 3.4, 1.2, { fontSize: 13, color: '333333' }); });
  band(s, '주소만 넣으면 그 땅의 유형과 맞춤 대책을 알려주는 시스템', 0.5, 5.4, W - 1, 1.2, { fontSize: 24, bold: true });
  gloss(s, [['맞춤 대책', '밭의 조건(경사·고도·피복)과 현장 답변에 따라 고른 대책'], ['객토', '깎여 나간 흙 대신 새 흙을 넣는 것']]);
  s.addNotes('저희의 최종 목표는 농민 한 사람 한 사람의 밭에 맞는 대안을 드리는 것입니다. 주소만 넣으면 내 밭 유형을 알고, 필요한 대책만 골라 비용을 아끼고, 흙을 지켜 생산성을 유지할 수 있습니다.');
}
{
  const s = pres.addSlide(); s.background = { color: '2E4A2F' };
  T(s, '감사합니다', 0.5, 2.7, W - 1, 1.1, { fontSize: 54, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  T(s, '강원 고랭지 토양유실 위험 분석 및 맞춤형 저감방안 도출', 0.5, 3.85, W - 1, 0.45, { fontSize: 18, color: 'C9DDBF', align: 'center', valign: 'middle' });
  T(s, [{ text: '강원대 2파트  ', options: { bold: true, color: 'FFFFFF' } }, { text: '김수희, 김연지, 이소정, 정태현, 최연주, 홍석진', options: { color: 'C9DDBF' } }], 0.5, 6.3, W - 1, 0.4, { fontSize: 14, align: 'center', valign: 'middle' });
}

/* ================= APPENDIX ================= */
divider('별첨', '세부 분석 자료', ['A1~A4  데이터·전처리', 'A5~A10  분석 상세', 'A11~A12  대책 근거', 'A13~A14  예상 질문·용어']);

/* A1 */
{
  const s = apx('A1', '데이터 출처', '데이터 출처와 40개 피처', ['밭 하나를 ', { h: '40개 항목' }, '으로 설명합니다']);
  const C = (t, o = {}) => cell(t, Object.assign({ fontSize: 11.5 }, o));
  const rows = [[hd('묶음'), hd('자료'), hd('출처'), hd('필지 연결'), hd('피처'), hd('내용')],
    [C('피복', { bold: true }), C('세분류 토지피복지도'), C('환경부'), C('분류 도형 중첩 → 면적 구성비'), C('31', { bold: true, color: G.dk }), C('주거·도로·논·밭·과수원·숲·초지·나지·하천 등 31종 면적 비율', { align: 'left' })],
    [C('지형', { bold: true }), C('수치표고모델 (90m DEM)'), C('국토지리정보원'), C('90m 격자 → 필지 평균'), C('2', { bold: true, color: G.dk }), C('평균 고도(m), 경사 부담 LS', { align: 'left' })],
    [C('강우', { bold: true }), C('분 단위 강우 (2025)'), C('기상청 관측소 10곳'), C('관측소 → 필지 연결'), C('7', { bold: true, color: G.dk }), C('봄(3~5월)·여름(6~8월)·가을(9~11월)·겨울(12~2월) 강수량, 일 최대, 최대 60분, 여름/연간 비중', { align: 'left' })],
    [C('필지', { bold: true, fill: { color: G.tint } }), C('팜맵 필지 경계', { fill: { color: G.tint } }), C('농림축산식품부', { fill: { color: G.tint } }), C('분석 단위', { fill: { color: G.tint } }), C('40', { bold: true, color: G.dk, fill: { color: G.tint } }), C('전체 28,864필지 → 지형 결측 49필지 제외 → 학습 28,815필지', { align: 'left', fill: { color: G.tint } })]];
  s.addTable(rows, { x: 0.5, y: 1.95, w: 8.6, colW: [0.75, 1.75, 1.3, 1.6, 0.6, 2.6], rowH: [0.42, 0.72, 0.6, 0.95, 0.72], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.06, 0, 0.06], objectName: 'table-src' });
  card(s, 9.35, 1.95, 3.48, 4.75);
  T(s, '지역별 팜맵 필지 수', 9.55, 2.1, 3.1, 0.3, { fontSize: 14, bold: true });
  s.addChart(pres.charts.BAR, [{ name: '필지 수', labels: ['평창 진부면', '정선 임계면', '강릉 왕산면', '평창 대관령면', '삼척 하장면', '정선 여량면', '태백 창죽동'], values: [7652, 6042, 4305, 3929, 3825, 2703, 408] }],
    Object.assign({}, chartBase, { x: 9.4, y: 2.4, w: 3.38, h: 4.25, barDir: 'bar', chartColors: [G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0', dataLabelFontSize: 10,
      catAxisOrientation: 'maxMin', valAxisHidden: true, valAxisMaxVal: 9800, valGridLine: { style: 'none' }, barGapWidthPct: 50, showLegend: false, catAxisLabelFontSize: 12, catAxisLabelColor: '222222', objectName: 'chart-region-n' }));
  T(s, '연결키 REGION_KEY + ID + UID는 문자열로 유지하고 분석 입력에는 넣지 않음 · 연간 강수 합은 계절 합과 겹쳐 넣지 않음', 0.5, 5.6, 8.6, 0.6, { fontSize: 11, color: G.sub });
  gloss(s, [['팜맵', '농림축산식품부의 농경지 전자지도'], ['DEM', '땅의 높이를 격자로 기록한 지도'], ['관측소', '기상청이 비·기온을 재는 지점 (분석 지역 주변 10곳)']]);
}
/* A2 */
{
  const s = apx('A2', '강우 빈칸 채우기', '강우 결측 보완 상세', ['관측소 10곳 × 1년 525,600분의 ', { h: '빈칸 0' }]);
  const steps = [['빈칸 확인', '10곳 합계 30,122분 (전체의 0.6%)'], ['비 온 표시가 있는 빈칸 6,660분', '주변 시간의 실제 비 온 분 평균으로 채움 (앞뒤 1시간 → 6시간 → 1일 → 1주로 범위 확대)'], ['비 여부도 모르는 빈칸 23,462분', '앞뒤 관측값을 시간 순서대로 이어 채움 (보간)'], ['출처 표시', '관측값과 채운 값을 코드로 구분해 보존']];
  steps.forEach((r, i) => { const y = 1.95 + i * 1.0; card(s, 0.5, y, 4.6, 0.9); dot(s, i + 1, 0.68, y + 0.22, 0.46, G.g, { fontSize: 14 }); T(s, r[0], 1.3, y + 0.1, 3.7, 0.3, { fontSize: 13, bold: true }); T(s, r[1], 1.3, y + 0.4, 3.7, 0.48, { fontSize: 10.5, color: '555555' }); });
  card(s, 0.5, 5.95, 4.6, 0.75, { fill: G.btint, noShadow: true, r: 0.12 });
  T(s, '앞뒤 관측을 쓰는 사후 분석용 방식. 긴 공백(최대 88시간)의 실제 강우를 복원했다는 보장은 없음', 0.68, 5.98, 4.3, 0.7, { fontSize: 10.5, color: G.brown, valign: 'middle' });
  const C = (t, o = {}) => cell(t, Object.assign({ fontSize: 11 }, o));
  const q = [['216', 745, 0, 745, 0.21], ['318', 1175, 1173, 2, 0.98], ['497', 1557, 1506, 51, 1.40], ['537', 3, 1, 2, 0.02], ['560', 301, 2, 299, 0.17], ['579', 3065, 1115, 1950, 2.27], ['597', 9206, 3, 9203, 2.38], ['674', 6373, 0, 6373, 1.23], ['678', 5204, 2859, 2345, 2.54], ['679', 2493, 1, 2492, 0.69]];
  const rows = [[hd('관측소', { fontSize: 11 }), hd('빈칸(분)', { fontSize: 11 }), hd('비 온 시간 평균', { fontSize: 11 }), hd('시간 보간', { fontSize: 11 }), hd('추정 비율', { fontSize: 11 })]];
  q.forEach(r => rows.push([C(r[0], { bold: true }), C(r[1].toLocaleString('en-US')), C(r[2].toLocaleString('en-US')), C(r[3].toLocaleString('en-US')), C(r[4].toFixed(2) + '%')]));
  rows.push([C('합계', { bold: true, fill: { color: G.tint } }), C('30,122', { bold: true, fill: { color: G.tint } }), C('6,660', { bold: true, fill: { color: G.tint } }), C('23,462', { bold: true, fill: { color: G.tint } }), C('', { fill: { color: G.tint } })]);
  s.addTable(rows, { x: 5.35, y: 1.95, w: 4.3, colW: [0.8, 0.85, 1.05, 0.85, 0.75], rowH: 0.36, border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', objectName: 'table-rainfill' });
  T(s, '추정 비율: 1년 분 중 추정값 비율 (이전 단계의 짧은 보완 포함)', 5.35, 6.35, 4.3, 0.3, { fontSize: 9.5, color: G.sub });
  card(s, 9.9, 1.95, 2.93, 4.75);
  T(s, '가림 검증', 10.1, 2.1, 2.5, 0.3, { fontSize: 14, bold: true });
  T(s, '정상 관측 구간을 일부러 지우고 같은 방법으로 채운 뒤 실제와 비교 (각 90회)', 10.1, 2.45, 2.55, 0.8, { fontSize: 10.5, color: '555555' });
  [['5분', '0.11mm'], ['1시간', '0.64mm'], ['1일', '3.38mm']].forEach((r, i) => { const y = 3.35 + i * 0.85; T(s, r[0] + ' 가림', 10.1, y, 1.2, 0.3, { fontSize: 12, color: '555555' }); T(s, r[1], 10.1, y + 0.3, 2.5, 0.45, { fontSize: 22, bold: true, color: G.dk }); });
  T(s, '평균 절대 오차 · 치우침(편향)은 ±0.04mm 이내', 10.1, 5.95, 2.6, 0.6, { fontSize: 10, color: G.sub });
  gloss(s, [['결측', '값이 비어 있는 것'], ['보간', '앞뒤 값을 이어 빈칸을 채우는 것'], ['평균 절대 오차', '채운 값과 실제 값 차이의 평균']]);
}
/* A3 */
{
  const s = apx('A3', '전처리 전체 내역', '전처리 전체 내역', ['항목마다 ', { h: '어떻게 다듬고 무엇을 뺐는지' }]);
  const C = (t, o = {}) => cell(t, Object.assign({ align: 'left', fontSize: 11.5 }, o));
  const rows = [[hd('구분'), hd('처리 방법'), hd('제거 · 제외')],
    [C('공통', { bold: true, align: 'center' }), C('연결키를 문자열로 유지, 48개 항목의 결측·범위·상수·중복 점검'), C('지형 값이 없는 49필지 학습 제외 (사유 보존)')],
    [C('피복 31', { bold: true, align: 'center' }), C('행별 합을 100으로 맞춤(최대 오차 0.03%p) → 평균만 빼기'), C('모든 필지가 0인 2열(공동주거·운동장) 거리 계산 제외')],
    [C('지형 2', { bold: true, align: 'center' }), C('LS는 ln(1+x), 고도는 원값 → 표준화'), C('—', { align: 'center' })],
    [C('강우 7', { bold: true, align: 'center' }), C('계절 합·일 최대·60분 최대는 ln(1+x), 여름 비중은 원값 → 표준화'), C('연간 합은 계절 합과 겹쳐 넣지 않음')],
    [C('묶음 조정', { bold: true, align: 'center' }), C('묶음 총분산으로 나눈 뒤 가중치 적용 (피복 0.5 · 지형 1 · 강우 0.02)'), C('—', { align: 'center' })],
    [C('극단값', { bold: true, align: 'center' }), C('표시만 함'), C('결과를 좋게 보이려고 자르거나 지우지 않음')]];
  s.addTable(rows, { x: 0.5, y: 1.95, w: 8.6, colW: [1.25, 4.35, 3.0], rowH: [0.42, 0.62, 0.62, 0.5, 0.62, 0.62, 0.5], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.08, 0, 0.08], objectName: 'table-prep' });
  T(s, '결과: 40개 피처 → 실제 거리 계산 38차원', 0.5, 6.05, 8.6, 0.4, { fontSize: 14, bold: true, color: G.dk });
  card(s, 9.35, 1.95, 3.48, 4.75);
  T(s, '로그 변환 전후 치우침', 9.55, 2.1, 3.1, 0.3, { fontSize: 14, bold: true });
  const h2 = (t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: G.g }, align: 'center', fontSize: 11, fontFace: F } });
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 11.5, fontFace: F, align: 'center', color: '333333' }, o) });
  s.addTable([[h2('항목'), h2('전'), h2('후')], [c('LS'), c('+1.77'), c('−0.17', { bold: true, color: G.dk })], [c('봄 강수'), c('+1.46'), c('+1.32')], [c('여름 강수'), c('+0.67'), c('+0.37')], [c('가을 강수'), c('+1.08'), c('+0.70')], [c('일 최대'), c('+1.31'), c('+1.15')], [c('최대 60분'), c('+2.05'), c('+1.96')]],
    { x: 9.55, y: 2.55, w: 3.08, colW: [1.28, 0.9, 0.9], rowH: 0.38, border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', objectName: 'table-skew' });
  T(s, '강우는 관측소 10곳 값뿐이라 변환 효과가 작음. 0에 가까울수록 대칭', 9.55, 5.35, 3.08, 0.8, { fontSize: 10.5, color: G.sub });
  gloss(s, [['표준화', '단위가 다른 값을 같은 기준(평균 0, 표준편차 1)으로 맞추는 것'], ['차원', '거리 계산에 실제로 쓰이는 값의 개수'], ['치우침(왜도)', '분포가 한쪽으로 쏠린 정도']]);
}
/* A4 */
{
  const s = apx('A4', '제외한 자료', '검토했지만 제외한 자료', ['확인되지 않은 값은 ', { h: '넣지 않았습니다' }]);
  const d = [['하천거리', '1개', '원본 좌표계 표기와 작업 해석이 충돌, 위치 검증 미완료'], ['배추 생육 피복', '2개', '정식 후 피복률을 가정한 곡선. 실제 작물·정식일 관측이 아님'], ['토양도·배수등급', '실험', '왕산면 실험에서 넣어도 유형 변경 4.16%·1.23%뿐. 토양 정보 연결은 1,129필지뿐'], ['R·EI30 추정값', '이전 5개', '추정식 가정이 많은 값 대신, 빈칸을 채운 분 강우로 직접 집계한 7개 값 사용'], ['필지 형상', '3개', '면적·장단축비·조밀도. 이전 분석에서 유형 구분 기여 약 1%']];
  const w = 2.3, gx = 0.207;
  d.forEach((r, i) => { const x = 0.5 + i * (w + gx); card(s, x, 1.95, w, 3.85); T(s, r[0], x + 0.2, 2.15, w - 0.4, 0.75, { fontSize: 17, bold: true }); pill(s, r[1], x + 0.2, 2.95, 1.0, { fill: G.btint, color: G.brown, fontSize: 11, h: 0.3 }); T(s, r[2], x + 0.2, 3.45, w - 0.4, 2.2, { fontSize: 12, color: '333333' }); });
  band(s, [{ text: '최종 입력: ', options: {} }, { text: '피복 31 + 지형 2 + 강우 7 = 40개 피처', options: { bold: true } }], 0.5, 6.02, W - 1, 0.66, { fontSize: 18 });
  gloss(s, [['R·EI30', '빗방울 에너지와 세기로 계산한 강우 침식력 추정값'], ['좌표계', '지도 위치를 숫자로 나타내는 기준'], ['토양도', '흙의 성질(모래·점토 등)을 나타낸 지도']]);
}
/* A5 */
{
  const s = apx('A5', '묶음 비중과 민감도', '묶음 비중과 민감도', ['유형은 ', { h: '지형 69% · 피복 31%' }, '로 나뉩니다']);
  card(s, 0.5, 1.95, 6.6, 4.75);
  T(s, '유형을 가른 몫 (묶음별 군집 간 차이 비중)', 0.75, 2.1, 6.1, 0.3, { fontSize: 14, bold: true });
  const gs = [['지형', 68.7, '3D6B45', '가중치 1'], ['피복', 31.2, '9CC48A', '가중치 0.5'], ['강우', 0.08, '5B8DB8', '가중치 0.02']];
  gs.forEach((r, i) => { const y = 2.7 + i * 0.9; T(s, r[0], 0.75, y, 0.8, 0.4, { fontSize: 15, bold: true, valign: 'middle' }); rect(s, 1.6, y + 0.07, Math.max(4.2 * r[1] / 68.7, 0.04), 0.26, r[2], { round: 0.04 }); T(s, (r[1] < 1 ? r[1].toFixed(2) : r[1].toFixed(1)) + '%', 1.68 + Math.max(4.2 * r[1] / 68.7, 0.04), y, 1.0, 0.4, { fontSize: 14, bold: true, valign: 'middle' }); T(s, r[3], 1.6, y + 0.4, 2, 0.25, { fontSize: 10.5, color: G.sub }); });
  T(s, '강우는 관측소 10곳의 값이 필지마다 반복 배정되어, 비중이 크면 유형이 \'어느 관측소 근처인가\'로 갈림 → 0.02로 낮춤', 0.75, 5.5, 6.1, 0.9, { fontSize: 12, color: '333333' });
  card(s, 7.35, 1.95, 5.48, 4.75);
  T(s, '비중을 ±25% 바꿔 다시 학습했을 때 일치도', 7.6, 2.1, 5, 0.3, { fontSize: 14, bold: true });
  const C = (t, o = {}) => cell(t, Object.assign({ fontSize: 13 }, o));
  const sv = [['피복', 0.965, 0.972], ['지형', 0.963, 0.969], ['강우', 0.999, 0.989]];
  const rows = [[hd('묶음'), hd('× 0.75'), hd('× 1.25')]];
  sv.forEach(r => rows.push([C(r[0], { bold: true }), ...[r[1], r[2]].map(v => { const [f, t] = seqFill(v, 0.5, 1.0); return C(v.toFixed(3), { fill: { color: f }, color: t, bold: true }); })]));
  s.addTable(rows, { x: 7.6, y: 2.55, w: 4.98, colW: [1.6, 1.69, 1.69], rowH: 0.5, border: { type: 'solid', color: 'FFFFFF', pt: 2 }, valign: 'middle', objectName: 'table-sens' });
  T(s, '가장 낮은 경우도 0.963 → 비중을 조금 바꿔도 유형이 거의 그대로', 7.6, 4.7, 4.98, 0.6, { fontSize: 12.5, bold: true, color: G.dk });
  T(s, '강우 빈칸을 채운 값 대신 0으로 둔 자료를 같은 모델에 넣어도 일치도 0.9997', 7.6, 5.4, 4.98, 0.7, { fontSize: 11.5, color: '555555' });
  gloss(s, [['가중치(비중)', '묶음마다 결과에 미치는 영향의 크기'], ['일치도(ARI)', '두 결과가 같은 정도, 1이면 완전히 같음']]);
}
/* A6 */
{
  const s = apx('A6', '군집 수 선정', '군집 수 선정', ['지표와 해석을 함께 보고 ', { h: '4개' }, '를 썼습니다']);
  const ks = ['2', '3', '4', '5', '6', '7', '8'];
  card(s, 0.5, 1.95, 4.15, 4.75); card(s, 4.85, 1.95, 4.15, 4.75);
  T(s, '군집 내 거리 제곱합 (천)', 0.75, 2.1, 3.7, 0.3, { fontSize: 14, bold: true });
  T(s, '실루엣 계수', 5.1, 2.1, 3.7, 0.3, { fontSize: 14, bold: true });
  const lo = Object.assign({}, chartBase, { lineSize: 2.25, lineDataSymbolSize: 8, showLegend: false, showValue: true, dataLabelPosition: 't', dataLabelFontSize: 10, catAxisTitle: '군집 수 k', showCatAxisTitle: true, catAxisTitleFontSize: 10, catAxisTitleFontFace: F, catAxisTitleColor: '777777' });
  s.addChart(pres.charts.LINE, [{ name: '거리 제곱합(천)', labels: ks, values: [32.5, 26.6, 22.1, 19.4, 17.4, 15.6, 13.9] }], Object.assign({}, lo, { x: 0.6, y: 2.45, w: 3.95, h: 4.15, chartColors: [G.g], valAxisMinVal: 10, valAxisMaxVal: 36, dataLabelFormatCode: '0.0', objectName: 'chart-inertia' }));
  s.addChart(pres.charts.LINE, [{ name: '실루엣', labels: ks, values: [0.285, 0.258, 0.260, 0.269, 0.276, 0.279, 0.297] }], Object.assign({}, lo, { x: 4.95, y: 2.45, w: 3.95, h: 4.15, chartColors: [G.g], valAxisMinVal: 0, valAxisMaxVal: 0.35, dataLabelFormatCode: '0.00', valAxisLabelFormatCode: '0.00', objectName: 'chart-sil' }));
  card(s, 9.2, 1.95, 3.63, 4.75);
  pill(s, '왜 4개인가', 9.45, 2.12, 1.5);
  const why = [['지표 차이는 작음', '실루엣이 0.26~0.30으로 k에 따라 크게 다르지 않고, 거리 합도 뚜렷하게 꺾이지 않음'], ['해석·대책 연결', '2개는 너무 거칠고, 많으면 유형마다 질문·대책을 붙이기 어려움'], ['안정성 통과', '4개에서 초기화 1.000, 표본 0.969, 비중 0.963']];
  why.forEach((r, i) => { const y = 2.68 + i * 1.3; T(s, r[0], 9.45, y, 3.15, 0.3, { fontSize: 13.5, bold: true, color: G.dk }); T(s, r[1], 9.45, y + 0.33, 3.15, 0.9, { fontSize: 11.5, color: '444444' }); });
  gloss(s, [['실루엣 계수', '묶음이 잘 나뉜 정도 (−1~1, 클수록 좋음)'], ['거리 제곱합', '각 밭과 자기 묶음 중심 사이 거리의 합 (작을수록 촘촘)'], ['계산', '38차원 입력, k마다 시작값 10회, 실루엣은 6,000필지 표본']]);
}
/* A7 */
{
  const s = apx('A7', '평가 지표', '평가 지표와 안정성', ['최종 모델의 ', { h: '평가 지표' }, ' 전체']);
  const C = (t, o = {}) => cell(t, Object.assign({ fontSize: 12, align: 'left' }, o));
  const rows = [[hd('지표'), hd('값'), hd('뜻')],
    [C('실루엣 계수 (전체)', { bold: true }), C('0.258', { bold: true, color: G.dk, align: 'center' }), C('−1~1, 클수록 잘 나뉨. 표본 3개에서 0.246~0.265')],
    [C('Davies–Bouldin', { bold: true }), C('1.196', { bold: true, color: G.dk, align: 'center' }), C('낮을수록 묶음끼리 잘 떨어짐')],
    [C('Calinski–Harabasz', { bold: true }), C('9,393', { bold: true, color: G.dk, align: 'center' }), C('높을수록 묶음 사이 차이가 큼')],
    [C('초기화 일치도', { bold: true }), C('1.000', { bold: true, color: G.dk, align: 'center' }), C('시작값을 바꿔도 결과 동일')],
    [C('표본 재학습 일치도', { bold: true }), C('0.969~0.995', { bold: true, color: G.dk, align: 'center' }), C('지역별 80%로 다시 학습 → 남은 20% 비교 (3회)')],
    [C('비중 ±25% 일치도', { bold: true }), C('0.963 이상', { bold: true, color: G.dk, align: 'center' }), C('묶음 비중을 하나씩 바꿔 다시 학습 (6가지)')],
    [C('강우 보완 방식 일치도', { bold: true }), C('0.9997', { bold: true, color: G.dk, align: 'center' }), C('채운 값 대신 0을 넣은 자료를 같은 모델에 적용')],
    [C('유형 간 차이 검정', { bold: true }), C('30 / 38', { bold: true, color: G.dk, align: 'center' }), C('ANOVA(BH 보정) 유의 항목 수 · 순위 검정(Kruskal–Wallis) 31/38')]];
  s.addTable(rows, { x: 0.5, y: 1.95, w: W - 1, colW: [3.0, 2.0, 7.33], rowH: [0.4, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.12, 0, 0.12], objectName: 'table-metrics' });
  T(s, '일치도는 두 결과가 같은 정도이지 정답 대비 정확도가 아님 · 지역 표본 재학습은 지역을 완전히 분리한 외부 검증이 아님 · 강우 항목의 검정은 관측소 값 반복이라 참고용', 0.5, 6.3, W - 1, 0.45, { fontSize: 10.5, color: G.sub });
  gloss(s, [['일치도(ARI)', '두 결과가 같은 정도, 1이면 완전히 같음'], ['BH 보정', '여러 번 검정할 때 우연히 유의하게 나오는 것을 줄이는 방법']]);
}
/* A8 */
{
  const s = apx('A8', '유형 비교표', '유형 비교표', ['중앙값으로 본 ', { h: '4가지 유형' }]);
  const H = (t, f) => hd(t, { fill: { color: f || G.dk }, fontSize: 11.5 });
  const C = (t, hi) => cell(t, { fontSize: 12.5, color: hi ? G.dk : '333333', bold: !!hi, fill: { color: hi ? G.pale : 'FFFFFF' } });
  const L = (t) => cell(t, { align: 'left', fontSize: 12, bold: true });
  const rows = [[H('항목'), H('1번\n높은 곳·경사 큰', CL[0]), H('2번\n정리 안 된·경사 작은', CL[1]), H('3번\n낮은 곳·경사 큰', CL[2]), H('4번\n정리된·경사 작은', CL[3])],
    [L('필지 수'), C('8,702'), C('8,894'), C('7,060'), C('4,159')],
    [L('경사 부담 LS'), C('13.1', 1), C('2.8'), C('11.5', 1), C('2.1')],
    [L('평균 고도 (m)'), C('738', 1), C('611'), C('532', 1), C('545')],
    [L('경지정리된 밭 (%)'), C('0'), C('0'), C('0'), C('91.6', 1)],
    [L('정리 안 된 밭 (%)'), C('90.7'), C('93.1'), C('91.3'), C('0', 1)],
    [L('숲+초지 (%)'), C('6.8'), C('5.4'), C('6.3'), C('4.4')],
    [L('여름 강수 (mm)'), C('263'), C('313'), C('239'), C('239')],
    [L('가을 강수 (mm)'), C('464'), C('464'), C('464'), C('418')],
    [L('일 최대 / 60분 최대'), C('68.5 / 19'), C('68.5 / 19'), C('70 / 20'), C('70 / 19')]];
  s.addTable(rows, { x: 0.5, y: 1.95, w: 8.4, colW: [2.0, 1.6, 1.6, 1.6, 1.6], rowH: [0.6, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42], border: { type: 'solid', color: 'E0E0E0', pt: 0.75 }, valign: 'middle', objectName: 'table-profile' });
  card(s, 9.15, 1.95, 3.68, 4.75);
  T(s, '유형 간 차이 크기 (η², 상위 8)', 9.35, 2.1, 3.3, 0.3, { fontSize: 13, bold: true });
  s.addChart(pres.charts.BAR, [{ name: 'η²', labels: ['정리 안 된 밭', '경지정리된 밭', '평균 고도', 'LS', '겨울 강수 †', '경지정리된 논', '봄 강수 †', '최대 60분 †'], values: [0.642, 0.563, 0.433, 0.412, 0.064, 0.055, 0.048, 0.032] }],
    Object.assign({}, chartBase, { x: 9.2, y: 2.4, w: 3.58, h: 4.2, barDir: 'bar', chartColors: [G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00', dataLabelFontSize: 10, catAxisOrientation: 'maxMin', catAxisLabelFontSize: 10.5,
      valAxisHidden: true, valAxisMaxVal: 0.8, valGridLine: { style: 'none' }, barGapWidthPct: 45, showLegend: false, objectName: 'chart-eta' }));
  T(s, '녹색 칸 = 다른 유형과 뚜렷이 구분되는 값 · 강우는 유형 간 차이가 작음', 0.5, 6.3, 8.4, 0.35, { fontSize: 10.5, color: G.sub });
  gloss(s, [['η²', '항목 전체 차이 중 유형 차이로 설명되는 비율 (0~1)'], ['†', '관측소 값 반복 배정 항목 (참고용)'], ['중앙값', '크기순으로 세웠을 때 가운데 값']]);
}
/* A9 */
{
  const s = apx('A9', '지역 특성', '탐색적 분석: 지역 특성', ['지역마다 ', { h: '땅과 비의 조건' }, '이 다릅니다']);
  card(s, 0.5, 1.95, 8.3, 4.75);
  const cols = ['경사\n(LS)', '평균\n고도', '여름\n강수', '가을\n강수', '일\n최대', '최대\n60분', '여름\n비중', '경지정리\n밭'];
  const keys = ['LS_mean', 'ELEV_MEAN', 'summer_rain_mm', 'autumn_rain_mm', 'max_daily_mm', 'max_60min_mm', 'summer_share', 'PCT_221'];
  const Z = { LS_mean: { changjuk: 0.66, daegwallyeong: -0.43, hajang: 0.61, imgye: -0.1, jinbu: -0.08, wangsan: -0.04, yeoryang: 0.17 },
    ELEV_MEAN: { changjuk: 2.17, daegwallyeong: 0.91, hajang: 0.64, imgye: -0.34, jinbu: -0.11, wangsan: -0.34, yeoryang: -0.92 },
    summer_rain_mm: { changjuk: -0.76, daegwallyeong: 0.63, hajang: -0.7, imgye: -0.66, jinbu: 1.24, wangsan: -0.74, yeoryang: -0.67 },
    autumn_rain_mm: { changjuk: -0.09, daegwallyeong: 0.5, hajang: -1.16, imgye: -0.35, jinbu: -0.07, wangsan: 1.54, yeoryang: -0.55 },
    max_daily_mm: { changjuk: -0.52, daegwallyeong: -0.36, hajang: -0.95, imgye: 0.14, jinbu: -0.28, wangsan: 1.53, yeoryang: -0.01 },
    max_60min_mm: { changjuk: -0.59, daegwallyeong: 2.09, hajang: -0.42, imgye: -0.3, jinbu: -0.28, wangsan: -0.41, yeoryang: -0.22 },
    summer_share: { changjuk: -1.28, daegwallyeong: -0.08, hajang: 0.0, imgye: -0.32, jinbu: 1.25, wangsan: -1.43, yeoryang: -0.23 },
    PCT_221: { changjuk: 1.15, daegwallyeong: -0.22, hajang: -0.22, imgye: 0.14, jinbu: -0.04, wangsan: 0.19, yeoryang: -0.05 } };
  const regs = ['changjuk', 'hajang', 'daegwallyeong', 'jinbu', 'wangsan', 'imgye', 'yeoryang'];
  const rows = [[cell('', { fill: { color: 'FFFFFF' } }), ...cols.map(c => cell(c, { bold: true, fontSize: 10.5 }))]];
  regs.forEach(k => rows.push([cell(RN[k], { bold: true, align: 'left', fontSize: 13 }), ...keys.map(f => { const z = Z[f][k]; const [fc, tc] = zFill(z); return cell((z > 0 ? '+' : z < 0 ? '−' : '') + Math.abs(z).toFixed(2), { fill: { color: fc }, color: tc, fontSize: 12, bold: Math.abs(z) >= 1.5 }); })]));
  s.addTable(rows, { x: 0.65, y: 2.1, w: 8.0, colW: [1.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8], rowH: [0.6, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], border: { type: 'solid', color: 'FFFFFF', pt: 2 }, valign: 'middle', objectName: 'table-region-z' });
  [['F2D9C4', '평균보다 높음'], ['A9581F', '+1.5σ 이상'], ['D5E4E2', '평균보다 낮음'], ['3F7F78', '−1.5σ 이하']].forEach((r, i) => { const x = 0.75 + i * 1.9; rect(s, x, 6.3, 0.2, 0.2, r[0], { round: 0.03 }); T(s, r[1], x + 0.28, 6.27, 1.5, 0.26, { fontSize: 10.5, color: '555555' }); });
  const ins = [['땅이 험한 곳 · 창죽, 하장', '고도 +2.17σ, +0.64σ · 경사 +0.66σ, +0.61σ', G.brown], ['비가 센 곳 · 대관령, 진부, 왕산', '대관령 최대 60분 +2.09σ, 진부 여름 강수 +1.24σ, 왕산 가을 강수·일 최대 +1.5σ', G.brown], ['낮고 완만한 곳 · 임계, 여량', '고도 −0.34σ, −0.92σ, 경사·강우는 평균 근처', '3F7F78']];
  ins.forEach((r, i) => { const y = 1.95 + i * 1.6; card(s, 9.05, y, 3.78, 1.45); T(s, r[0], 9.28, y + 0.15, 3.35, 0.35, { fontSize: 14.5, bold: true, color: r[2] }); T(s, r[1], 9.28, y + 0.55, 3.35, 0.8, { fontSize: 12, color: '444444' }); });
  gloss(s, [['σ(표준편차)', '평균에서 얼마나 떨어졌는지 재는 단위'], ['값', '지역 평균이 전체 평균보다 몇 σ 높거나 낮은지'], ['강우', '2025년 관측+보완 값, 관측소 값 반복']]);
}
/* A10 */
{
  const s = apx('A10', '유형 분포', '유형 분포 (2차원으로 줄여 본 그림)', ['4개 유형이 ', { h: '서로 다른 자리' }, '에 모여 있습니다']);
  card(s, 0.5, 1.95, 6.75, 4.75);
  s.addImage({ path: 'img_pca.png', x: 0.85, y: 2.0, w: 5.75, h: 4.47, altText: '주성분 2개로 축약한 필지 산점도', objectName: 'img-pca' });
  T(s, '9,000필지 표본 · 큰 점은 유형 중심', 0.8, 6.42, 6.2, 0.25, { fontSize: 10.5, color: G.sub });
  CN.forEach((c, i) => { const y = 1.95 + i * 1.2; card(s, 7.5, y, 5.33, 1.08); dot(s, i + 1, 7.7, y + 0.24, 0.6, CL[i], { fontSize: 18 }); T(s, c, 8.5, y + 0.15, 4.1, 0.4, { fontSize: 16, bold: true }); T(s, ['오른쪽: 높은 고도·경사 큼', '가운데: 경사 작음·정리 안 된 밭', '아래쪽: 낮은 고도·경사 큼', '왼쪽: 경지정리된 밭'][i], 8.5, y + 0.58, 4.1, 0.3, { fontSize: 11.5, color: '555555' }); });
  gloss(s, [['주성분', '많은 항목을 정보 손실을 줄이며 2개 축으로 요약한 값'], ['분산', '두 축이 원래 차이를 설명하는 정도 (합 68.9%)']]);
}
/* A11 */
{
  const s = apx('A11', '추천 규칙표', '추천 규칙과 안내 원칙', ['현장 답변이 맞을 때만 ', { h: '대책을 안내' }, '합니다']);
  card(s, 0.5, 1.95, 8.0, 4.75);
  const C = (t, o = {}) => cell(t, Object.assign({ align: 'left', fontSize: 11.5 }, o));
  const lv = (t, f, c) => cell(t, { fontSize: 10.5, bold: true, color: c || G.dk, fill: { color: f } });
  const rows = [[hd('현장 답변 조건', { fontSize: 11.5 }), hd('안내', { fontSize: 11.5 }), hd('수준', { fontSize: 11.5 })],
    [C('흙이 드러남 + 피복재 적합 확인'), C('노출부 피복 보완 검토'), lv('보완책 후보', G.pale)],
    [C('수확 후 빈 기간 + 피복작물 일정 가능'), C('작기 사이 피복작물 검토'), lv('보완책 후보', G.pale)],
    [C('넓고 얕은 흐름 + 공간 + 통행 충돌 없음 + 안정 배출구'), C('완충식생대 후보 검토'), lv('현장설계 상담', 'DCE8F3', '23476B')],
    [C('한곳으로 모인 흐름 + 같은 조건'), C('식생수로 등 집중 물길 관리'), lv('현장설계 상담', 'DCE8F3', '23476B')],
    [C('비 그친 뒤 반복적인 물고임'), C('물고임 원인 점검 (시설 후보 보류)'), lv('현장 확인', G.btint, G.brown)],
    [C('흙 노출 없음 + 기존 피복 양호'), C('현재 피복 유지·변화 점검'), lv('유지관리', 'EEEEEE', '555555')]];
  s.addTable(rows, { x: 0.7, y: 2.15, w: 7.6, colW: [3.75, 2.55, 1.3], rowH: [0.42, 0.55, 0.55, 0.62, 0.55, 0.55, 0.55], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.08, 0, 0.08], objectName: 'table-rules' });
  card(s, 8.75, 1.95, 4.08, 4.75);
  pill(s, '안내 원칙', 9.0, 2.12, 1.3);
  const pr = [['유형은 질문 순서만 바꾼다', '대책을 고르는 조건은 모든 유형에 같음'], ['모르는 답은 \'아니요\'가 아니다', '빈 답은 모름으로 두고 추가 확인 안내'], ['수치를 지어내지 않는다', '설치 폭·효과율·품종은 현장 설계로 결정'], ['군집 없이도 안내한다', '유형이 불확실해도 답변으로 일반 후보 제시']];
  pr.forEach((r, i) => { const y = 2.65 + i * 0.95; T(s, r[0], 9.0, y, 3.65, 0.3, { fontSize: 13, bold: true, color: G.dk }); T(s, r[1], 9.0, y + 0.33, 3.65, 0.5, { fontSize: 11.5, color: '555555' }); });
  gloss(s, [['현장설계 상담', '위치·크기를 전문가와 현장에서 정하는 단계'], ['배출구', '밭의 물이 빠져나가는 곳'], ['규칙표', '서비스 엔진의 12개 질문·규칙 (테스트 12건 통과)']]);
}
/* A12 */
{
  const s = apx('A12', '대책 근거 상세', '대책의 근거 상세', ['연구와 ', { h: '보전 기준' }, '으로 확인된 방법']);
  const d = [['완충식생대', '59~88%', '토양유실 저감', '고랭지 배추밭(경사 17%), 호밀 식생대 폭 2m·4m', '진용익 외(2009), 한국토양비료학회지 42(4)', 'NRCS 393 Filter Strip: 넓고 얕은 유출에 적용'],
    ['볏짚·잔재 피복', '50~68%', '유출량 저감', '국내 사양토 콩밭(경사 2~8.4%), 2년 시험', 'Shin et al.(2016), Irrigation and Drainage 65', 'USDA 지표 피복: 빗방울 충격 감소 원리'],
    ['피복작물', '72%', '토양유실 평균 저감', '서유럽 메타분석, 가을·겨울 맨땅 대비', 'Clement et al.(2024), Soil Use and Management 40(2)', 'NRCS 340 Cover Crop: 작기 공백 피복'],
    ['식생수로', '물길 안정', '집중 유출·토사 이동 억제', '농업 유역에서 집중 흐름을 배수하며 물길 침식 억제', 'Fiener & Auerswald(2003), J. Environ. Qual. 32(3)', 'NRCS 412 Grassed Waterway: 안정 배출구 필요']];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 1.95, w, 4.1);
    pill(s, r[0], x + 0.22, 2.15, 1.95);
    T(s, r[1], x + 0.22, 2.7, w - 0.44, 0.75, { fontSize: i === 3 ? 30 : 36, bold: true, color: G.dk, valign: 'middle' });
    T(s, r[2], x + 0.22, 3.48, w - 0.44, 0.3, { fontSize: 13.5, bold: true, color: '333333' });
    T(s, r[3], x + 0.22, 3.85, w - 0.44, 0.6, { fontSize: 11, color: '444444' });
    T(s, r[4], x + 0.22, 4.48, w - 0.44, 0.45, { fontSize: 9.5, color: G.mute });
    card(s, x + 0.15, 5.05, w - 0.3, 0.82, { fill: G.tint, noShadow: true, r: 0.1 });
    T(s, r[5], x + 0.27, 5.09, w - 0.54, 0.74, { fontSize: 10.5, color: G.dk, valign: 'middle' });
  });
  band(s, '연구 수치는 각 시험 조건의 결과로, 우리 밭의 예상 저감률이 아니며 서로 다른 대책의 효과를 더하지 않습니다', 0.5, 6.18, W - 1, 0.52, { fontSize: 13, bold: true, fill: G.tint, color: G.dk });
  gloss(s, [['NRCS', '미국 자연자원보전청 (농지 보전 기준을 만드는 기관)'], ['메타분석', '여러 연구 결과를 모아 종합한 분석']]);
}
/* A13 Q&A */
{
  const s = apx('A13', '예상 질문', '질의응답 대비', ['예상 질문과 ', { h: '답변 근거' }]);
  const qa = [['정부 시범사업도 효과가 있지 않나요?', '있습니다. 계단식 경사도 완화 시범지(홍천 광원리·창촌리)에서 주변 밭 대비 흙탕물(SS)이 최대 86.5% 줄었습니다. 다만 2020년 8월 3회 측정한 2개 지점 결과이고, 밭 모양을 바꾸는 공사형 사업이라 모든 밭에 똑같이 적용하기 어렵습니다. 그래서 어떤 밭에 어떤 대책이 필요한지 고르는 기준이 필요하고, 그 기준이 저희 유형 분류입니다.', '한국수자원학회 학술발표회(2023), 고랭지밭 경사도 완화 비점저감 효과'],
    ['강우를 넣었는데 왜 유형 구분에 거의 영향이 없나요?', '강우 값은 관측소 10곳의 값이 밭마다 반복되기 때문입니다. 비중을 크게 두면 유형이 \'어느 관측소 근처인가\'로 나뉘어 비중을 0.02로 낮췄습니다. 강우 차이는 유형보다 지역 차이로 보는 것이 맞습니다.', '별첨 A5 · A9'],
    ['왜 4개 유형인가요?', '실루엣 계수가 2~8개에서 0.26~0.30으로 큰 차이가 없어서, 유형마다 질문·대책을 연결할 수 있는 4개를 골랐습니다. 4개에서 안정성 검사 일치도는 모두 0.96 이상입니다.', '별첨 A6 · A7']];
  qa.forEach((r, i) => {
    const h = i === 0 ? 1.75 : 1.35, y = i === 0 ? 1.95 : (i === 1 ? 3.8 : 5.25);
    card(s, 0.5, y, W - 1, h - 0.1);
    pill(s, 'Q' + (i + 1), 0.7, y + 0.15, 0.6, { fill: G.brown, fontSize: 13, h: 0.34 });
    T(s, r[0], 1.45, y + 0.13, 6.5, 0.38, { fontSize: 15, bold: true });
    T(s, r[2], 8.0, y + 0.15, 4.65, 0.34, { fontSize: 9.5, color: G.mute, align: 'right' });
    T(s, r[1], 1.45, y + 0.55, 11.2, h - 0.72, { fontSize: 12.5, color: '333333' });
  });
  gloss(s, [['SS', '물속에 떠 있는 흙 입자(부유물질), 흙탕물 정도'], ['경사도 완화', '급한 밭을 계단식으로 다시 만들어 경사를 줄이는 사업'], ['실루엣 계수', '묶음이 잘 나뉜 정도']]);
}
/* A14 glossary */
{
  const s = apx('A14', '용어 사전', '용어 사전', ['발표에 나온 ', { h: '용어 한눈에 보기' }]);
  const terms = [['팜맵', '농림축산식품부의 농경지 전자지도'], ['필지', '지도에서 하나로 구분된 밭 한 구획'], ['피처', '분석에 쓰는 항목 (예: 고도, 경사)'], ['고랭지 / 완전고랭지', '해발 400m 이상 / 600m 이상의 농경지'], ['LS', '경사의 길이·가파름을 합친 지형 값 (경사각 아님)'], ['DEM', '땅의 높이를 격자로 기록한 지도'], ['토지피복지도', '땅이 무엇으로 덮였는지 나눈 지도'], ['경지정리', '밭 모양·배수로를 반듯하게 정비한 것'], ['결측 / 보간', '값이 빈 것 / 앞뒤 값으로 빈칸을 채우는 것'], ['로그 변환', '큰 값을 줄여 치우친 분포를 펴는 계산'], ['표준화', '단위가 다른 값을 같은 기준으로 맞추는 것'], ['가중치', '묶음마다 결과에 미치는 영향의 크기'],
    ['K-means', '비슷한 것끼리 k개 묶음으로 나누는 방법'], ['군집(유형)', '비슷한 밭끼리 묶인 그룹'], ['중앙값', '크기순으로 세웠을 때 가운데 값'], ['박스플롯', '가운데 50% 범위와 중앙값을 보여주는 그래프'], ['실루엣 계수', '묶음이 잘 나뉜 정도 (−1~1)'], ['일치도(ARI)', '두 결과가 같은 정도 (1 = 같음)'], ['ANOVA', '여러 그룹의 평균 차이를 확인하는 검정'], ['완충식생대', '밭 아래쪽에 심어 흙탕물을 거르는 풀 띠'], ['식생수로', '물길에 풀을 심어 깎임을 막는 수로'], ['피복작물', '밭이 비는 기간에 땅을 덮는 작물'], ['객토', '깎여 나간 흙 대신 새 흙을 넣는 것'], ['유역', '빗물이 같은 하천으로 모이는 땅 전체']];
  const half = 12;
  [0, 1].forEach(c => {
    const rows = terms.slice(c * half, (c + 1) * half).map(([t, d]) => [cell(t, { bold: true, color: G.dk, align: 'left', fontSize: 11.5, fill: { color: G.tint } }), cell(d, { align: 'left', fontSize: 11.5 })]);
    s.addTable(rows, { x: 0.5 + c * 6.27, y: 1.95, w: 6.06, colW: [2.0, 4.06], rowH: 0.395, border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.1, 0, 0.1], objectName: nm('table-gloss') });
  });
}
pres.writeFile({ fileName: process.argv[2] }).then(f => console.log('wrote', f));
