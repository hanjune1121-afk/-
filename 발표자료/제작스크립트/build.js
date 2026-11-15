const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = '강원 고랭지 토양유실 위험 분석 — 데이터 수집·분석·예방전략';
pres.theme = { headFontFace: 'Pretendard', bodyFontFace: 'Pretendard' };
const F = 'Pretendard';
const G = { dk: '2F4F2F', g: '4F6F4C', lg: '8FBC7F', pale: 'D3E5CA', tint: 'EEF3EA', bg: 'F1F1F1', ink: '111111', sub: '7A7A7A', mute: '9A9A9A', brown: '8A5A2B', btint: 'F3EADF' };
const CL = ['1E7A46', '4C8FD6', 'E39A2D', 'B8457A'];
const CN = ['경지정리 밭·저LS형', '저지대 소필지·고LS형', '고지대·고LS형', '미정리 밭·저LS형'];
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

/* ============ S1. 유사 연구와 차별점 (section 01) ============ */
{
  const s = slide(0, '유사 연구와 차별점', '유사 연구와 우리 연구의 차이', ['기존 연구가 \'얼마나\'를 봤다면, 우리는 ', { h: '\'왜, 무엇을\'' }, ' 봅니다']);
  const rows = [
    ['서일규 외 (2010)', 'SATEEC·USPED를 이용한 토양 유실량 산정 및 우선관리 유역 선정', '홍천 자운리를 54개 소유역으로 나눠 유실량을 계산하고 우선 관리 소유역을 선정', '분석 단위가 소유역 (빗물이 같은 지류로 모이는 골짜기 단위)', '필지 단위로 분석'],
    ['성윤수 외 (2015)', 'Web GIS 기반 복합 토양 질 평가 시스템 개발', 'Web GIS로 침식 잠재성을 평가하고 등급별 저감 방법(BMP)을 제시', '흙의 여러 기능을 하나의 등급으로 합쳐서 제시', '원인 인자별로 나눠 밭마다 맞는 대책'],
    ['김주훈·김경탁·이진원 (2011)', '클라우드 및 HyGIS 기반 토양유실분석 시스템 개발', '개발 공사 전 재해 평가용으로, 지역을 지정하면 웹에서 토양유실 지도를 생성', '얼마나 유실되는지 양을 계산', '왜 위험하고 무엇을 할지 안내'],
    ['최용범 외 (2012)', '고랭지 밭의 토양유실 특성 및 최적영농관리방안 (PAM·Biopolymer)', '고랭지 밭 유실 특성과 기존 대책을 정리하고 PAM·바이오폴리머를 새 대책으로 제안', '새로운 대책 하나를 제안', '밭 조건에 맞는 대책을 골라 줌']];
  T(s, '선행 연구', 0.9, 1.95, 3.4, 0.25, { fontSize: 11.5, bold: true, color: G.sub });
  T(s, '내용', 4.55, 1.95, 4.0, 0.25, { fontSize: 11.5, bold: true, color: G.sub });
  T(s, '기존 연구의 범위  →  우리 연구', 8.85, 1.95, 4.0, 0.25, { fontSize: 11.5, bold: true, color: G.sub });
  rows.forEach((r, i) => {
    const y = 2.25 + i * 1.0;
    card(s, 0.5, y, W - 1, 0.88);
    dot(s, i + 1, 0.7, y + 0.24, 0.4, G.g, { fontSize: 13 });
    T(s, r[0], 1.25, y + 0.12, 3.1, 0.25, { fontSize: 12, bold: true, color: G.dk });
    T(s, r[1], 1.25, y + 0.38, 3.1, 0.45, { fontSize: 11, color: '555555' });
    T(s, r[2], 4.55, y + 0.16, 4.05, 0.6, { fontSize: 12, color: '333333', valign: 'middle' });
    T(s, r[3], 8.85, y + 0.12, 3.85, 0.3, { fontSize: 11, color: G.sub });
    T(s, [{ text: '→  ', options: { color: G.lg, bold: true } }, { text: r[4], options: { bold: true, color: G.dk } }], 8.85, y + 0.47, 3.85, 0.3, { fontSize: 13.5 });
  });
  band(s, [{ text: '유역·지역 단위의 "얼마나"에서  ', options: {} }, { text: '필지 단위의 "왜 + 무엇을"로', options: { bold: true } }], 0.5, 6.35, W - 1, 0.62, { fontSize: 18 });
  s.addNotes('기존 연구는 유역 단위로 유실량을 계산하거나, 등급이나 지도를 만들어 주는 데 집중했습니다. 저희는 필지 단위로 위험 조건이 왜 다른지 나누고, 그 조건에 맞는 대책을 고르는 데 초점을 둡니다.');
}

divider('02', '데이터 수집 및 전처리', ['분석 대상 지역', '데이터 수집', '탐색적 분석', '데이터 전처리']);

/* ============ S3. 분석 대상 지역 ============ */
{
  const s = slide(1, '분석 대상 지역', '분석 대상 지역 선정 근거', ['왜 강원에서도 ', { h: '이 7개 지역' }, '인가요?']);
  card(s, 0.5, 2.0, 7.55, 4.85);
  T(s, '지역별 고랭지 필지 비율', 0.8, 2.17, 4.5, 0.3, { fontSize: 15, bold: true });
  T(s, '고도 중앙값 순 · 학습 필지 기준', 0.8, 2.47, 4.5, 0.25, { fontSize: 11, color: G.sub });
  const reg = ['태백 창죽동 (877m)', '평창 대관령면 (775m)', '삼척 하장면 (709m)', '강릉 왕산면 (646m)', '평창 진부면 (585m)', '정선 임계면 (548m)', '정선 여량면 (429m)'];
  s.addChart(pres.charts.BAR, [
    { name: '해발 400m 이상 (고랭지밭)', labels: reg, values: [100, 100, 100, 70.5, 100, 100, 69.8] },
    { name: '해발 600m 이상 (완전고랭지밭)', labels: reg, values: [100, 94.1, 88.3, 62.4, 42.3, 29.4, 15.8] }],
    Object.assign({}, chartBase, { x: 0.65, y: 2.75, w: 7.25, h: 4.0, barDir: 'bar', chartColors: [G.lg, G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelFontSize: 9.5,
      catAxisOrientation: 'maxMin', valAxisHidden: true, valAxisMaxVal: 115, valGridLine: { style: 'none' }, barGapWidthPct: 45, showLegend: true, legendPos: 't', legendFontSize: 10.5, legendColor: '444444', catAxisLabelFontSize: 11, objectName: 'chart-elev' }));
  const cards = [
    ['92.8%', '학습 필지 중 해발 400m 이상', '600m 이상 54.0% · 고도 중앙값 614m. 다섯 지역은 모든 필지가 400m 이상', G.dk],
    ['주산지', '대표 고랭지 배추 산지 포함', '안반데기(왕산) · 매봉산(창죽) · 귀네미마을(하장) · 대관령', G.dk],
    ['429~877m', '서로 다른 조건을 함께 비교', '고도·경사·강우가 지역마다 달라, 같은 고랭지 안에서도 위험 조건이 어떻게 갈리는지 볼 수 있음', G.brown]];
  cards.forEach((r, i) => {
    const y = 2.0 + i * 1.65;
    card(s, 8.3, y, 4.53, 1.5);
    T(s, r[0], 8.55, y + 0.17, 4.1, 0.5, { fontSize: 26, bold: true, color: r[3] });
    T(s, r[1], 8.55, y + 0.67, 4.1, 0.28, { fontSize: 14, bold: true });
    T(s, r[2], 8.55, y + 0.97, 4.1, 0.48, { fontSize: 11.5, color: '555555' });
  });
  src(s, '고랭지 기준은 앞 배경 자료와 같음(400m 이상 고랭지밭, 600m 이상 완전고랭지밭) · 고도는 90m DEM의 필지 평균 · 학습 필지 28,815개');
  s.addNotes('분석 대상 7개 지역은 고랭지 기준을 충족합니다. 학습 필지의 92.8%가 해발 400m 이상, 54%가 600m 이상입니다. 안반데기, 매봉산, 귀네미마을, 대관령 같은 대표 고랭지 배추 산지가 포함되고, 지역마다 고도와 강우 조건이 달라 같은 고랭지 안에서도 위험 조건이 어떻게 갈리는지 비교할 수 있습니다.');
}
/* ============ S4. 데이터 수집 ============ */
{
  const s = slide(1, '데이터 수집', '데이터 수집', ['서로 다른 자료를 ', { h: '팜맵 필지 단위' }, '로 모았습니다']);
  card(s, 0.5, 2.0, 7.9, 3.95);
  const rows = [[hd('묶음'), hd('자료'), hd('출처'), hd('공간 단위 → 필지 연결'), hd('피처')],
    [cell('토지피복', { bold: true }), cell('세분류 토지피복지도 (2025)'), cell('환경부'), cell('분류 도형 중첩 → 면적 구성비'), cell('31', { bold: true, color: G.dk })],
    [cell('지형', { bold: true }), cell('수치표고모델 (DEM)'), cell('국토지리정보원'), cell('90m 격자 → 필지 평균'), cell('2', { bold: true, color: G.dk })],
    [cell('형상', { bold: true }), cell('팜맵 필지 경계'), cell('농림축산식품부'), cell('필지 도형에서 계산'), cell('3', { bold: true, color: G.dk })],
    [cell('강우', { bold: true }), cell('ASOS·AWS 분자료 (2025)'), cell('기상청'), cell('관측소 → 최근접 필지 배정'), cell('5', { bold: true, color: G.dk })],
    [cell('합계', { bold: true, fill: { color: G.tint } }), cell('', { fill: { color: G.tint } }), cell('', { fill: { color: G.tint } }), cell('', { fill: { color: G.tint } }), cell('41', { bold: true, color: G.dk, fill: { color: G.tint }, fontSize: 14 })]];
  s.addTable(rows, { x: 0.7, y: 2.2, w: 7.5, colW: [1.05, 2.15, 1.3, 2.35, 0.65], rowH: [0.46, 0.56, 0.56, 0.56, 0.56, 0.5], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', objectName: 'table-sources' });
  card(s, 8.65, 2.0, 4.18, 4.85);
  T(s, '지역별 팜맵 필지 수', 8.9, 2.17, 3.7, 0.3, { fontSize: 15, bold: true });
  s.addChart(pres.charts.BAR, [{ name: '필지 수', labels: ['평창 진부면', '정선 임계면', '강릉 왕산면', '평창 대관령면', '삼척 하장면', '정선 여량면', '태백 창죽동'], values: [7652, 6042, 4305, 3929, 3825, 2703, 408] }],
    Object.assign({}, chartBase, { x: 8.75, y: 2.5, w: 3.98, h: 4.25, barDir: 'bar', chartColors: [G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0', dataLabelFontSize: 10,
      catAxisOrientation: 'maxMin', valAxisHidden: true, valAxisMaxVal: 9400, valGridLine: { style: 'none' }, barGapWidthPct: 50, showLegend: false, catAxisLabelFontSize: 11, objectName: 'chart-region' }));
  band(s, [{ text: '필지 기준 통합표   ', options: { bold: true } }, { text: '28,864필지 × 41피처' }], 0.5, 6.12, 7.9, 0.73, { fontSize: 18 });
  src(s, '연결키 REGION_KEY + ID + UID(문자열로 유지) · 지역명·좌표·식별키는 분석 입력에서 제외');
  s.addNotes('토지피복, 지형, 필지 형상, 강우 네 묶음의 자료를 기관별로 받아 모두 팜맵 필지에 맞춰 연결했습니다. 결과는 28,864필지, 41개 피처의 통합표입니다.');
}
/* ============ S5. 4가지 인자 ============ */
{
  const s = slide(1, '인자 구성', '데이터 종류: 인자 4가지', ['토양유실 조건을 설명하는 ', { h: '4가지 인자, 41개 피처' }]);
  const d = [['토지피복', '31', '땅이 무엇으로 덮여 있는가', '경지정리된 밭·안 된 밭, 초지, 산림, 나지 등 31종의 면적 비율', '0.75'],
    ['지형', '2', '물이 얼마나 세게 흐르는가', 'LS (경사 길이·경사도 인자), 평균 고도', '1.5'],
    ['필지 형상', '3', '대책을 설치할 수 있는 모양인가', '필지 면적, 장단축비, 형상 조밀도', '0.5'],
    ['강우', '5', '비가 얼마나 세게 몰아 오는가', '연간 R, 최대 1시간·일 강수량, 상위 5사건 비중, 6~9월 비중', '0.25']];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.15);
    dot(s, r[1], x + w / 2 - 0.55, 2.3, 1.1, i === 3 ? G.lg : G.g, { fontSize: 32 });
    T(s, r[0], x + 0.2, 3.55, w - 0.4, 0.4, { fontSize: 20, bold: true, align: 'center' });
    T(s, '피처 ' + r[1] + '개', x + 0.2, 3.97, w - 0.4, 0.28, { fontSize: 12, color: G.sub, align: 'center' });
    rect(s, x + 0.3, 4.4, w - 0.6, 0.012, 'E3E3E3');
    T(s, r[2], x + 0.25, 4.55, w - 0.5, 0.32, { fontSize: 14, bold: true, color: G.dk, align: 'center' });
    T(s, r[3], x + 0.25, 4.95, w - 0.5, 0.75, { fontSize: 12, color: '444444', align: 'center' });
    pill(s, '묶음 가중치 ' + r[4], x + w / 2 - 0.9, 5.72, 1.8, { fill: G.tint, color: G.dk, fontSize: 11.5, h: 0.3 });
  });
  band(s, [{ text: '31 + 2 + 3 + 5 = 41개 피처  ·  ', options: {} }, { text: '처음 검토한 6개 인자 중 검증이 어려운 2개(하천거리·생육 피복 가정)는 제외', options: { bold: true } }], 0.5, 6.35, W - 1, 0.6, { fontSize: 15, fill: G.dk });
  s.addNotes('최종 분석에는 토지피복, 지형, 필지 형상, 강우 4가지 인자 41개 피처를 썼습니다. 처음 가설에서 말한 6개 인자 가운데 하천거리와 배추 생육 피복 가정은 값의 검증이 어려워 제외했습니다. 가중치는 뒤의 전처리에서 설명합니다.');
}
/* ============ S6. 강우·피복 인자 ============ */
{
  const s = slide(1, '강우·피복 인자', '강우와 피복 인자는 어떻게 계산했나', ['비의 힘은 ', { h: 'EI30' }, ', 땅의 덮임은 ', { h: '피복 구성비' }, '로 봤습니다']);
  card(s, 0.5, 2.0, 6.05, 4.85);
  pill(s, '강우 침식력', 0.75, 2.2, 1.6);
  band(s, [{ text: 'EI30  =  E  ×  I30', options: { bold: true } }], 0.75, 2.75, 5.55, 0.8, { fontSize: 30, fill: G.g });
  const defs = [['E', '강우 사건의 운동에너지 (MJ/ha)'], ['I30', '사건 중 가장 센 연속 30분 강우강도 (mm/h)'], ['R', '2025년 사건 EI30의 합 (MJ·mm/ha·h)']];
  defs.forEach((r, i) => { const y = 3.75 + i * 0.42; T(s, r[0], 0.85, y, 0.6, 0.32, { fontSize: 15, bold: true, color: G.dk }); T(s, r[1], 1.5, y, 4.8, 0.32, { fontSize: 13.5, color: '333333' }); });
  card(s, 0.75, 5.1, 5.55, 0.78, { fill: G.tint, noShadow: true, r: 0.12 });
  T(s, [{ text: '예시  ', options: { bold: true, color: G.dk } }, { text: '30분 동안 15mm가 오면 I30 = 30mm/h. 이 사건의 E가 5MJ/ha라면 EI30 = 5 × 30 = 150' }], 0.95, 5.17, 5.2, 0.64, { fontSize: 12, color: '333333', valign: 'middle' });
  T(s, '강우 피처 5개: 연간 R · 최대 1시간 강수 · 일 최대 강수 · 상위 5사건 EI30 비중 · 6~9월 R 비중', 0.75, 6.02, 5.55, 0.6, { fontSize: 11.5, color: G.sub });
  card(s, 6.78, 2.0, 6.05, 4.85);
  pill(s, '피복 인자', 7.03, 2.2, 1.3);
  T(s, '세분류 토지피복지도 31종의 필지별 면적 비율', 7.03, 2.75, 5.6, 0.32, { fontSize: 15, bold: true });
  T(s, '대상 필지는 대부분 밭으로, 밭 비율 중앙값은 약 90%입니다. 경지정리 여부가 유형을 가르는 주요 기준이 되었습니다.', 7.03, 3.1, 5.6, 0.55, { fontSize: 12, color: '444444' });
  const cv = [['경지정리 안 된 밭', '중앙값 89.8%'], ['경지정리된 밭', '1번 유형에 집중'], ['기타초지', '중앙값 5.3%'], ['산림·나지 등', '나머지 27종']];
  cv.forEach((r, i) => { const x = 7.03 + (i % 2) * 2.85, y = 3.78 + Math.floor(i / 2) * 0.55; rect(s, x, y + 0.07, 0.16, 0.16, [G.g, G.lg, 'B9CFAE', 'D5D5D5'][i], { round: 0.03 }); T(s, [{ text: r[0] + '  ', options: { bold: true } }, { text: r[1], options: { color: G.sub } }], x + 0.25, y, 2.6, 0.3, { fontSize: 11.5 }); });
  card(s, 7.03, 4.95, 5.55, 1.7, { fill: G.btint, noShadow: true, r: 0.12 });
  T(s, [{ text: '검토 후 제외 · ', options: { bold: true, color: G.brown } }, { text: '배추 생육 피복 가정', options: { bold: true } }], 7.2, 5.05, 2.9, 0.3, { fontSize: 12.5 });
  T(s, '정식 후 0·18·46·58일에 피복률 5·20·80·80%를 가정한 곡선. 실제 작물·정식일 관측이 아니어서 최종 41피처에서 뺐습니다.', 7.2, 5.4, 2.75, 1.2, { fontSize: 11, color: '444444' });
  s.addChart(pres.charts.LINE, [{ name: '가정 피복률', labels: ['0', '18', '46', '58'], values: [5, 20, 80, 80] }],
    Object.assign({}, chartBase, { x: 10.0, y: 5.0, w: 2.5, h: 1.6, chartColors: [G.brown], lineSize: 2, lineDataSymbolSize: 6, showValue: true, dataLabelPosition: 't', dataLabelFontSize: 9, dataLabelFormatCode: '0"%"',
      valAxisHidden: true, valAxisMaxVal: 110, valAxisMinVal: 0, valGridLine: { style: 'none' }, catAxisLabelFontSize: 9, showLegend: false, catAxisTitle: '정식 후 일수', showCatAxisTitle: true, catAxisTitleFontSize: 9, catAxisTitleColor: '777777', catAxisTitleFontFace: F, objectName: 'chart-cover-assume' }));
  s.addNotes('강우의 힘은 EI30으로 계산했습니다. 강우 사건의 운동에너지 E에 가장 센 30분 강우강도 I30을 곱한 값이고, 1년 동안 더한 것이 R입니다. 피복은 토지피복지도 31종의 면적 비율입니다. 배추가 자라며 땅을 덮는 정도를 가정한 곡선도 만들었지만, 실측이 아니어서 최종 모델에서는 뺐습니다.');
}
/* ============ S7. 지역 특성 heatmap ============ */
{
  const s = slide(1, '탐색적 분석 · 지역 특성', '탐색적 분석: 지역 특성', ['7개 지역은 ', { h: '\'땅이 험한 곳\'' }, '과 ', { h: '\'비가 센 곳\'' }, '으로 갈립니다']);
  card(s, 0.5, 2.0, 8.1, 4.85);
  const cols = ['경사\n(LS)', '평균\n고도', '연간\nR', '1시간\n최대강우', '일\n최대강우', '6~9월\n강우비중', '경지정리\n밭', '필지\n면적'];
  const keys = ['LS_mean', 'ELEV_MEAN', 'R_2025_RANK1', 'RAIN_PRIMARY_obs_max_60min_mm', 'RAIN_PRIMARY_obs_max_calendar_day_mm', 'R_summer_JunSep_share', 'PCT_221', 'GEOM_AREA_M2'];
  const Z = { LS_mean: { changjuk: 0.66, daegwallyeong: -0.43, hajang: 0.61, imgye: -0.1, jinbu: -0.08, wangsan: -0.04, yeoryang: 0.17 },
    ELEV_MEAN: { changjuk: 2.17, daegwallyeong: 0.91, hajang: 0.64, imgye: -0.34, jinbu: -0.11, wangsan: -0.34, yeoryang: -0.92 },
    R_2025_RANK1: { changjuk: -0.79, daegwallyeong: 1.27, hajang: -1.29, imgye: -0.71, jinbu: 0.71, wangsan: 0.3, yeoryang: -0.8 },
    RAIN_PRIMARY_obs_max_60min_mm: { changjuk: -0.59, daegwallyeong: 2.09, hajang: -0.42, imgye: -0.3, jinbu: -0.28, wangsan: -0.41, yeoryang: -0.22 },
    RAIN_PRIMARY_obs_max_calendar_day_mm: { changjuk: -0.52, daegwallyeong: -0.36, hajang: -0.95, imgye: 0.14, jinbu: -0.28, wangsan: 1.53, yeoryang: -0.01 },
    R_summer_JunSep_share: { changjuk: -2.71, daegwallyeong: 0.85, hajang: -1.18, imgye: -0.4, jinbu: 1.14, wangsan: -0.78, yeoryang: -0.25 },
    PCT_221: { changjuk: 1.15, daegwallyeong: -0.22, hajang: -0.22, imgye: 0.14, jinbu: -0.04, wangsan: 0.19, yeoryang: -0.05 },
    GEOM_AREA_M2: { changjuk: 0.39, daegwallyeong: 0.29, hajang: 0.14, imgye: -0.12, jinbu: -0.1, wangsan: 0.1, yeoryang: -0.27 } };
  const regs = [['changjuk', '태백 창죽'], ['hajang', '삼척 하장'], ['daegwallyeong', '평창 대관령'], ['jinbu', '평창 진부'], ['wangsan', '강릉 왕산'], ['imgye', '정선 임계'], ['yeoryang', '정선 여량']];
  const rows = [[cell('', { fill: { color: 'FFFFFF' } }), ...cols.map(c => cell(c, { bold: true, fontSize: 10.5, color: '333333' }))]];
  regs.forEach(([k, lab]) => rows.push([cell(lab, { bold: true, align: 'left', fontSize: 12 }), ...keys.map(f => { const z = Z[f][k]; const [fc, tc] = zFill(z); return cell((z > 0 ? '+' : z < 0 ? '−' : '') + Math.abs(z).toFixed(2), { fill: { color: fc }, color: tc, fontSize: 12, bold: Math.abs(z) >= 1.5 }); })]));
  s.addTable(rows, { x: 0.7, y: 2.2, w: 7.7, colW: [1.3, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8], rowH: [0.62, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], border: { type: 'solid', color: 'FFFFFF', pt: 2 }, valign: 'middle', objectName: 'table-region-z' });
  const lg = [['ECE9E4', '±0.25 이내'], ['F2D9C4', '평균보다 높음'], ['A9581F', '+1.5σ 이상'], ['D5E4E2', '평균보다 낮음'], ['3F7F78', '−1.5σ 이하']];
  lg.forEach((r, i) => { const x = 0.75 + i * 1.5; rect(s, x, 6.43, 0.2, 0.2, r[0], { round: 0.03 }); T(s, r[1], x + 0.28, 6.4, 1.2, 0.26, { fontSize: 10.5, color: '555555' }); });
  const ins = [['땅이 험한 곳 · 창죽, 하장', '경사 +0.66σ, +0.61σ · 고도 +2.17σ, +0.64σ. 강우 지표는 대부분 평균보다 낮음', G.brown],
    ['비가 센 곳 · 대관령, 진부, 왕산', '대관령 1시간 최대 +2.09σ·R +1.27σ, 진부 여름 비중 +1.14σ, 왕산 일 최대 +1.53σ', G.brown],
    ['낮고 완만한 곳 · 임계, 여량', '고도 −0.34σ, −0.92σ. 경사·강우 모두 평균 근처', '3F7F78']];
  ins.forEach((r, i) => { const y = 2.0 + i * 1.32; card(s, 8.85, y, 3.98, 1.18); T(s, r[0], 9.08, y + 0.15, 3.6, 0.3, { fontSize: 14.5, bold: true, color: r[2] }); T(s, r[1], 9.08, y + 0.5, 3.6, 0.62, { fontSize: 11.5, color: '444444' }); });
  card(s, 8.85, 5.96, 3.98, 0.89, { fill: G.tint, noShadow: true, r: 0.12 });
  T(s, [{ text: '주의 · ', options: { bold: true, color: G.dk } }, { text: '강우 값은 관측소 값을 필지에 반복 배정해 지역당 1~5개, 전체 9~10개 값뿐입니다' }], 9.05, 6.03, 3.6, 0.75, { fontSize: 11, color: '333333', valign: 'middle' });
  src(s, '값 = 지역 평균이 전체 필지 평균에서 표준편차(σ) 몇 개만큼 떨어져 있는지 · 학습 필지 28,815개');
  s.addNotes('지역 평균을 전체 평균과 비교해 표준편차 단위로 나타냈습니다. 창죽과 하장은 경사와 고도가 높은 땅이 험한 곳이고, 대관령·진부·왕산은 강우 지표가 높은 비가 센 곳입니다. 다만 강우 값은 관측소 값의 반복이라 지역을 그대로 따라갑니다. 이 점 때문에 다음 전처리에서 강우 가중치를 낮췄습니다.');
}
/* ============ S8. 제외한 자료 ============ */
{
  const s = slide(1, '변수 선정', '검토했지만 제외한 자료', ['확인되지 않은 값은 ', { h: '분석에 넣지 않았습니다' }]);
  const d = [['하천거리', '1개 피처', '필지에서 하천 선망까지의 거리', '원본 좌표계 표기(EPSG:5186)와 작업 해석(5187)이 충돌하고, 위치의 외부 검증을 마치지 못함', '좌표계 미검증'],
    ['배추 생육 피복 가정', '2개 피처', '정식 후 배추가 땅을 덮는 정도 × 강우 겹침', '실제 필지의 작물·정식일 관측이 없는 분석자 가정 곡선. 실측 피복률이 아님', '실측 아님'],
    ['토양도·배수등급', '추가 실험', '토성·배수 등 토양 속성 (왕산면 1,299필지 비교)', '넣어도 유형이 바뀐 필지가 토양도 4.16%(54필지), 배수등급 1.23%(16필지)뿐. ARI 0.897, 0.970', '추가 효과 작음']];
  const w = 3.95, gx = 0.24;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.1);
    pill(s, r[4], x + 0.25, 2.22, 1.75, { fill: i === 2 ? G.g : G.brown, fontSize: 12.5 });
    T(s, r[0], x + 0.25, 2.78, w - 0.5, 0.4, { fontSize: 20, bold: true });
    T(s, r[1], x + 0.25, 3.2, w - 0.5, 0.26, { fontSize: 12, color: G.sub });
    T(s, '무엇을 보려 했나', x + 0.25, 3.62, w - 0.5, 0.24, { fontSize: 11, bold: true, color: G.g });
    T(s, r[2], x + 0.25, 3.88, w - 0.5, 0.5, { fontSize: 12.5 });
    T(s, '제외 이유', x + 0.25, 4.5, w - 0.5, 0.24, { fontSize: 11, bold: true, color: i === 2 ? G.g : G.brown });
    T(s, r[3], x + 0.25, 4.76, w - 0.5, 1.2, { fontSize: 12.5, color: '333333' });
  });
  band(s, [{ text: '후보 6개 인자  →  ', options: {} }, { text: '검증 가능한 4개 인자, 41개 피처로 확정', options: { bold: true } }], 0.5, 6.3, W - 1, 0.62, { fontSize: 18 });
  src(s, '토양도 실험: 왕산면 동일 1,299필지 · k=4 · 번호를 맞춘 뒤 바뀐 필지 비율 · 토양 API 속성은 왕산면 1,129필지에만 연결됨', 7.02);
  s.addNotes('하천거리는 원본 좌표계 표기가 충돌해 위치를 검증하지 못했고, 배추 생육 피복은 실측이 아니라 가정이었습니다. 토양도는 왕산면에서 따로 실험했는데, 넣어도 유형이 바뀐 필지가 4% 정도에 그쳐 이번 분석에서는 제외했습니다. 토양정보 자체가 쓸모없다는 뜻은 아니며 자료가 확보되면 다시 검토할 수 있습니다.');
}
/* ============ S9. 전처리 ① 인자별 처리 ============ */
{
  const s = slide(1, '전처리 ① 인자별 처리', '데이터 전처리 ① 인자별 처리와 제거', ['각 인자를 어떻게 다듬고 ', { h: '무엇을 뺐는지' }, ' 정리했습니다']);
  const H = (t) => hd(t, { fontSize: 12.5 });
  const C = (t, o = {}) => cell(t, Object.assign({ align: 'left', fontSize: 12 }, o));
  const rows = [[H('구분'), H('처리 방법'), H('제거 · 제외')],
    [C('공통', { bold: true, align: 'center' }), C('연결키를 문자열로 유지하고 조인 전후 행 수·중복·결측·무한대를 점검'), C('LS·고도가 비어 있는 49필지 학습 제외 (0·평균으로 채우지 않고 사유와 함께 보존)')],
    [C('토지피복 31', { bold: true, align: 'center' }), C('구성비 합을 1로 맞춘 뒤 평균만 빼기 (희귀 피복이 과하게 커지지 않도록 열별 표준편차로 나누지 않음)'), C('모든 필지가 0인 2열 (공동주거시설·운동장) 제거 → 29열')],
    [C('지형 2', { bold: true, align: 'center' }), C('LS는 ln(1+x) 변환, 고도는 원값 → 평균 0·표준편차 1로 표준화'), C('—', { align: 'center' })],
    [C('형상 3', { bold: true, align: 'center' }), C('면적·장단축비는 ln(1+x) 변환, 형상 조밀도는 원값 → 표준화'), C('—', { align: 'center' })],
    [C('강우 5', { bold: true, align: 'center' }), C('R·최대 1시간·일 최대는 ln(1+x), 비중 2개는 원값 → 표준화'), C('결측일을 0으로 채우지 않음 (1,440분이 모두 관측된 날만 일 최대 계산)')],
    [C('이상치', { bold: true, align: 'center' }), C('로그 기준 ±3σ 밖 필지 확인: 장단축비 256 · 면적 39 · LS 0 (합 295필지, 1.0%)'), C('삭제·절단하지 않음 (실제 필지 특성일 수 있음)')]];
  s.addTable(rows, { x: 0.5, y: 2.0, w: 8.75, colW: [1.35, 4.3, 3.1], rowH: [0.44, 0.66, 0.74, 0.56, 0.56, 0.66, 0.66], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.1, 0, 0.1], objectName: 'table-prep' });
  card(s, 9.5, 2.0, 3.33, 4.28);
  T(s, '처리 결과', 9.75, 2.2, 2.9, 0.3, { fontSize: 15, bold: true });
  const st = [['28,864', '전체 필지'], ['28,815', '학습 필지 (결측 49 제외)'], ['41 → 39', '피처 → 입력 차원 (상수 2열 제거)']];
  st.forEach((r, i) => { const y = 2.65 + i * 1.18; T(s, r[0], 9.75, y, 2.9, 0.55, { fontSize: 30, bold: true, color: G.dk }); T(s, r[1], 9.75, y + 0.57, 2.9, 0.3, { fontSize: 12, color: '555555' }); });
  band(s, [{ text: '변환 계수(평균·표준편차·묶음 분산)를 저장해, 새 필지에도 ', options: {} }, { text: '같은 기준으로 변환', options: { bold: true } }], 0.5, 6.42, W - 1, 0.55, { fontSize: 15, fill: G.dk });
  s.addNotes('인자별로 처리한 방법과 뺀 것을 정리했습니다. 결측 49필지는 채우지 않고 제외했고, 값이 모두 0인 피복 2열을 지워 41피처가 39차원 입력이 되었습니다. 이상치는 확인만 하고 삭제하지 않았습니다. 변환 계수는 저장해 두어 새 필지도 같은 기준으로 변환합니다.');
}
/* ============ S10. 전처리 ② 로그 ============ */
{
  const s = slide(1, '전처리 ② 로그 변환', '데이터 전처리 ② 분포 다듬기', ['한쪽으로 치우친 값은 ', { h: '로그 변환' }, '으로 폈습니다']);
  card(s, 0.5, 2.0, 8.5, 4.85);
  s.addImage({ path: 'img_hist.png', x: 0.65, y: 2.25, w: 8.2, h: 3.553, altText: 'LS, 필지 면적, 장단축비의 로그 변환 전후 히스토그램', objectName: 'img-hist' });
  T(s, '위: 원자료 (오른쪽 꼬리는 상한에서 잘라 표시) · 아래: ln(1+x) 변환 후', 0.8, 6.25, 7.9, 0.3, { fontSize: 11, color: G.sub });
  card(s, 9.25, 2.0, 3.58, 4.85);
  pill(s, '왜 로그인가', 9.5, 2.22, 1.5);
  T(s, 'K-means는 거리로 묶습니다. 대부분 작고 일부만 매우 큰 값은 극단값 몇 개가 거리를 좌우합니다', 9.5, 2.75, 3.1, 0.95, { fontSize: 12.5, color: '333333' });
  T(s, '왜도 변화 (0에 가까울수록 대칭)', 9.5, 3.78, 3.1, 0.28, { fontSize: 11.5, bold: true, color: G.g });
  const h2 = (t, al = 'center') => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: G.g }, align: al, fontSize: 11.5, fontFace: F } });
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 12, fontFace: F, align: 'center', color: '333333' }, o) });
  s.addTable([[h2('피처', 'left'), h2('변환 전'), h2('변환 후')],
    [c('LS', { align: 'left' }), c('+1.77'), c('−0.17', { bold: true, color: G.dk })], [c('필지 면적', { align: 'left' }), c('+3.62'), c('−0.31', { bold: true, color: G.dk })],
    [c('장단축비', { align: 'left' }), c('+2.49'), c('+0.93', { bold: true, color: G.dk })], [c('최대 1시간 강수', { align: 'left' }), c('+2.05'), c('+1.96', { color: G.sub })]],
    { x: 9.5, y: 4.1, w: 3.1, colW: [1.4, 0.85, 0.85], rowH: 0.36, border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', objectName: 'table-skew' });
  T(s, '강우는 관측소 값이 9~10개뿐이라 로그 변환 효과가 작습니다. 적용 6개: LS·면적·장단축비·연간 R·최대 1시간·일 최대', 9.5, 6.0, 3.1, 0.75, { fontSize: 10.5, color: G.sub });
  s.addNotes('LS, 면적, 장단축비는 오른쪽 꼬리가 긴 분포입니다. ln(1+x) 변환으로 왜도가 크게 줄었습니다. 강우는 관측소 값이 몇 개뿐이라 변환해도 모양이 거의 그대로입니다.');
}
/* ============ S11. 전처리 ③ 가중치 ============ */
{
  const s = slide(1, '전처리 ③ 묶음 가중치', '데이터 전처리 ③ 묶음 가중치 조정', ['강우가 아니라 ', { h: '지형과 밭 조건' }, '으로 나뉘게 했습니다']);
  card(s, 0.5, 2.0, 7.9, 4.85);
  T(s, '유형을 가른 몫 (모델 공간에서 묶음별 중심 차이 비중)', 0.8, 2.17, 7.3, 0.3, { fontSize: 15, bold: true });
  const GC = { 지형: '3D6B45', 피복: '9CC48A', 형상: 'C9C9C9', 강우: '5B8DB8' };
  const bars = [['기존 (가중치 모두 1)', [['피복', 45.8], ['강우', 31.8], ['지형', 17.1], ['형상', 5.3]]], ['최종 (조정 가중치)', [['지형', 67.6], ['피복', 30.8], ['형상', 1.0], ['강우', 0.6]]]];
  const bx = 0.8, bw = 7.3;
  bars.forEach(([lab, segs], i) => {
    const y = 2.95 + i * 1.25;
    T(s, lab, bx, y - 0.33, 4, 0.28, { fontSize: 13, bold: true, color: i ? G.dk : '555555' });
    let x = bx;
    segs.forEach(([g, v]) => {
      const w = bw * v / 100; rect(s, x, y, Math.max(w - 0.03, 0.02), 0.62, GC[g]);
      if (w > 0.75) T(s, `${g} ${v}%`, x, y, w, 0.62, { fontSize: 12, bold: true, color: g === '피복' || g === '형상' ? '1F2F1C' : 'FFFFFF', align: 'center', valign: 'middle' });
      x += w;
    });
    T(s, i === 1 ? '형상 1.0% · 강우 0.6%' : '형상 5.3%', bx + bw - 1.9, y + 0.66, 1.9, 0.25, { fontSize: 10.5, color: G.sub, align: 'right' });
  });
  T(s, '묶음 가중치', 0.8, 5.35, 3, 0.28, { fontSize: 13, bold: true });
  const wts = [['피복', '1 → 0.75'], ['지형', '1 → 1.5'], ['형상', '1 → 0.5'], ['강우', '1 → 0.25']];
  wts.forEach((r, i) => { const x = 0.8 + i * 1.85; card(s, x, 5.7, 1.7, 0.92, { fill: G.tint, noShadow: true, r: 0.12 }); T(s, r[0], x, 5.78, 1.7, 0.3, { fontSize: 12, color: '555555', align: 'center' }); T(s, r[1], x, 6.1, 1.7, 0.4, { fontSize: 17, bold: true, color: r[0] === '지형' ? G.dk : '333333', align: 'center' }); });
  card(s, 8.65, 2.0, 4.18, 4.85);
  pill(s, '왜 조정했나', 8.9, 2.22, 1.5);
  T(s, '강우 5피처는 관측소 값의 반복', 8.9, 2.78, 3.7, 0.3, { fontSize: 14, bold: true, color: G.dk });
  T(s, '같은 관측소에 배정된 필지는 모두 같은 값이라, 강우 비중이 크면 유형이 사실상 \'어느 관측소인가\'로 갈립니다', 8.9, 3.1, 3.7, 0.8, { fontSize: 12, color: '444444' });
  T(s, '일 최대 강우 하나만 빼 봤을 때 유형 유지율', 8.9, 4.05, 3.7, 0.3, { fontSize: 14, bold: true, color: G.dk });
  T(s, '63.9%', 8.9, 4.45, 1.7, 0.6, { fontSize: 30, bold: true, color: G.brown });
  T(s, '→', 10.45, 4.5, 0.5, 0.5, { fontSize: 24, color: G.mute, align: 'center' });
  T(s, '98.0%', 10.95, 4.45, 1.8, 0.6, { fontSize: 30, bold: true, color: G.dk });
  T(s, '기존 모델', 8.9, 5.05, 1.7, 0.25, { fontSize: 11, color: G.sub }); T(s, '조정 후', 10.95, 5.05, 1.7, 0.25, { fontSize: 11, color: G.sub });
  T(s, '강우는 참고로 남기되, 유형은 실제 땅의 조건(경사·고도·밭 정리 여부)으로 나뉘게 했습니다', 8.9, 5.55, 3.7, 0.9, { fontSize: 12, color: '333333' });
  src(s, '묶음 조정: 묶음 총분산의 제곱근으로 나눈 뒤 √가중치를 곱함 · 7개 가중치 후보 중 안정성 검사(다음 장)로 선정');
  s.addNotes('처음에는 모든 묶음에 같은 가중치를 줬는데, 관측소 값의 반복인 강우가 유형 구분의 3분의 1을 차지했습니다. 일 최대 강우 하나만 빼도 36%의 필지가 유형이 바뀔 정도였습니다. 그래서 강우 가중치를 0.25로 낮추고 지형을 1.5로 높였습니다. 조정 후에는 지형과 밭 조건이 유형을 가르고, 같은 실험에서 98%가 유형을 유지했습니다.');
}
/* ============ S12. 전처리 ④ 안정성 ============ */
{
  const s = slide(1, '전처리 ④ 모델 안정성', '데이터 전처리 ④ 안정성 검증', ['여러 조건을 바꿔도 ', { h: '유형이 유지되는 설정' }, '을 골랐습니다']);
  card(s, 0.5, 2.0, 3.5, 4.85);
  pill(s, '시작값 반복 횟수', 0.75, 2.22, 1.9);
  T(s, 'K-means는 시작점에 따라 결과가 달라질 수 있어, 시작점을 바꿔 여러 번 돌린 뒤 가장 잘 묶인 결과를 고릅니다', 0.75, 2.75, 3.0, 1.0, { fontSize: 12, color: '444444' });
  T(s, '10회', 0.75, 3.9, 1.4, 0.4, { fontSize: 22, bold: true, color: G.brown }); T(s, 'ARI 0.797', 0.75, 4.3, 1.4, 0.3, { fontSize: 13, color: G.brown });
  T(s, '→', 1.95, 3.95, 0.4, 0.5, { fontSize: 22, color: G.mute, align: 'center' });
  T(s, '30회', 2.35, 3.9, 1.4, 0.4, { fontSize: 22, bold: true, color: G.dk }); T(s, 'ARI 0.998', 2.35, 4.3, 1.4, 0.3, { fontSize: 13, bold: true, color: G.dk });
  T(s, '서로 다른 시작값 3개로 만든 결과끼리의 최저 일치도. 60회로 늘려도 0.998로 거의 같아 30회를 사용', 0.75, 4.8, 3.0, 0.95, { fontSize: 11, color: G.sub });
  card(s, 0.75, 5.85, 3.0, 0.78, { fill: G.tint, noShadow: true, r: 0.12 });
  T(s, 'ARI: 두 결과가 같은 정도 (1 = 완전히 같음). 정확도가 아님', 0.9, 5.9, 2.75, 0.68, { fontSize: 11, color: G.dk, valign: 'middle' });
  card(s, 4.25, 2.0, 8.58, 4.85);
  T(s, '7개 가중치 후보의 검사별 최저 ARI', 4.5, 2.17, 6, 0.3, { fontSize: 15, bold: true });
  const C = (t, o = {}) => cell(t, Object.assign({ fontSize: 11.5 }, o));
  const cand = [['기존 (모두 1)', '1 / 1 / 1 / 1', 0.998, 0.925, 0.242], ['강우 절반', '1 / 1 / 1 / 0.5', 0.987, 0.977, 0.324], ['강우 1/4', '1 / 1 / 1 / 0.25', 0.982, 0.949, 0.327], ['지형 강조', '1 / 1.5 / 1 / 0.5', 0.999, 0.561, 0.264],
    ['형상 축소', '1 / 1 / 0.5 / 0.5', 0.725, 0.721, 0.429], ['밭·지형 중심 (선정)', '0.75 / 1.5 / 0.5 / 0.25', 0.972, 0.927, 0.572], ['피복 강조', '1.5 / 1 / 1 / 0.5', 0.989, 0.945, 0.553]];
  const rows = [[hd('후보'), hd('가중치 (피복/지형/형상/강우)'), hd('초기화 변경'), hd('표본 변경'), hd('가중치 ±25%'), hd('최저')]];
  cand.forEach(r => {
    const sel = r[0].includes('선정'); const mn = Math.min(r[2], r[3], r[4]);
    const ac = (v) => { const [f, t] = seqFill(v, 0.2, 1.0); return C(v.toFixed(3), { fill: { color: f }, color: t, bold: sel }); };
    rows.push([C(r[0], { bold: sel, align: 'left', color: sel ? G.dk : '333333', fill: { color: sel ? G.pale : 'FFFFFF' } }), C(r[1], { fill: { color: sel ? G.pale : 'FFFFFF' }, bold: sel }), ac(r[2]), ac(r[3]), ac(r[4]),
      C(mn.toFixed(3), { bold: true, color: sel ? G.dk : '555555', fill: { color: sel ? G.pale : 'FFFFFF' } })]);
  });
  s.addTable(rows, { x: 4.45, y: 2.55, w: 8.18, colW: [1.85, 2.08, 1.08, 1.08, 1.08, 1.01], rowH: [0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.5, 0.44], border: { type: 'solid', color: 'FFFFFF', pt: 1.5 }, valign: 'middle', objectName: 'table-stability' });
  T(s, '표본 변경: 지역마다 80%만 뽑아 전처리부터 다시 학습 → 나머지 20%의 유형 비교 (3회)  ·  가중치 ±25%: 묶음 하나씩 가중치를 바꾼 8가지 조건', 4.5, 6.2, 8.1, 0.55, { fontSize: 10.5, color: G.sub });
  src(s, '선정 기준: 세 검사 최저 ARI가 가장 높은 후보 · 선정안도 지형 가중치를 25% 낮추면 0.572까지 떨어지는 한계가 남음');
  s.addNotes('먼저 시작값 반복을 10회에서 30회로 늘려 결과가 흔들리지 않게 했습니다. 그다음 7개 가중치 후보를 세 가지 방식으로 흔들어 보고, 가장 나쁜 경우의 일치도가 가장 높은 밭·지형 중심 설정을 골랐습니다. 다만 이 설정도 지형 가중치를 낮추면 일치도가 0.57까지 떨어져, 가중치에 무관한 자연스러운 4유형이라고 단정하지는 않습니다.');
}

divider('03', '데이터 분석', ['분석 기법', '군집 수 선정', '군집 분석 결과', '결과 신뢰도 점검']);

/* ============ S13. K-means ============ */
{
  const s = slide(2, '분석 기법', '분석 기법: K-means 군집분석', ['가까운 필지끼리 묶는 ', { h: 'K-means' }, '로 유형을 만들었습니다']);
  card(s, 0.5, 2.0, W - 1, 3.42);
  s.addImage({ path: 'img_kmeans.png', x: 0.75, y: 2.12, w: 11.83, h: 3.276, altText: 'K-means 4단계 원리 예시', objectName: 'img-kmeans' });
  const st = [['k = 4', '최종 해석용 유형 수', '군집 수 선정 결과 (다음 장)'], ['39차원', '필지 하나를 설명하는 값 39개', '41피처 중 상수 2열 제외'], ['n_init = 30', '시작점을 30번 바꿔 돌림', '그중 가장 잘 묶인 결과 선택'], ['seed = 19', '시작점을 정하는 고정 번호', '같은 결과를 다시 만들 수 있음']];
  const w = 2.9, gx = 0.244;
  st.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 5.6, w, 1.3);
    T(s, r[0], x + 0.22, 5.72, w - 0.44, 0.45, { fontSize: 22, bold: true, color: G.dk });
    T(s, r[1], x + 0.22, 6.17, w - 0.44, 0.3, { fontSize: 12.5, bold: true });
    T(s, r[2], x + 0.22, 6.47, w - 0.44, 0.3, { fontSize: 11, color: G.sub });
  });
  s.addNotes('K-means는 정답 없이 비슷한 필지끼리 묶는 방법입니다. 중심 k개를 놓고, 각 필지를 가장 가까운 중심에 배정하고, 그룹 평균으로 중심을 옮기는 과정을 바뀌지 않을 때까지 반복합니다. 저희는 39차원 입력으로 k=4, 시작점 30회 반복, seed 19로 학습했습니다.');
}
/* ============ S14. 군집 수 선정 ============ */
{
  const s = slide(2, '군집 수 선정', '군집 수 선정', ['지표와 해석을 함께 보고 ', { h: 'k = 4' }, '를 선택했습니다']);
  const ks = ['2', '3', '4', '5', '6', '7', '8'];
  card(s, 0.5, 2.0, 4.15, 4.85); card(s, 4.85, 2.0, 4.15, 4.85);
  T(s, '군집 내 거리 제곱합 (천)', 0.75, 2.17, 3.7, 0.3, { fontSize: 14, bold: true });
  T(s, 'k가 커질수록 줄지만 뚜렷하게 꺾이는 지점은 없음', 0.75, 2.47, 3.7, 0.25, { fontSize: 11, color: G.sub });
  T(s, '실루엣 계수', 5.1, 2.17, 3.7, 0.3, { fontSize: 14, bold: true });
  T(s, 'k=2가 0.21로 가장 높고, k=3~8은 0.17~0.18로 비슷', 5.1, 2.47, 3.7, 0.25, { fontSize: 11, color: G.sub });
  const lo = Object.assign({}, chartBase, { lineSize: 2.25, lineDataSymbolSize: 8, showLegend: false, showValue: true, dataLabelPosition: 't', dataLabelFontSize: 10, catAxisTitle: '군집 수 k', showCatAxisTitle: true, catAxisTitleFontSize: 10, catAxisTitleFontFace: F, catAxisTitleColor: '777777' });
  s.addChart(pres.charts.LINE, [{ name: '거리 제곱합(천)', labels: ks, values: [69.3, 60.5, 53.6, 49.0, 45.6, 42.9, 40.2] }], Object.assign({}, lo, { x: 0.6, y: 2.8, w: 3.95, h: 3.95, chartColors: [G.g], valAxisMinVal: 30, valAxisMaxVal: 75, dataLabelFormatCode: '0.0', objectName: 'chart-inertia' }));
  s.addChart(pres.charts.LINE, [{ name: '실루엣', labels: ks, values: [0.211, 0.173, 0.172, 0.170, 0.182, 0.182, 0.177] }], Object.assign({}, lo, { x: 4.95, y: 2.8, w: 3.95, h: 3.95, chartColors: [G.g], valAxisMinVal: 0, valAxisMaxVal: 0.25, dataLabelFormatCode: '0.00', valAxisLabelFormatCode: '0.00', objectName: 'chart-sil' }));
  card(s, 9.2, 2.0, 3.63, 4.85);
  pill(s, '왜 4개인가', 9.45, 2.22, 1.5);
  const why = [['지표만으로는 정해지지 않음', '실루엣 최고는 k=2지만, 2개로는 밭 조건 차이를 설명하기에 너무 거침'], ['해석·질문 연결', '유형마다 다른 확인 질문과 대책을 붙일 수 있는 수준으로 4개를 유지 (자동 후보와 구분)'], ['모든 유형이 충분히 큼', '가장 작은 유형도 14.4% (4,143필지)']];
  why.forEach((r, i) => { const y = 2.78 + [0, 1.15, 2.45][i]; T(s, r[0], 9.45, y, 3.15, 0.3, { fontSize: 13.5, bold: true, color: G.dk }); T(s, r[1], 9.45, y + 0.32, 3.15, 0.85, { fontSize: 11.5, color: '444444' }); });
  src(s, '39차원 변환 입력으로 k마다 다시 실행(시작값 10회, seed 19) · 실루엣은 6,000필지 표본으로 계산');
  s.addNotes('군집 수는 지표만으로 딱 정해지지 않았습니다. 실루엣은 2개에서 가장 높지만 2개로는 너무 거칠고, 3개 이상은 서로 비슷합니다. 유형마다 다른 질문과 대책을 연결하려는 목적에 맞춰 4개를 최종 해석 모델로 유지했습니다.');
}
/* ============ S15. 군집 결과 ============ */
{
  const s = slide(2, '군집 분석 결과', '군집 분석 결과', ['28,815개 필지가 ', { h: '4개 유형' }, '으로 나뉘었습니다']);
  card(s, 0.5, 2.0, 6.75, 4.85);
  s.addImage({ path: 'img_pca.png', x: 0.85, y: 2.1, w: 5.75, h: 4.47, altText: '주성분 2개로 축약한 필지 산점도, 4개 유형 색상 구분', objectName: 'img-pca' });
  T(s, '39차원을 2차원으로 줄여 본 그림 (9,000필지 표본) · 큰 점은 유형 중심', 0.8, 6.52, 6.2, 0.25, { fontSize: 10.5, color: G.sub });
  const cnt = [[4143, '14.4%', '경지정리된 밭 92% · LS 2.0'], [6492, '22.5%', '고도 519m · 면적 1,105㎡ · LS 11.4'], [9005, '31.3%', '고도 727m · LS 13.4'], [9175, '31.8%', '미정리 밭 93% · LS 3.0']];
  cnt.forEach((r, i) => {
    const y = 2.0 + i * 1.235;
    card(s, 7.5, y, 5.33, 1.1);
    dot(s, i + 1, 7.72, y + 0.25, 0.6, CL[i], { fontSize: 18 });
    T(s, CN[i], 8.5, y + 0.2, 2.75, 0.32, { fontSize: 16, bold: true });
    T(s, r[2], 8.5, y + 0.57, 2.85, 0.3, { fontSize: 11.5, color: '555555' });
    T(s, r[0].toLocaleString('en-US'), 11.1, y + 0.17, 1.55, 0.4, { fontSize: 20, bold: true, color: G.dk, align: 'right' });
    T(s, '필지 · ' + r[1], 11.1, y + 0.6, 1.55, 0.25, { fontSize: 11, color: G.sub, align: 'right' });
  });
  src(s, '두 주성분이 설명하는 분산 53% · 값은 유형별 중앙값 · 유형 번호는 위험 순서가 아닙니다');
  s.addNotes('4개 유형입니다. 1번은 경지정리된 밭, 4번은 경지정리 안 된 밭으로 둘 다 LS가 낮습니다. 2번은 낮은 곳의 작은 필지, 3번은 높은 곳의 필지로 둘 다 LS가 높습니다. 번호는 위험 순서가 아니라 이름표입니다.');
}
/* ============ S16. 지역별 유형 구성 ============ */
{
  const s = slide(2, '지역별 유형 구성', '지역별 유형 구성', ['같은 지역 안에서도 ', { h: '유형이 섞여' }, ' 있습니다']);
  card(s, 0.5, 2.0, 8.3, 4.85);
  const reg = ['태백 창죽동', '삼척 하장면', '평창 대관령면', '평창 진부면', '강릉 왕산면', '정선 임계면', '정선 여량면'];
  const v = [[13, 263, 334, 1013, 643, 1429, 448], [0, 101, 47, 1725, 1425, 1800, 1394], [380, 2656, 1462, 1993, 1198, 950, 366], [15, 795, 2052, 2916, 1039, 1863, 495]];
  s.addChart(pres.charts.BAR, v.map((x, i) => ({ name: `${i + 1}번 ${CN[i]}`, labels: reg, values: x })), Object.assign({}, chartBase, { x: 0.65, y: 2.15, w: 8.0, h: 4.6, barDir: 'bar', barGrouping: 'percentStacked', chartColors: CL,
    catAxisOrientation: 'maxMin', showLegend: true, legendPos: 'b', legendFontSize: 11, legendColor: '444444', valAxisLabelFormatCode: '0%', barGapWidthPct: 45, objectName: 'chart-region-type' }));
  const ins = [['고지대는 3번 중심', '창죽 93%, 하장 70%가 고지대·고LS형'], ['대관령·진부는 4번이 최다', '미정리 밭·저LS형이 각각 53%, 38%'], ['여량은 2번이 절반', '저지대 소필지·고LS형 52%'], ['임계·왕산·진부는 혼합', '네 유형이 고르게 섞여, 지역 단위 일괄 대책으로는 맞추기 어려움']];
  ins.forEach((r, i) => { const y = 2.0 + i * 1.23; card(s, 9.05, y, 3.78, 1.1); T(s, r[0], 9.28, y + 0.17, 3.35, 0.3, { fontSize: 14.5, bold: true, color: G.dk }); T(s, r[1], 9.28, y + 0.52, 3.35, 0.55, { fontSize: 11.5, color: '444444' }); });
  src(s, '1번(경지정리 밭)은 임계 1,429 · 진부 1,013필지 등 여러 지역에 흩어져 있음 · 강우 가중치가 작아 지역 구분이 곧 강우 구분은 아님');
  s.addNotes('고도가 높은 창죽과 하장은 3번 유형이 대부분이고, 대관령과 진부는 4번, 여량은 2번이 많습니다. 하지만 임계, 왕산, 진부처럼 네 유형이 고르게 섞인 지역도 있어 지역 단위가 아니라 필지 단위로 봐야 한다는 점을 보여줍니다.');
}
/* ============ S17. 유형별 특성 분포 ============ */
function boxRow(s, list) {
  const w = 2.9, gx = 0.244, iw = 2.7, ih = iw * 4.0 / 4.3;
  list.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.75);
    s.addImage({ path: r[0], x: x + 0.1, y: 2.12, w: iw, h: ih, altText: r[1] + ' 유형별 박스플롯', objectName: nm('img-box') });
    rect(s, x + 0.25, 4.75, w - 0.5, 0.012, 'E3E3E3');
    T(s, r[2], x + 0.22, 4.88, w - 0.44, 0.62, { fontSize: 14, bold: true, color: G.dk });
    T(s, r[3], x + 0.22, 5.55, w - 0.44, 1.1, { fontSize: 11.5, color: '444444' });
  });
}
{
  const s = slide(2, '유형별 특성 분포', '유형별 특성 분포', ['유형을 가르는 ', { h: '핵심 피처 4개' }, '의 분포입니다']);
  boxRow(s, [['box_ls.png', 'LS', '2·3번은 높고, 1·4번은 낮다', '중앙값 2번 11.4, 3번 13.4 vs 1번 2.0, 4번 3.0. 1번과 4번의 차이는 작음'],
    ['box_elev.png', '평균 고도', '3번이 가장 높고, 2번이 가장 낮다', '3번 727m, 4번 613m, 1번 545m, 2번 519m. 2번과 3번을 가르는 핵심'],
    ['box_221.png', '경지정리된 밭', '1번만 경지정리된 밭', '1번 중앙값 92%, 나머지 유형은 0%. 1번과 4번을 가르는 가장 뚜렷한 기준'],
    ['box_area.png', '필지 면적', '2번 필지가 가장 작다', '2번 1,105㎡, 3번 2,414㎡. 다만 유형 간 차이 자체는 작음 (η² 0.04)']]);
  src(s, '상자 = 가운데 50% 필지 · 흰 선 = 중앙값(옆 숫자) · 수염 = 1.5×IQR 이내 · 이상점은 표시만 생략하고 계산에는 포함', 6.95);
  s.addNotes('핵심 피처 4개의 유형별 분포입니다. LS와 고도로 2·3번이, 경지정리 여부로 1·4번이 갈립니다. 면적은 2번이 가장 작지만 차이 자체는 크지 않습니다.');
}
/* ============ S18. 보조 피처 ============ */
{
  const s = slide(2, '보조 피처', '보조 피처', ['세부 특성으로 ', { h: '유형의 배경' }, '을 보충합니다']);
  boxRow(s, [['box_222.png', '경지정리 안 된 밭', '2·3·4번은 대부분 미정리 밭', '중앙값 2번 91%, 3번 91%, 4번 93%. 1번만 0%로 경지정리 밭과 정반대'],
    ['box_r.png', '연간 R', '4번이 높지만 관측소 차이', '4번 중앙값 2,226 vs 1번 1,482. 대관령·진부 관측소 값이 많이 들어간 결과로, 유형 구분 기여는 작음'],
    ['box_summer.png', '6~9월 R 비중', '4번은 여름에 비가 몰림', '4번 중앙값 85%, 나머지 77%. 피복 공백과 장마철이 겹치는지 확인 필요'],
    ['box_elong.png', '장단축비', '모양 차이는 거의 없다', '중앙값 1.89~2.09로 유형 간 차이가 작음 (η² 0.003). 설치 공간 판단의 보조 정보']]);
  src(s, '강우 피처는 가중치 0.25로 낮춰 유형 구분 기여가 0.6%뿐 · 해석은 참고용', 6.95);
  s.addNotes('보조 피처입니다. 4번은 강우가 높고 여름에 몰리지만, 이는 대관령·진부 관측소 값의 영향이고 강우는 유형 구분에 거의 기여하지 않습니다. 형상 차이도 작아 대책을 고를 때 설치 공간을 판단하는 보조 정보로만 씁니다.');
}
/* ============ S19. 군집 구분 기여도 ============ */
{
  const s = slide(2, '군집 구분 기여도', '군집 구분 기여도', ['유형을 가른 핵심은 ', { h: '밭 정리 여부 · 고도 · LS' }, '였습니다']);
  card(s, 0.5, 2.0, 7.9, 4.85);
  T(s, '피처별 유형 간 차이 크기 (η², 상위 10개)', 0.8, 2.18, 7, 0.3, { fontSize: 15, bold: true });
  s.addChart(pres.charts.BAR, [{ name: 'η²', labels: ['경지정리 안 된 밭', '경지정리된 밭', '평균 고도', 'LS', '경지정리된 논', '6~9월 R 비중 †', '필지 면적', '일 최대 강우 †', '연간 R †', '최대 1시간 강우 †'], values: [0.640, 0.565, 0.438, 0.418, 0.055, 0.043, 0.038, 0.033, 0.028, 0.027] }],
    Object.assign({}, chartBase, { x: 0.65, y: 2.5, w: 7.6, h: 4.25, barDir: 'bar', chartColors: [G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.000', catAxisOrientation: 'maxMin',
      valAxisHidden: true, valAxisMaxVal: 0.75, valGridLine: { style: 'none' }, barGapWidthPct: 45, showLegend: false, objectName: 'chart-eta' }));
  card(s, 8.65, 2.0, 4.18, 2.95);
  T(s, '묶음별로 보면 (모델 공간)', 8.9, 2.18, 3.7, 0.3, { fontSize: 14, bold: true });
  const gs = [['지형', 67.6, '3D6B45'], ['피복', 30.8, '9CC48A'], ['형상', 1.0, 'C9C9C9'], ['강우', 0.6, '5B8DB8']];
  gs.forEach((r, i) => { const y = 2.65 + i * 0.55; T(s, r[0], 8.9, y, 0.7, 0.32, { fontSize: 13, bold: true, valign: 'middle' }); rect(s, 9.6, y + 0.05, Math.max(2.4 * r[1] / 67.6, 0.04), 0.24, r[2], { round: 0.04 }); T(s, r[1].toFixed(1) + '%', 9.6 + Math.max(2.4 * r[1] / 67.6, 0.04) + 0.08, y, 0.8, 0.32, { fontSize: 12.5, bold: true, color: '333333', valign: 'middle' }); });
  card(s, 8.65, 5.15, 4.18, 1.7);
  pill(s, '해석할 때 주의', 8.9, 5.32, 1.7, { fill: G.brown });
  T(s, '유형을 \'구분\'한 정도이지 토양유실 원인의 크기가 아닙니다. 같은 피처로 군집을 만든 뒤 비교했으므로 차이가 크게 나오는 것이 당연합니다', 8.9, 5.78, 3.7, 1.0, { fontSize: 11.5, color: '333333' });
  src(s, 'η² = 유형 간 제곱합 ÷ 전체 제곱합 (원단위 일원분산분석) · † 강우는 관측소 반복 배정 값 · 묶음별 몫은 가중치 적용 공간의 중심 차이 비중');
  s.addNotes('피처마다 전체 차이 중 유형 차이로 설명되는 비율을 계산했습니다. 밭이 경지정리됐는지, 고도, LS가 유형을 가장 뚜렷하게 갈랐고, 강우 피처는 0.03 정도로 작습니다. 묶음으로 보면 지형이 68%, 피복이 31%를 차지합니다. 이 값은 원인의 크기가 아니라 구분 기여도입니다.');
}
/* ============ S20. 유형 비교표 ============ */
{
  const s = slide(2, '유형 비교표', '유형별 특성 요약', ['중앙값으로 정리한 ', { h: '4개 유형의 프로파일' }]);
  const H = (t, f) => hd(t, { fill: { color: f || G.dk }, fontSize: 12.5 });
  const C = (t, hi) => cell(t, { fontSize: 14, color: hi ? G.dk : '333333', bold: !!hi, fill: { color: hi ? G.pale : 'FFFFFF' } });
  const L = (t) => cell(t, { align: 'left', fontSize: 13, bold: true });
  const I = (t) => cell(t, { align: 'left', fontSize: 12, color: '444444' });
  const rows = [[H('순위'), H('피처'), H('1번\n경지정리 밭·저LS', CL[0]), H('2번\n저지대 소필지·고LS', CL[1]), H('3번\n고지대·고LS', CL[2]), H('4번\n미정리 밭·저LS', CL[3]), H('해석')],
    [cell('1'), L('경지정리 안 된 밭 (%)'), C('0', 1), C('90.9'), C('90.8'), C('93.2'), I('1번만 거의 없음')],
    [cell('2'), L('경지정리된 밭 (%)'), C('91.6', 1), C('0'), C('0'), C('0'), I('1번만 경지정리 밭')],
    [cell('3'), L('평균 고도 (m)'), C('545'), C('519', 1), C('727', 1), C('613'), I('3번 가장 높고 2번 가장 낮음')],
    [cell('4'), L('LS'), C('2.0'), C('11.4', 1), C('13.4', 1), C('3.0'), I('2·3번 지형 부담 큼')],
    [cell('6'), L('6~9월 R 비중 (%)'), C('76.5'), C('76.5'), C('76.5'), C('85.4', 1), I('4번 여름 집중 (관측소 영향)')],
    [cell('7'), L('필지 면적 (㎡)'), C('1,905'), C('1,105', 1), C('2,414'), C('1,775'), I('2번 필지가 작음')],
    [cell('9'), L('연간 R'), C('1,482'), C('1,914'), C('1,914'), C('2,226', 1), I('4번 높음 (관측소 영향)')]];
  s.addTable(rows, { x: 0.5, y: 2.0, w: W - 1, colW: [0.7, 2.45, 1.75, 1.85, 1.6, 1.75, 2.233], rowH: [0.66, 0.53, 0.53, 0.53, 0.53, 0.53, 0.53, 0.53], border: { type: 'solid', color: 'E0E0E0', pt: 0.75 }, valign: 'middle', objectName: 'table-profile' });
  src(s, '녹색 칸: 다른 유형과 뚜렷이 구분되는 값 · 모든 값은 유형별 중앙값 · 순위는 η² 기준 (5위 경지정리 논, 8위 일 최대 강우는 유형 간 중앙값 차이가 없어 생략)', 6.7);
  s.addNotes('유형별 중앙값을 기여도 순으로 정리했습니다. 녹색 칸이 각 유형을 특징짓는 값입니다.');
}
/* ============ S21. 결과 신뢰도 점검 ============ */
{
  const s = slide(2, '결과 신뢰도 점검', '결과 신뢰도 점검', ['유형 간 차이가 ', { h: '통계적으로 유의한지' }, ' 확인했습니다']);
  const steps = [['일원 ANOVA', '39개 중 31개', '네 유형의 평균이 같은지 검정 (BH 보정 q < 0.05)'], ['Levene 등분산 검사', '31개 피처 분산 다름', '등분산 가정이 깨져 Welch ANOVA 27/33, Kruskal-Wallis 31/39로 재확인'],
    ['쌍별 비교', '229쌍 중 124쌍', '등분산을 가정하는 Tukey HSD 대신 Welch t 검정 + Holm·BH 두 보정 모두 통과']];
  steps.forEach((r, i) => { const y = 2.0 + i * 1.62; card(s, 0.5, y, 4.6, 1.48); dot(s, i + 1, 0.72, y + 0.22, 0.48, G.g, { fontSize: 14 }); T(s, r[0], 1.35, y + 0.2, 3.6, 0.3, { fontSize: 14, bold: true }); T(s, r[1], 1.35, y + 0.5, 3.6, 0.4, { fontSize: 20, bold: true, color: G.dk }); T(s, r[2], 1.35, y + 0.92, 3.6, 0.5, { fontSize: 11, color: '555555' }); });
  card(s, 5.35, 2.0, 7.48, 4.85);
  T(s, '유형 쌍별 효과크기 (Hedges g)', 5.6, 2.17, 6, 0.3, { fontSize: 15, bold: true });
  T(s, '앞 유형 평균이 높으면 +, 낮으면 −  ·  |g| ≥ 0.8이면 차이가 큼', 5.6, 2.47, 7, 0.25, { fontSize: 11, color: G.sub });
  const pairs = ['1 vs 2', '1 vs 3', '1 vs 4', '2 vs 3', '2 vs 4', '3 vs 4'];
  const g = [['경지정리된 밭', [2.44, 2.13, 2.84, -0.24, 0.15, 0.33]], ['경지정리 안 된 밭', [-3.71, -3.16, -9.79, 0.05, -0.50, -0.49]], ['평균 고도', [0.71, -1.60, -0.57, -2.28, -1.31, 1.12]], ['LS', [-1.43, -1.55, 0.06, -0.24, 1.79, 1.87]], ['필지 면적', [0.37, -0.25, -0.07, -0.58, -0.38, 0.17]]];
  const rows = [[cell('', { fill: { color: 'FFFFFF' } }), ...pairs.map(p => cell(p, { bold: true, fontSize: 11.5 }))]];
  g.forEach(([f, vals]) => rows.push([cell(f, { bold: true, align: 'left', fontSize: 12 }), ...vals.map(v => { const [fc, tc] = seqFill(Math.abs(v), 0, 2.5); return cell((v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2), { fill: { color: fc }, color: tc, fontSize: 12.5, bold: Math.abs(v) >= 0.8 }); })]));
  s.addTable(rows, { x: 5.55, y: 2.85, w: 7.08, colW: [1.86, 0.87, 0.87, 0.87, 0.87, 0.87, 0.87], rowH: [0.45, 0.52, 0.52, 0.52, 0.52, 0.52], border: { type: 'solid', color: 'FFFFFF', pt: 2 }, valign: 'middle', objectName: 'table-hedges' });
  T(s, '1번은 밭 피복으로, 2·3번은 고도로, 1·4번 대 2·3번은 LS로 크게 갈림. 1↔4의 LS(0.06), 2↔3의 LS(−0.24)처럼 차이가 작은 쌍도 있음', 5.6, 5.95, 7.0, 0.75, { fontSize: 11.5, color: '333333' });
  src(s, '같은 피처로 군집을 만든 뒤 비교한 탐색 결과 · 공간 상관 미보정 · 강우 5피처는 관측소 반복 배정이라 p값을 독립 근거로 보지 않음 · 수치 0의 p는 1e-300 미만');
  s.addNotes('ANOVA로 39개 피처 중 31개에서 유형 간 평균 차이가 확인됐습니다. 분산이 같지 않은 피처가 많아, 쌍별 비교는 Tukey HSD 대신 등분산을 가정하지 않는 Welch t 검정과 다중비교 보정을 썼습니다. 오른쪽은 주요 피처의 쌍별 효과크기로, 어느 유형끼리 무엇으로 갈리는지 보여줍니다.');
}

divider('04', '예방전략 및 결론', ['유형별 맞춤 대책', '농부 안내 서비스', '가설 검증 결과', '한계와 향후 과제']);

/* ============ S22. 해결책 매칭 ============ */
{
  const s = slide(3, '유형별 맞춤 대책', '클러스터에 맞는 해결책 매칭', ['유형이 다르면 ', { h: '먼저 확인할 것과 대책' }, '이 달라집니다']);
  const d = [['경지정리 밭 92% · LS 2.0', ['지금 흙이 드러난 곳', '기존 피복 유지 여부', '수확 후 빈 기간'], '피복 유지 + 작기 사이 공백 메우기', '낮은 LS는 안전하다는 뜻이 아님', ['잔재 피복', '피복작물']],
    ['고도 519m · 1,105㎡ · LS 11.4', ['비 온 뒤 물 흐름', '흙 패임·쌓임 흔적', '설치 공간·농기계 동선'], '물길 확인 후 시설 상담', '작은 필지라 설치 공간부터 확인', ['완충식생대', '식생수로']],
    ['고도 727m · LS 13.4', ['흙이 드러난 곳', '집중 물길·패임', '작기와 재배 가능 기간'], '노출부 피복 + 집중 물길 관리', '고도만으로 작물·시기를 정하지 않음', ['잔재 피복', '피복작물', '식생수로']],
    ['미정리 밭 93% · LS 3.0', ['흙이 드러난 곳', '기존 피복 상태', '물 흐름·배출구'], '피복 보완 + 밭 가장자리·배출구 점검', '피복 분류를 계절 피복률로 보지 않음', ['잔재 피복', '완충식생대']]];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.78);
    pill(s, `${i + 1}번  ${CN[i]}`, x + 0.18, 2.18, w - 0.36, { fill: CL[i], fontSize: 13, h: 0.42 });
    T(s, r[0], x + 0.22, 2.72, w - 0.44, 0.28, { fontSize: 11.5, color: G.sub });
    T(s, '먼저 확인할 것', x + 0.22, 3.08, w - 0.44, 0.24, { fontSize: 11, bold: true, color: G.g });
    T(s, r[1].map((q, j) => ({ text: q, options: { bullet: { code: '25CF' }, breakLine: j < r[1].length - 1 } })), x + 0.22, 3.33, w - 0.44, 0.9, { fontSize: 12, color: '333333', paraSpaceAfter: 2 });
    s.addShape(pres.ShapeType.downArrow, { x: x + w / 2 - 0.15, y: 4.28, w: 0.3, h: 0.24, fill: { color: 'CFCFCF' }, line: { color: 'CFCFCF', width: 0 }, objectName: nm('arr') });
    T(s, r[2], x + 0.22, 4.6, w - 0.44, 0.62, { fontSize: 15, bold: true, color: G.dk });
    T(s, r[3], x + 0.22, 5.27, w - 0.44, 0.5, { fontSize: 11, color: G.brown });
    let tx = x + 0.2;
    r[4].forEach((t) => { const tw = t.length * 0.14 + 0.24; pill(s, t, tx, 6.2, tw, { fill: G.tint, color: G.dk, fontSize: 10.5, h: 0.32 }); tx += tw + 0.06; });
  });
  src(s, '유형은 질문 순서만 정하고, 대책 후보는 현장 답변이 조건을 만족할 때만 안내 · 설치 폭·효과율·품종은 자동으로 정하지 않음', 6.92);
  s.addNotes('유형마다 먼저 확인할 것과 대책 후보가 다릅니다. 1·4번은 경사가 낮지만 피복 상태를 먼저 보고, 2번은 작은 필지라 물길과 설치 공간을, 3번은 경사가 급한 고지대라 노출부와 집중 물길을 먼저 봅니다. 유형은 질문 순서를 정할 뿐이고, 실제 대책은 농부의 현장 답변으로 결정합니다.');
}
/* ============ S23. 대책 근거 ============ */
{
  const s = slide(3, '대책의 근거', '대책의 근거', ['제안한 대책은 ', { h: '연구와 보전 기준으로 검증된 방법' }, '입니다']);
  const d = [['완충식생대', '59~88%', '토양유실 저감', '고랭지 배추밭(경사 17%)에 호밀 식생대 2m·4m', '진용익 외(2009), 한국토양비료학회지 42(4)', 'NRCS 393 Filter Strip: 넓고 얕은 유출에 적용'],
    ['볏짚거적·잔재 피복', '50~68%', '유출량 저감', '국내 사양토 콩밭(경사 2~8.4%), 2년 시험', 'Shin et al.(2016), Irrigation and Drainage 65', 'USDA 지표 피복: 빗방울 충격 감소 원리'],
    ['피복작물', '72%', '토양유실 평균 저감', '서유럽 메타분석, 가을·겨울 나지 대비', 'Clement et al.(2024), Soil Use and Management 40(2)', 'NRCS 340 Cover Crop: 작기 공백 피복'],
    ['식생수로', '물길 안정', '집중 유출·토사 이동 억제', '농업 유역에서 집중 흐름을 배수하며 물길 침식 억제', 'Fiener & Auerswald(2003), J. Environ. Qual. 32(3)', 'NRCS 412 Grassed Waterway: 안정 배출구 필요']];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.15);
    pill(s, r[0], x + 0.22, 2.22, 1.95);
    T(s, r[1], x + 0.22, 2.8, w - 0.44, 0.75, { fontSize: i === 3 ? 30 : 38, bold: true, color: G.dk, valign: 'middle' });
    T(s, r[2], x + 0.22, 3.6, w - 0.44, 0.3, { fontSize: 14, bold: true, color: '333333' });
    T(s, r[3], x + 0.22, 3.98, w - 0.44, 0.6, { fontSize: 11.5, color: '444444' });
    T(s, r[4], x + 0.22, 4.62, w - 0.44, 0.45, { fontSize: 9.5, color: G.mute });
    card(s, x + 0.15, 5.18, w - 0.3, 0.8, { fill: G.tint, noShadow: true, r: 0.1 });
    T(s, r[5], x + 0.27, 5.22, w - 0.54, 0.72, { fontSize: 10.5, color: G.dk, valign: 'middle' });
  });
  band(s, '연구 수치는 각 시험 조건의 결과입니다. 우리 필지의 예상 저감률이 아니며, 서로 다른 대책의 효과를 더하지 않습니다', 0.5, 6.32, W - 1, 0.6, { fontSize: 14, bold: true, fill: G.tint, color: G.dk });
  s.addNotes('대책의 근거는 국내외 연구 네 편과 미국 자연자원보전청(NRCS)의 보전 기준입니다. 연구 수치는 시험 조건에서의 결과라 저희 필지에 그대로 적용되는 저감률은 아닙니다.');
}
/* ============ S24. 서비스 동작 ============ */
{
  const s = slide(3, '농부 안내 서비스', '농부 안내 서비스의 동작 원리', ['유형으로 질문 순서를, ', { h: '현장 답변으로 대책' }, '을 정합니다']);
  const flow = ['팜맵 구획 확인', '41피처 확보', '저장 모델 적용', '유형·불확실성 표시', '현장 질문 12개', '조건별 보완책 후보'];
  const fw = 2.0, fg = 0.066;
  flow.forEach((t, i) => {
    const x = 0.5 + i * (fw + fg);
    s.addText(t, { x, y: 2.0, w: fw, h: 0.7, shape: i === 0 ? pres.ShapeType.homePlate : pres.ShapeType.chevron, fill: { color: ['8FBC7F', '7FAE70', '6E9F62', '5E8F55', '4F7F48', '3F6B3A'][i] }, color: 'FFFFFF', fontFace: F, fontSize: 12.5, bold: true, align: 'center', valign: 'middle', margin: [0, 0.2, 0, 0.25], objectName: nm('flow') });
  });
  card(s, 0.5, 2.95, 8.0, 3.9);
  T(s, '추천 규칙 예시 (12개 규칙 중)', 0.75, 3.1, 6, 0.3, { fontSize: 14, bold: true });
  const C = (t, o = {}) => cell(t, Object.assign({ align: 'left', fontSize: 11.5 }, o));
  const lv = (t, f, c) => cell(t, { fontSize: 10.5, bold: true, color: c || G.dk, fill: { color: f } });
  const rows = [[hd('현장 답변 조건', { fontSize: 11.5 }), hd('안내', { fontSize: 11.5 }), hd('수준', { fontSize: 11.5 })],
    [C('흙이 드러남 + 피복재 적합 확인'), C('노출부 피복 보완 검토'), lv('보완책 후보', G.pale)],
    [C('수확 후 빈 기간 + 피복작물 일정 가능'), C('작기 사이 피복작물 검토'), lv('보완책 후보', G.pale)],
    [C('넓고 얕은 흐름 + 공간 + 통행 충돌 없음 + 안정 배출구'), C('완충식생대 후보 검토'), lv('현장설계 상담', 'DCE8F3', '23476B')],
    [C('한곳으로 모인 흐름 + 같은 조건'), C('식생수로 등 집중 물길 관리'), lv('현장설계 상담', 'DCE8F3', '23476B')],
    [C('비 그친 뒤 반복적인 물고임'), C('물고임 원인 점검 (시설 후보 보류)'), lv('현장 확인', G.btint, G.brown)],
    [C('흙 노출 없음 + 기존 피복 양호'), C('현재 피복 유지·변화 점검'), lv('유지관리', 'EEEEEE', '555555')]];
  s.addTable(rows, { x: 0.7, y: 3.48, w: 7.6, colW: [3.75, 2.55, 1.3], rowH: [0.4, 0.46, 0.46, 0.52, 0.46, 0.46, 0.46], border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', margin: [0, 0.08, 0, 0.08], objectName: 'table-rules' });
  card(s, 8.75, 2.95, 4.08, 3.9);
  pill(s, '안내 원칙', 9.0, 3.13, 1.3);
  const pr = [['군집은 질문 순서만 바꾼다', '대책을 고르는 조건은 모든 유형에 같음'], ['모르는 답은 \'아니요\'가 아니다', '빈 답은 모름으로 두고 추가 확인을 안내'], ['수치를 지어내지 않는다', '설치 폭·효과율·품종은 현장 설계로 결정'], ['유보돼도 안내한다', '유형이 유보된 필지도 답변으로 일반 후보 제시']];
  pr.forEach((r, i) => { const y = 3.62 + i * 0.78; T(s, r[0], 9.0, y, 3.65, 0.28, { fontSize: 12.5, bold: true, color: G.dk }); T(s, r[1], 9.0, y + 0.3, 3.65, 0.4, { fontSize: 11, color: '555555' }); });
  src(s, '규칙 엔진·질문 12개·추천 규칙표 구현 완료, 테스트 12건 통과 · 프로그램 분기 검증이며 농업 효과 검증은 아님');
  s.addNotes('서비스는 필지를 확인하고 41개 피처로 유형을 정한 뒤, 유형에 맞는 순서로 현장 질문을 합니다. 답변이 조건을 만족하는 경우에만 대책 후보를 안내합니다. 예를 들어 흙이 드러나 있고 쓸 피복재가 적합하면 피복 보완을, 물이 한곳으로 모여 흐르고 배출구가 안정적이면 식생수로 상담을 안내합니다.');
}
/* ============ S25. UI 시안 ============ */
function phone(s, x, y, w, h) {
  rect(s, x, y, w, h, '2B2B2B', { round: 0.3 });
  rect(s, x + 0.1, y + 0.12, w - 0.2, h - 0.24, 'FFFFFF', { round: 0.22 });
  rect(s, x + w / 2 - 0.35, y + 0.17, 0.7, 0.06, '2B2B2B', { round: 0.03 });
  return { x: x + 0.18, y: y + 0.32, w: w - 0.36 };
}
function phoneHead(s, sc, title) {
  rect(s, sc.x - 0.08, sc.y, sc.w + 0.16, 0.42, G.g);
  T(s, title, sc.x, sc.y, sc.w, 0.42, { fontSize: 11.5, bold: true, color: 'FFFFFF', valign: 'middle' });
}
{
  const s = slide(3, '결과물 화면 시안', '만든 결과물 안내', ['주소를 고르면 ', { h: '내 밭의 유형과 보완책 후보' }, '를 알려줍니다']);
  const pw = 3.05, ph = 4.95, py = 1.95, xs = [0.65, 4.0, 7.35];
  const steps = ['① 필지 선택 · 유형 확인', '② 현장 질문에 답하기', '③ 보완책 후보 받기'];
  // phone 1
  let sc = phone(s, xs[0], py, pw, ph); phoneHead(s, sc, '우리 밭 토양유실 안내');
  rect(s, sc.x, sc.y + 0.52, sc.w, 1.25, 'DCEBD3', { round: 0.08 });
  rect(s, sc.x + 0.25, sc.y + 0.7, 0.9, 0.42, 'C3DDB5'); rect(s, sc.x + 1.25, sc.y + 0.68, 1.05, 0.55, 'C3DDB5'); rect(s, sc.x + 0.35, sc.y + 1.2, 1.15, 0.45, 'C3DDB5');
  s.addShape(pres.ShapeType.rect, { x: sc.x + 1.55, y: sc.y + 1.28, w: 0.85, h: 0.4, fill: { color: 'E39A2D', transparency: 45 }, line: { color: 'B36F12', width: 1.5 }, objectName: nm('parcel') });
  T(s, '평창 대관령면 · 팜맵 필지 선택됨', sc.x, sc.y + 1.85, sc.w, 0.25, { fontSize: 9.5, color: G.sub });
  card(s, sc.x, sc.y + 2.15, sc.w, 1.05, { fill: 'FBF4EA', noShadow: true, r: 0.1 });
  dot(s, 3, sc.x + 0.12, sc.y + 2.3, 0.36, CL[2], { fontSize: 12 });
  T(s, '후보 유형 3번', sc.x + 0.58, sc.y + 2.25, 1.9, 0.25, { fontSize: 11.5, bold: true });
  T(s, '고지대·고LS형', sc.x + 0.58, sc.y + 2.5, 1.9, 0.25, { fontSize: 10.5, color: '555555' });
  T(s, '경사가 급한 높은 밭. 노출부와 집중 물길을 먼저 확인해요', sc.x + 0.12, sc.y + 2.78, sc.w - 0.2, 0.4, { fontSize: 9, color: '444444' });
  pill(s, '유형 배정 유보', sc.x, sc.y + 3.3, 1.3, { fill: G.brown, fontSize: 9.5, h: 0.28 });
  T(s, '강우 관측률 확인 필요 · 다음 후보 4번', sc.x, sc.y + 3.64, sc.w, 0.25, { fontSize: 9, color: G.brown });
  T(s, '※ 정답 확률이 아닌 참고 정보입니다', sc.x, sc.y + 3.95, sc.w, 0.25, { fontSize: 8.5, color: G.mute });
  // phone 2
  sc = phone(s, xs[1], py, pw, ph); phoneHead(s, sc, '현장 질문 (3번 유형 순서)');
  const qs = [['현재 흙이 드러난 부분이 있나요?', ['예', '아니요', '모름'], 0], ['비가 온 뒤 물은 어떻게 흐르나요?', ['없음', '넓고 얕게', '한곳으로'], 2], ['물이 나가는 곳이 안정적인가요?', ['안정', '이상 있음', '모름'], 0], ['흙이 패이거나 쌓인 흔적이 있나요?', ['예', '아니요', '모름'], -1]];
  qs.forEach((q, i) => {
    const y = sc.y + 0.55 + i * 0.9;
    T(s, q[0], sc.x, y, sc.w, 0.28, { fontSize: 9.5, bold: true });
    q[1].forEach((o, j) => { const bw = (sc.w - 0.12) / 3; const sel = j === q[2]; s.addText(o, { x: sc.x + j * (bw + 0.06), y: y + 0.32, w: bw, h: 0.36, shape: pres.ShapeType.roundRect, rectRadius: 0.08, fill: { color: sel ? G.g : 'F3F3F3' }, line: { color: sel ? G.g : 'DDDDDD', width: 0.75 }, color: sel ? 'FFFFFF' : '555555', fontFace: F, fontSize: 9, bold: sel, align: 'center', valign: 'middle', margin: 0, objectName: nm('opt') }); });
  });
  // phone 3
  sc = phone(s, xs[2], py, pw, ph); phoneHead(s, sc, '보완책 후보');
  const rc = [['노출부 피복 보완 검토', '보완책 후보', G.pale, G.dk, '작물에 맞는 잔재 피복·유기물 멀칭 후보를 검토하세요', 'E1'], ['식생수로 등 집중 물길 관리 상담', '현장설계 상담', 'DCE8F3', '23476B', '집수면적·흐름·경사를 확인해 상담하세요. 임의로 파거나 막지 않아요', 'E4']];
  rc.forEach((r, i) => {
    const y = sc.y + 0.55 + i * 1.45;
    card(s, sc.x, y, sc.w, 1.32, { fill: 'FFFFFF', line: 'E3E3E3', noShadow: true, r: 0.1 });
    pill(s, r[1], sc.x + 0.1, y + 0.1, 1.15, { fill: r[2], color: r[3], fontSize: 8.5, h: 0.26 });
    T(s, '근거 ' + r[5], sc.x + sc.w - 0.75, y + 0.12, 0.65, 0.22, { fontSize: 8.5, color: G.mute, align: 'right' });
    T(s, r[0], sc.x + 0.1, y + 0.42, sc.w - 0.2, 0.28, { fontSize: 10.5, bold: true });
    T(s, r[4], sc.x + 0.1, y + 0.72, sc.w - 0.2, 0.55, { fontSize: 8.8, color: '555555' });
  });
  card(s, sc.x, sc.y + 3.5, sc.w, 0.68, { fill: G.tint, noShadow: true, r: 0.1 });
  T(s, '추가로 확인할 질문 4개 · 침식 흔적, 수확 후 빈 기간, 피복작물 일정, 기존 피복', sc.x + 0.1, sc.y + 3.52, sc.w - 0.2, 0.64, { fontSize: 8.8, color: G.dk, valign: 'middle' });
  card(s, 10.65, 1.95, 2.18, 4.95);
  steps.forEach((t, i) => { const y = 2.15 + i * 1.1; dot(s, i + 1, 10.82, y, 0.38, G.g, { fontSize: 12 }); T(s, t.slice(2), 11.28, y - 0.02, 1.45, 0.45, { fontSize: 11.5, bold: true, valign: 'middle' }); });
  T(s, '화면은 시안입니다. 표시한 유형·질문·후보는 실제 서비스 엔진의 예시 응답(대관령 필지, 가상 답변)을 옮긴 것입니다', 10.82, 5.45, 1.88, 1.35, { fontSize: 9.5, color: G.sub });
  s.addNotes('결과물의 화면 시안입니다. 지도에서 필지를 고르면 후보 유형과 불확실성을 보여주고, 유형에 맞는 순서로 현장 질문을 합니다. 답변에 따라 노출부 피복이나 식생수로 상담 같은 후보를 근거와 함께 안내합니다. 화면 내용은 실제 엔진의 예시 응답을 옮긴 것이며, 화면 자체와 주소 자동 수집은 아직 구현 전입니다.');
}
/* ============ S26. 결과물 신뢰도 ============ */
{
  const s = slide(3, '결과물 신뢰도', '결과물이 기존 클러스터를 얼마나 재현하는가', ['저장 모델은 학습 결과를 ', { h: '100% 재현' }, '합니다']);
  const st = [['100%', '학습 유형 재현', '저장한 계수로 28,815필지를 다시 분류 → 학습 때 유형과 모두 일치 (테스트 12건 통과)'], ['82.2%', '같은 기준으로 배정', '28,864필지 중 23,725필지가 거리·경계·자료 품질 기준을 통과'], ['0.927', '표본을 바꿔도 유지', '지역별 80%로 다시 학습해도 나머지 20%의 유형이 유지 (최저 ARI)']];
  st.forEach((r, i) => { const y = 2.0 + i * 1.62; card(s, 0.5, y, 4.6, 1.48); T(s, r[0], 0.75, y + 0.15, 2.0, 0.6, { fontSize: 32, bold: true, color: G.dk }); T(s, r[1], 2.75, y + 0.25, 2.2, 0.35, { fontSize: 14, bold: true }); T(s, r[2], 0.75, y + 0.82, 4.15, 0.6, { fontSize: 11, color: '555555' }); });
  card(s, 5.35, 2.0, 7.48, 4.0);
  T(s, '유형별 배정 · 유보 비율', 5.6, 2.17, 6, 0.3, { fontSize: 15, bold: true });
  const lbl = CN.map((c, i) => `${i + 1}번 ${c}`);
  s.addChart(pres.charts.BAR, [{ name: '배정', labels: lbl, values: [85.9, 76.9, 81.8, 85.1] }, { name: '유형 유보', labels: lbl, values: [14.1, 23.1, 18.2, 14.9] }],
    Object.assign({}, chartBase, { x: 5.45, y: 2.5, w: 7.25, h: 3.4, barDir: 'bar', barGrouping: 'stacked', chartColors: [G.g, 'D9D9D9'], showValue: true, dataLabelPosition: 'ctr', dataLabelFormatCode: '0.0"%"', dataLabelColor: '1F1F1F', dataLabelFontSize: 11,
      catAxisOrientation: 'maxMin', valAxisHidden: true, valAxisMaxVal: 100, valGridLine: { style: 'none' }, barGapWidthPct: 45, showLegend: true, legendPos: 'b', legendFontSize: 11, legendColor: '444444', catAxisLabelFontSize: 11.5, objectName: 'chart-assign' }));
  band(s, [{ text: '배정률은 정답 정확도나 신뢰확률이 아닙니다.  ', options: { bold: true } }, { text: '유보 5,090필지도 현장 답변으로 일반 대책 후보를 안내합니다' }], 5.35, 6.13, 7.48, 0.72, { fontSize: 12.5, fill: G.tint, color: G.dk });
  src(s, '배정 23,725 · 유형 유보 5,090 · 미배정 49(입력 결측) · 유보 사유: 경계 근처, 중심에서 멂, 가정 변경 시 유형 바뀜 등 · 실제 침식·대책 효과는 미검증');
  s.addNotes('결과물이 기존 클러스터를 얼마나 재현하는지 확인했습니다. 저장한 계수로 다시 분류하면 학습 결과와 100% 같고, 같은 기준을 통과해 유형을 확정하는 필지는 82%입니다. 표본을 바꿔 다시 학습해도 유형이 유지됐습니다. 다만 이는 재현성과 안정성이지 정답 정확도는 아닙니다.');
}
/* ============ S27. 가설 검증 ============ */
{
  const s = slide(3, '가설 검증 결과', '가설 검증 결과', ['처음 세운 ', { h: '세 가지 가설' }, '은 어떻게 되었을까요?']);
  const d = [['Q1', '취약 조건은 필지마다 다른가', '필지는 인자 조합에 따라 몇 개의 취약 유형으로 나뉜다', '지지', G.g, '4개 유형으로 구분되고 39개 중 31개 피처에서 유형 간 차이가 유의. 초기화 ARI 0.972, 표본 0.927. 단, 지형 가중치 변화에는 민감'],
    ['Q2', '어떤 조건이 겹칠 때 위험이 커지는가', '급경사 · 드러난 밭 · 적은 보호 피복 · 강한 강우가 겹칠수록 위험하다', '부분 지지', G.brown, '높은 LS·높은 R·적은 산림+초지를 모두 가진 유형은 없음. LS가 높은 2·3번은 R이 중앙 이하, R이 높은 4번은 LS가 낮음'],
    ['Q3', '유형마다 다른 예방법이 필요한가', '취약 원인이 다르면 효과적인 예방법도 다르다', '지지 (문헌·규칙)', G.g, '유형마다 먼저 확인할 질문과 대책 후보를 다르게 연결. 실제 현장 효과 검증은 향후 과제']];
  d.forEach((r, i) => {
    const y = 2.0 + i * 1.6;
    card(s, 0.5, y, W - 1, 1.45);
    T(s, r[0], 0.8, y + 0.3, 0.9, 0.85, { fontSize: 32, bold: true, color: G.lg, valign: 'middle' });
    T(s, r[1], 1.75, y + 0.28, 4.3, 0.34, { fontSize: 16, bold: true });
    T(s, '가설: ' + r[2], 1.75, y + 0.7, 4.3, 0.65, { fontSize: 12, color: '555555' });
    pill(s, r[3], 6.35, y + 0.53, 1.75, { fill: r[4], h: 0.4 });
    T(s, r[5], 8.4, y + 0.22, 4.2, 1.05, { fontSize: 12, color: '333333', valign: 'middle' });
  });
  src(s, 'Q2 기준: LS 상위 25%(13.4 초과) · 연간 R 중앙값(2,050) 초과 · 산림+초지 비율 중앙값(5.9%) 미만을 유형 중앙값으로 비교 · 실제 유실량 예측이 아닌 환경 특성 유형화', 6.92);
  s.addNotes('Q1과 Q3는 지지되었습니다. Q2는 부분 지지입니다. 위험 조건이 한 유형에 모이지 않고, 경사 부담과 강우 부담이 서로 다른 유형으로 나뉘었습니다. 그래서 유형마다 다른 대책이 필요하다는 Q3로 이어집니다.');
}
/* ============ S28. 한계·향후 ============ */
{
  const s = slide(3, '한계와 향후 과제', '한계와 향후 과제', ['남은 한계와 ', { h: '다음 단계' }]);
  card(s, 0.5, 2.0, 6.05, 3.95); card(s, 6.78, 2.0, 6.05, 3.95);
  pill(s, '이번 분석의 한계', 0.75, 2.22, 1.9, { fill: G.brown });
  pill(s, '향후 과제', 7.03, 2.22, 1.3);
  const L = [['실측 검증 없음', '유형은 환경 특성 기준이며, 실제 침식이나 대책 효과로 검증하지 않음'], ['가중치에 민감', '지형 가중치를 25% 낮추면 일치도 0.572. 가중치와 무관한 자연스러운 4유형이라 단정할 수 없음'], ['입력 해상도', '90m DEM, 관측소 단위 강우(9~10개 값), 토양 K·실제 피복·작기 미반영']];
  const R = [['현장 자료로 검증', '침식 흔적·탁수 발생 지점과 유형 대조, 전문가 블라인드 추천 비교'], ['지역 분리 평가', '한 지역을 빼고 학습한 뒤 그 지역에 적용해 외삽 성능 확인'], ['서비스 완성', '지도·주소로 41피처 자동 수집, 웹·모바일 화면, 현장 사진 입력']];
  [[L, 0.75, G.brown], [R, 7.03, G.dk]].forEach(([arr, x, col]) => arr.forEach((r, i) => { const y = 2.8 + i * 1.0; T(s, r[0], x, y, 5.55, 0.3, { fontSize: 15, bold: true, color: col }); T(s, r[1], x, y + 0.33, 5.55, 0.6, { fontSize: 12, color: '444444' }); }));
  band(s, '주소만 넣으면 그 땅의 유형과 맞춤 대책을 알려주는 시스템으로', 0.5, 6.15, W - 1, 0.8, { fontSize: 22 });
  s.addNotes('한계는 실측 검증이 없다는 점, 가중치에 따라 유형이 달라질 수 있다는 점, 입력 자료의 해상도가 낮다는 점입니다. 다음 단계는 현장 검증과 지역 분리 평가, 그리고 주소만 넣으면 안내받는 시스템으로의 완성입니다.');
}
/* ============ S29. 감사합니다 ============ */
{
  const s = pres.addSlide(); s.background = { color: '2E4A2F' };
  T(s, '감사합니다', 0.5, 2.7, W - 1, 1.1, { fontSize: 54, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  T(s, '강원 고랭지 토양유실 위험 분석 및 맞춤형 저감방안 도출', 0.5, 3.85, W - 1, 0.45, { fontSize: 18, color: 'C9DDBF', align: 'center', valign: 'middle' });
  T(s, [{ text: '강원대 2파트  ', options: { bold: true, color: 'FFFFFF' } }, { text: '김수희, 김연지, 이소정, 정태현, 최연주, 홍석진', options: { color: 'C9DDBF' } }], 0.5, 6.3, W - 1, 0.4, { fontSize: 14, align: 'center', valign: 'middle' });
}
pres.writeFile({ fileName: process.argv[2] }).then(f => console.log('wrote', f));
