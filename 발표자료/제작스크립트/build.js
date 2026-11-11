const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = '강원 고랭지 토양유실 위험 분석 — 데이터 수집·분석·예방전략';
pres.theme = { headFontFace: 'Pretendard', bodyFontFace: 'Pretendard' };
const F = 'Pretendard';
const G = { dk: '2F4F2F', g: '4F6F4C', lg: '8FBC7F', pale: 'D3E5CA', tint: 'EEF3EA', bg: 'F1F1F1', ink: '111111', sub: '7A7A7A', mute: '9A9A9A', line: 'D9D9D9', brown: '8A5A2B' };
const CL = ['1E7A46', '4C8FD6', 'E39A2D', 'B8457A'];
const CN = ['완경사·정리밭형', '소면적·하천 이격형', '강우 노출형', '지형·피복 취약형'];
const NAV = ['주제 선정 배경', '데이터 수집 및 전처리', '데이터 분석', '예방전략 및 결론'];
const NAVX = [1.93, 5.17, 8.35, 11.32];
const W = 13.333;
let n = 0; const nm = (p) => `${p}-${++n}`;

function T(s, text, x, y, w, h, o = {}) {
  s.addText(text, Object.assign({ x, y, w, h, fontFace: F, fontSize: 14, color: G.ink, margin: 0, valign: 'top', isTextBox: true, objectName: nm('text') }, o));
}
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: o.r ?? 0.18, fill: { color: o.fill || 'FFFFFF' }, line: { color: o.line || 'FFFFFF', width: o.line ? 1 : 0 },
    shadow: o.noShadow ? undefined : { type: 'outer', color: '000000', opacity: 0.10, blur: 8, offset: 2, angle: 90 }, objectName: nm('card') });
}
function pill(s, text, x, y, w, o = {}) {
  s.addText(text, { x, y, w, h: o.h || 0.36, shape: pres.ShapeType.roundRect, rectRadius: 0.18, fill: { color: o.fill || G.g }, color: o.color || 'FFFFFF',
    fontFace: F, fontSize: o.fontSize || 13, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('pill') });
}
function slide(navIdx, tag, kicker, titleRuns) {
  const s = pres.addSlide();
  s.background = { color: G.bg };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.47, fill: { color: 'F8F8F8' }, line: { color: 'F8F8F8', width: 0 },
    shadow: { type: 'outer', color: '000000', opacity: 0.12, blur: 5, offset: 1.5, angle: 90 }, objectName: nm('nav') });
  NAV.forEach((t, i) => {
    const act = i === navIdx;
    T(s, t, NAVX[i] - 1.5, act ? 0.05 : 0.1, 3, 0.26, { fontSize: act ? 13 : 13, color: act ? '333333' : 'C4C4C4', align: 'center', valign: 'middle' });
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
const src = (s, t, y = 7.08) => T(s, t, 0.5, y, W - 1, 0.25, { fontSize: 10, color: G.mute, align: 'center' });
const chartBase = { catAxisLabelFontFace: F, valAxisLabelFontFace: F, dataLabelFontFace: F, legendFontFace: F, catAxisLabelColor: '444444', valAxisLabelColor: '777777',
  catAxisLabelFontSize: 12, valAxisLabelFontSize: 10, dataLabelFontSize: 11, dataLabelColor: '333333', valGridLine: { color: 'E6E6E6', size: 0.5 }, catGridLine: { style: 'none' },
  catAxisLineShow: false, valAxisLineShow: false };

/* ============ 1. 분석 대상 지역 ============ */
{
  const s = slide(1, '분석 대상 지역', '분석 대상 지역과 필지 규모', ['강원 고랭지 7개 지역, ', { h: '28,864개 필지' }, '를 분석했습니다']);
  card(s, 0.5, 2.0, 7.6, 4.85);
  T(s, '지역별 팜맵 필지 수', 0.8, 2.18, 5, 0.3, { fontSize: 15, bold: true });
  s.addChart(pres.charts.BAR, [{ name: '필지 수', labels: ['평창 진부면', '정선 임계면', '강릉 왕산면', '평창 대관령면', '삼척 하장면', '정선 여량면', '태백 창죽동'], values: [7652, 6042, 4305, 3929, 3825, 2703, 408] }],
    Object.assign({}, chartBase, { x: 0.7, y: 2.5, w: 7.2, h: 4.25, barDir: 'bar', chartColors: [G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0',
      catAxisOrientation: 'maxMin', valAxisHidden: true, valGridLine: { style: 'none' }, barGapWidthPct: 55, showLegend: false, objectName: 'chart-region' }));
  const st = [['28,864', '전체 필지', '7개 지역의 팜맵 개별 필지'], ['28,815', '군집 학습 필지', '입력값이 모두 갖춰진 필지'], ['49', '제외 필지', 'LS·고도 값 결측 → 사유를 남기고 보존']];
  st.forEach((r, i) => {
    const y = 2.0 + i * 1.65;
    card(s, 8.4, y, 4.43, 1.5);
    T(s, r[0], 8.7, y + 0.2, 2.0, 0.75, { fontSize: 36, bold: true, color: i === 2 ? G.brown : G.dk, valign: 'middle' });
    T(s, r[1], 10.75, y + 0.3, 2.0, 0.3, { fontSize: 15, bold: true });
    T(s, r[2], 10.75, y + 0.65, 1.95, 0.7, { fontSize: 11.5, color: '555555' });
  });
  src(s, '분석 단위: 팜맵 개별 필지 · 필지 수는 최종 분석 데이터 재집계 기준');
  s.addNotes('분석 대상은 강원 고랭지 7개 읍면동의 팜맵 필지 28,864개입니다. 지형 값이 비어 있는 49필지는 삭제하지 않고 제외 사유를 남긴 채 보존했고, 28,815필지로 군집을 학습했습니다.');
}
/* ============ 2. 데이터 수집 ============ */
{
  const s = slide(1, '데이터 수집', '데이터 수집', ['흩어진 자료를 ', { h: '필지 단위' }, '로 하나씩 연결했습니다']);
  const d = [['팜맵', '농식품부', '필지 경계와 식별키', '면', '분석의 기준 단위'], ['토지피복지도', '환경부 · 2025 세분류', '필지 안 피복 유형별 면적 비율', '면', '필지와 분류 도형 중첩'],
    ['수치표고모델', '90m DEM', 'LS(경사 인자), 평균 고도', '격자', '필지 범위로 격자 집계'], ['기상 관측', '기상청 ASOS·AWS · 2025', '연간 R, 최대 1시간·일 강수', '점', '17개 관측소 중 최근접 연결'],
    ['하천망', '지역별 하천 선망', '필지~하천 최소 평면거리', '선', '필지 도형에서 선까지 거리']];
  const w = 2.3, gap = 0.21;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gap);
    card(s, x, 2.0, w, 3.15);
    pill(s, r[3], x + 0.2, 2.2, 0.7, { fill: G.tint, color: G.dk, fontSize: 12, h: 0.32 });
    T(s, r[0], x + 0.2, 2.68, w - 0.4, 0.35, { fontSize: 18, bold: true, color: G.dk });
    T(s, r[1], x + 0.2, 3.05, w - 0.4, 0.3, { fontSize: 11, color: G.sub });
    T(s, '얻은 값', x + 0.2, 3.5, w - 0.4, 0.22, { fontSize: 10.5, bold: true, color: G.g });
    T(s, r[2], x + 0.2, 3.72, w - 0.4, 0.55, { fontSize: 12.5 });
    T(s, '연결 방법', x + 0.2, 4.32, w - 0.4, 0.22, { fontSize: 10.5, bold: true, color: G.g });
    T(s, r[4], x + 0.2, 4.54, w - 0.4, 0.5, { fontSize: 12.5 });
  });
  s.addShape(pres.ShapeType.downArrow, { x: W / 2 - 0.35, y: 5.28, w: 0.7, h: 0.45, fill: { color: G.lg }, line: { color: G.lg, width: 0 }, objectName: nm('arrow') });
  s.addText([{ text: '필지 기준 통합표  ', options: { bold: true } }, { text: '28,864필지 × 환경 피처 44개  ·  연결키 REGION_KEY + ID + UID' }],
    { x: 0.5, y: 5.85, w: W - 1, h: 0.72, shape: pres.ShapeType.roundRect, rectRadius: 0.2, fill: { color: G.g }, color: 'FFFFFF', fontFace: F, fontSize: 19, align: 'center', valign: 'middle', margin: 0, objectName: nm('band') });
  src(s, '토양 침식성(K)은 필지별로 연결할 수 있는 검증 자료가 부족해 이번 군집 입력에서는 제외했습니다 (0이나 1로 대체하지 않음)', 6.78);
  s.addNotes('자료는 기관도 형태도 제각각입니다. 면·격자·점·선 자료를 모두 팜맵 필지에 맞춰 하나의 표로 연결했습니다.');
}
/* ============ 3. 6가지 인자 ============ */
{
  const s = slide(1, '6가지 인자', '데이터 종류: 인자 6가지', ['토양유실 조건을 설명하는 ', { h: '6가지 인자, 44개 피처' }]);
  const d = [['토지피복', '31', '땅이 무엇으로 덮여 있는가', '밭·논·초지·산림·나지 등 피복 유형별 면적 비율'],
    ['지형', '2', '물이 얼마나 세게 흐르는가', 'LS(경사 길이·경사도 인자), 평균 고도'],
    ['필지 형상', '3', '대책을 설치할 수 있는 모양인가', '면적, 장단축비, 형상 조밀도'],
    ['강우', '5', '비가 얼마나 강하게, 몰아서 오는가', '연간 R, 최대 1시간·일 강수량, 상위 5사건 비중, 6~9월 비중'],
    ['하천거리', '1', '흙이 하천에 닿기 쉬운가', '필지에서 하천 선망까지의 최소 거리'],
    ['시간 피복 (가정)', '2', '비 올 때 작물이 땅을 덮고 있는가', '배추 생육 가정곡선 × 강우(EI30) 겹침 지표']];
  const w = 3.95, h = 2.25, gx = 0.24, gy = 0.25;
  d.forEach((r, i) => {
    const x = 0.5 + (i % 3) * (w + gx), y = 2.0 + Math.floor(i / 3) * (h + gy);
    card(s, x, y, w, h);
    s.addText(r[1], { x: x + 0.25, y: y + 0.25, w: 0.95, h: 0.95, shape: pres.ShapeType.ellipse, fill: { color: i === 5 ? G.lg : G.g }, color: 'FFFFFF', fontFace: F, fontSize: 28, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('count') });
    T(s, r[0], x + 1.4, y + 0.3, w - 1.6, 0.35, { fontSize: 19, bold: true });
    T(s, '피처 ' + r[1] + '개' + (i === 5 ? ' · 가중치 0.5' : ''), x + 1.4, y + 0.7, w - 1.6, 0.3, { fontSize: 12, color: G.sub });
    T(s, r[2], x + 0.25, y + 1.33, w - 0.5, 0.3, { fontSize: 14, bold: true, color: G.dk });
    T(s, r[3], x + 0.25, y + 1.65, w - 0.5, 0.5, { fontSize: 12, color: '444444' });
  });
  src(s, '31 + 2 + 3 + 5 + 1 + 2 = 44개 · 시간 피복은 실측이 아닌 분석 가정이라 영향력을 절반(0.5)으로 낮춤 · 지역명·좌표·식별키는 입력에서 제외', 6.95);
  s.addNotes('가설에서 말한 6가지 인자는 토지피복, 지형, 필지 형상, 강우, 하천거리, 시간 피복입니다. 모두 44개 피처로 구성됩니다.');
}
/* ============ 4. K-means ============ */
{
  const s = slide(1, '분석 기법', '분석 기법: K-means 군집분석', ['정답 없이, ', { h: '비슷한 필지끼리' }, ' 묶는 방법입니다']);
  card(s, 0.5, 2.0, 4.3, 3.75);
  pill(s, '왜 K-means인가', 0.75, 2.22, 1.9);
  const why = [['정답이 없다', '필지별 실측 유실량이 없어 비지도 학습이 필요'], ['필지가 많다', '28,815필지 × 42차원도 빠르게 계산'], ['설명·재사용이 쉽다', '유형별 중심값으로 특성을 설명하고, 새 필지도 가장 가까운 중심에 배정']];
  why.forEach((r, i) => { const y = 2.8 + i * 0.97; T(s, r[0], 0.8, y, 3.8, 0.3, { fontSize: 15, bold: true, color: G.dk }); T(s, r[1], 0.8, y + 0.32, 3.75, 0.55, { fontSize: 12.5, color: '444444' }); });
  const st = [['1', '중심 k개 놓기', '임의의 필지 k개를 처음 중심으로 정함'], ['2', '가까운 중심에 배정', '모든 필지를 거리가 가장 가까운 중심의 군집으로'],
    ['3', '중심 옮기기', '각 군집에 속한 필지의 평균으로 중심 이동'], ['4', '반복', '배정이 바뀌지 않을 때까지 2~3단계 반복']];
  const w = 1.84, gx = 0.2;
  st.forEach((r, i) => {
    const x = 5.1 + i * (w + gx);
    card(s, x, 2.0, w, 3.75);
    s.addText(r[0], { x: x + w / 2 - 0.35, y: 2.3, w: 0.7, h: 0.7, shape: pres.ShapeType.ellipse, fill: { color: [G.lg, '7FA873', '63895C', G.g][i] }, color: 'FFFFFF', fontFace: F, fontSize: 22, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('step') });
    T(s, r[1], x + 0.12, 3.25, w - 0.24, 0.65, { fontSize: 15, bold: true, align: 'center' });
    T(s, r[2], x + 0.18, 4.0, w - 0.36, 1.5, { fontSize: 12.5, color: '444444', align: 'center' });
    if (i < 3) s.addShape(pres.ShapeType.rightArrow, { x: x + w - 0.04, y: 2.52, w: 0.28, h: 0.26, fill: { color: 'BDBDBD' }, line: { color: 'BDBDBD', width: 0 }, objectName: nm('arr') });
  });
  s.addText([{ text: '거리로 묶는 방법 → ', options: { bold: true } }, { text: '단위가 큰 피처, 치우친 피처가 결과를 좌우합니다. 그래서 전처리가 중요합니다' }],
    { x: 0.5, y: 6.05, w: W - 1, h: 0.72, shape: pres.ShapeType.roundRect, rectRadius: 0.2, fill: { color: G.g }, color: 'FFFFFF', fontFace: F, fontSize: 18, align: 'center', valign: 'middle', margin: 0, objectName: nm('band') });
  s.addNotes('K-means는 필지 사이의 거리를 기준으로 비슷한 것끼리 묶습니다. 거리 기반이라 면적처럼 숫자가 큰 피처가 결과를 지배할 수 있어, 다음 장의 전처리가 핵심입니다.');
}
/* ============ 5. 전처리 1 로그 ============ */
{
  const s = slide(1, '전처리 ① 로그 변환', '데이터 전처리 ① 분포 다듬기', ['한쪽으로 치우친 값은 ', { h: '로그 변환' }, '으로 폈습니다']);
  card(s, 0.5, 2.0, 8.5, 4.85);
  s.addImage({ path: 'img_hist.png', x: 0.65, y: 2.25, w: 8.2, h: 3.553, altText: 'LS, 필지 면적, 하천거리의 로그 변환 전후 히스토그램', objectName: 'img-hist' });
  T(s, '위: 원자료 (오른쪽 꼬리는 상한에서 잘라 표시) · 아래: ln(1+x) 변환 후', 0.8, 6.25, 7.9, 0.3, { fontSize: 11, color: G.sub });
  card(s, 9.25, 2.0, 3.58, 4.85);
  pill(s, '왜 로그인가', 9.5, 2.22, 1.5);
  T(s, '대부분 작고 일부만 매우 큰 값은, 극단값 몇 개가 거리 계산을 좌우합니다', 9.5, 2.75, 3.1, 0.85, { fontSize: 13, color: '333333' });
  T(s, '왜도 변화 (0에 가까울수록 대칭)', 9.5, 3.7, 3.1, 0.28, { fontSize: 11.5, bold: true, color: G.g });
  const hd = (t, al = 'center') => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: G.g }, align: al, fontSize: 11.5, fontFace: F } });
  const c = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 12, fontFace: F, align: 'center', color: '333333' }, o) });
  s.addTable([[hd('피처', 'left'), hd('변환 전'), hd('변환 후')],
    [c('LS', { align: 'left' }), c('+1.77'), c('−0.17', { bold: true, color: G.dk })], [c('필지 면적', { align: 'left' }), c('+3.62'), c('−0.31', { bold: true, color: G.dk })],
    [c('장단축비', { align: 'left' }), c('+2.49'), c('+0.93', { bold: true, color: G.dk })], [c('하천거리', { align: 'left' }), c('+8.05'), c('+0.90', { bold: true, color: G.dk })]],
    { x: 9.5, y: 4.02, w: 3.1, colW: [1.3, 0.9, 0.9], rowH: 0.36, border: { type: 'solid', color: 'E3E3E3', pt: 0.75 }, valign: 'middle', objectName: 'table-skew' });
  T(s, '적용 7개: LS·면적·장단축비·연간 R·최대 1시간·일 최대 강수·하천거리. 고도와 비율형 피처는 원값 유지', 9.5, 5.95, 3.1, 0.8, { fontSize: 11, color: G.sub });
  s.addNotes('LS, 면적, 하천거리는 오른쪽 꼬리가 긴 분포입니다. ln(1+x) 변환으로 왜도가 크게 줄었습니다. 하천거리는 0m 필지가 많아 변환 후에도 0 근처에 값이 몰려 있습니다.');
}
/* ============ 6. 전처리 2 표준화·가중치 ============ */
{
  const s = slide(1, '전처리 ② 표준화·묶음 조정', '데이터 전처리 ② 단위와 영향력 맞추기', ['피처 수가 많다고 ', { h: '목소리가 커지지 않게' }, ' 조정했습니다']);
  const st = [['1', '로그 변환', 'ln(1+x)', '치우친 7개 피처'], ['2', '표준화', 'z = (x − 평균) / 표준편차', '단위 차이 제거'], ['3', '묶음 조정', 'z ÷ √(묶음 총분산) × √가중치', '인자별 영향력 균등화'], ['4', '상수열 제거', '값이 모두 0인 피복 2열', '44 → 42차원']];
  const w = 2.9, gx = 0.244;
  st.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 1.75);
    s.addText(r[0], { x: x + 0.2, y: 2.2, w: 0.5, h: 0.5, shape: pres.ShapeType.ellipse, fill: { color: G.g }, color: 'FFFFFF', fontFace: F, fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('step') });
    T(s, r[1], x + 0.85, 2.25, w - 1, 0.4, { fontSize: 17, bold: true, valign: 'middle' });
    T(s, r[2], x + 0.2, 2.88, w - 0.4, 0.32, { fontSize: 12.5, color: G.dk, bold: true });
    T(s, r[3], x + 0.2, 3.22, w - 0.4, 0.3, { fontSize: 12, color: '555555' });
    if (i < 3) s.addShape(pres.ShapeType.rightArrow, { x: x + w + 0.01, y: 2.75, w: 0.22, h: 0.24, fill: { color: 'BDBDBD' }, line: { color: 'BDBDBD', width: 0 }, objectName: nm('arr') });
  });
  const labels = ['토지피복', '지형', '형상', '강우', '하천거리', '시간 피복'];
  card(s, 0.5, 3.98, 6.05, 2.87); card(s, 6.78, 3.98, 6.05, 2.87);
  T(s, '조정 전: 인자별 피처 수 = 거리 계산에서의 몫', 0.75, 4.12, 5.6, 0.3, { fontSize: 13.5, bold: true });
  T(s, '조정 후: 인자별 영향력(가중치)', 7.03, 4.12, 5.6, 0.3, { fontSize: 13.5, bold: true });
  const co = Object.assign({}, chartBase, { barDir: 'col', showValue: true, dataLabelPosition: 'outEnd', valAxisHidden: true, valGridLine: { style: 'none' }, barGapWidthPct: 60, showLegend: false, catAxisLabelFontSize: 11 });
  s.addChart(pres.charts.BAR, [{ name: '피처 수', labels, values: [31, 2, 3, 5, 1, 2] }], Object.assign({}, co, { x: 0.65, y: 4.42, w: 5.75, h: 2.38, chartColors: ['BDBDBD'], objectName: 'chart-before' }));
  s.addChart(pres.charts.BAR, [{ name: '가중치', labels, values: [1, 1, 1, 1, 1, 0.5] }], Object.assign({}, co, { x: 6.93, y: 4.42, w: 5.75, h: 2.38, chartColors: [G.g], valAxisMaxVal: 1.25, dataLabelFormatCode: '0.0', objectName: 'chart-after' }));
  src(s, '토지피복은 비율 합을 1로 맞춘 뒤 평균만 빼고(열별 표준편차로 나누지 않음) 묶음 조정 · 가중치는 분석 설계값', 6.95);
  s.addNotes('그대로 넣으면 31개 열을 가진 토지피복이 거리의 대부분을 차지합니다. 묶음 총분산으로 나눠 6개 인자가 같은 영향력을 갖도록 했고, 가정에 기반한 시간 피복만 0.5로 낮췄습니다.');
}
/* ============ 7. 전처리 검증 ============ */
{
  const s = slide(1, '전처리 검증', '데이터 전처리 ③ 검증 결과', ['전처리 결과를 ', { h: '네 가지로 검증' }, '했습니다']);
  const d = [['결측', '49', '필지 제외', 'LS·고도 값이 없는 필지. 0이나 평균으로 채우지 않고 제외 사유와 함께 결과표에 보존'],
    ['이상치', '681', '필지 (2.4%) 유지', '로그 기준 ±3σ 밖: 하천거리 392 · 장단축비 256 · 면적 39. 실제 필지 특성일 수 있어 삭제·절단하지 않음'],
    ['재현성', '100%', '군집 일치', '저장한 42차원 입력으로 같은 설정(seed 42)의 K-means를 다시 돌려 군집 번호가 모두 일치 (ARI 1.00)'],
    ['민감도', '0.954', 'ARI', '일 최대 강우를 넣기 전(43피처)과 후(44피처) 비교. 유형이 바뀐 필지는 460개(1.6%)']];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 3.95);
    pill(s, r[0], x + 0.25, 2.25, 1.1);
    T(s, r[1], x + 0.25, 2.9, w - 0.5, 0.85, { fontSize: 44, bold: true, color: G.dk, valign: 'middle' });
    T(s, r[2], x + 0.25, 3.8, w - 0.5, 0.32, { fontSize: 14, bold: true, color: '333333' });
    s.addShape(pres.ShapeType.line, { x: x + 0.25, y: 4.3, w: w - 0.5, h: 0, line: { color: 'E3E3E3', width: 1 }, objectName: nm('rule') });
    T(s, r[3], x + 0.25, 4.45, w - 0.5, 1.6, { fontSize: 12.5, color: '444444' });
  });
  T(s, 'ARI(조정 랜드 지수): 두 군집 결과가 얼마나 같은지 나타내는 값. 1이면 완전히 같음', 0.5, 6.2, W - 1, 0.3, { fontSize: 11.5, color: G.sub, align: 'center' });
  s.addNotes('결측은 채우지 않고 제외했고, 이상치는 확인만 하고 지우지 않았습니다. 같은 입력으로 다시 돌렸을 때 결과가 완전히 일치했고, 피처 하나를 추가해도 유형이 거의 유지됐습니다.');
}
divider('03', '데이터 분석', ['군집 수 결정', '군집 분석 결과', '유형별 분포 비교', '군집 구분 기여도']);
/* ============ 8. k 선택 ============ */
{
  const s = slide(2, '군집분석 진행', '분석 기법: 군집분석 진행', ['군집은 몇 개로 나눌까요? ', { h: 'k = 4' }, '를 선택했습니다']);
  const ks = ['2', '3', '4', '5', '6', '7', '8'];
  card(s, 0.5, 2.0, 4.15, 4.85); card(s, 4.85, 2.0, 4.15, 4.85);
  T(s, '군집 내 거리 제곱합 (천)', 0.75, 2.17, 3.7, 0.3, { fontSize: 13.5, bold: true });
  T(s, 'k가 커질수록 줄어들지만 뚜렷한 꺾임은 없음', 0.75, 2.47, 3.7, 0.25, { fontSize: 11, color: G.sub });
  T(s, '실루엣 계수', 5.1, 2.17, 3.7, 0.3, { fontSize: 13.5, bold: true });
  T(s, 'k=8에서 최대(0.19), 전 구간 0.14~0.19로 차이가 작음', 5.1, 2.47, 3.7, 0.25, { fontSize: 11, color: G.sub });
  const lo = Object.assign({}, chartBase, { lineSize: 2.25, lineDataSymbolSize: 8, showLegend: false, showValue: true, dataLabelPosition: 't', dataLabelFontSize: 10, catAxisTitle: '군집 수 k', showCatAxisTitle: true, catAxisTitleFontSize: 10, catAxisTitleFontFace: F, catAxisTitleColor: '777777' });
  s.addChart(pres.charts.LINE, [{ name: '거리 제곱합(천)', labels: ks, values: [136.9, 122.2, 111.4, 103.8, 96.9, 92.1, 87.9] }], Object.assign({}, lo, { x: 0.6, y: 2.8, w: 3.95, h: 3.95, chartColors: [G.g], valAxisMinVal: 60, valAxisMaxVal: 150, dataLabelFormatCode: '0', objectName: 'chart-inertia' }));
  s.addChart(pres.charts.LINE, [{ name: '실루엣', labels: ks, values: [0.144, 0.163, 0.141, 0.154, 0.169, 0.183, 0.193] }], Object.assign({}, lo, { x: 4.95, y: 2.8, w: 3.95, h: 3.95, chartColors: [G.g], valAxisMinVal: 0, valAxisMaxVal: 0.25, dataLabelFormatCode: '0.00', valAxisLabelFormatCode: '0.00', objectName: 'chart-sil' }));
  card(s, 9.2, 2.0, 3.63, 4.85);
  pill(s, '왜 4개인가', 9.45, 2.22, 1.5);
  const why = [['수치만으로는 정해지지 않음', '실루엣은 8개에서 가장 높지만 개선 폭이 작습니다'], ['해석과 대책 연결', '유형이 잘게 쪼개지면 유형마다 다른 대책을 연결하기 어려워, 설명 가능한 4개를 채택'], ['결과가 안정적', '초기값(seed)을 3번 바꿔도 ARI 0.997 이상']];
  why.forEach((r, i) => { const y = 2.78 + [0, 1.0, 2.3][i]; T(s, r[0], 9.45, y, 3.15, 0.3, { fontSize: 14, bold: true, color: G.dk }); T(s, r[1], 9.45, y + 0.32, 3.15, 0.95, { fontSize: 12, color: '444444' }); });
  T(s, '설정: K-means · seed 42 · n_init 10 · 42차원 입력', 9.45, 6.3, 3.15, 0.4, { fontSize: 10.5, color: G.sub });
  src(s, '실루엣 계수는 5,000필지 표본으로 재계산한 값', 6.95);
  s.addNotes('군집 수는 지표만으로 딱 정해지지 않았습니다. 실루엣은 8개에서 가장 높지만 차이가 작고, 저희 목적은 유형별로 다른 대책을 연결하는 것이어서 해석 가능한 4개를 선택했습니다. 초기값을 바꿔도 결과는 거의 같았습니다.');
}
/* ============ 9. 군집 결과 ============ */
{
  const s = slide(2, '군집 분석 결과', '군집 분석 결과', ['28,815개 필지가 ', { h: '4개 유형' }, '으로 나뉘었습니다']);
  card(s, 0.5, 2.0, 6.75, 4.85);
  s.addImage({ path: 'img_pca.png', x: 0.85, y: 2.1, w: 5.75, h: 4.47, altText: '주성분 2개로 축약한 필지 산점도, 4개 군집 색상 구분', objectName: 'img-pca' });
  T(s, '42차원을 2차원으로 줄여 본 그림(9,000필지 표본). 큰 점은 유형 중심', 0.8, 6.52, 6.2, 0.25, { fontSize: 10.5, color: G.sub });
  const cnt = [[4035, '14.0%', 'LS가 가장 낮은 경지정리 밭'], [7476, '25.9%', '면적이 작고 하천에서 먼 필지'], [10157, '35.2%', '연간 R과 여름 집중도가 가장 높음'], [7147, '24.8%', 'LS가 가장 높고 가정 피복률이 낮음']];
  cnt.forEach((r, i) => {
    const y = 2.0 + i * 1.235;
    card(s, 7.5, y, 5.33, 1.1);
    s.addText(String(i + 1), { x: 7.72, y: y + 0.25, w: 0.6, h: 0.6, shape: pres.ShapeType.ellipse, fill: { color: CL[i] }, color: 'FFFFFF', fontFace: F, fontSize: 18, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('dot') });
    T(s, CN[i], 8.5, y + 0.2, 2.6, 0.32, { fontSize: 16, bold: true });
    T(s, r[2], 8.5, y + 0.57, 2.75, 0.3, { fontSize: 11.5, color: '555555' });
    T(s, r[0].toLocaleString('en-US'), 11.1, y + 0.17, 1.55, 0.4, { fontSize: 20, bold: true, color: G.dk, align: 'right' });
    T(s, '필지 · ' + r[1], 11.1, y + 0.6, 1.55, 0.25, { fontSize: 11, color: G.sub, align: 'right' });
  });
  src(s, '두 주성분이 설명하는 분산은 33%. 그림에서 겹쳐 보이는 3번·4번은 강우·피복 축에서 구분됩니다 · 유형 번호는 위험 순서가 아닙니다', 6.95);
  s.addNotes('4개 유형입니다. 2차원 그림에서는 3번과 4번이 겹쳐 보이지만, 나머지 차원인 강우와 피복에서 구분됩니다. 번호는 위험 순위가 아니라 이름표입니다.');
}
/* ============ 10. 지역별 ============ */
{
  const s = slide(2, '지역별 유형 분포', '지역별 유형 분포', ['같은 지역 안에서도 ', { h: '유형이 섞여' }, ' 있습니다']);
  card(s, 0.5, 2.0, 8.3, 4.85);
  const reg = ['평창 진부면', '평창 대관령면', '삼척 하장면', '정선 임계면', '강릉 왕산면', '정선 여량면', '태백 창죽동'];
  const v = [[907, 212, 206, 1321, 772, 411, 206], [1834, 601, 629, 1686, 1576, 1087, 63], [4906, 3082, 0, 493, 1532, 8, 136], [0, 0, 2980, 2542, 425, 1197, 3]];
  s.addChart(pres.charts.BAR, v.map((x, i) => ({ name: `${i + 1}번 ${CN[i]}`, labels: reg, values: x })), Object.assign({}, chartBase, { x: 0.65, y: 2.15, w: 8.0, h: 4.6, barDir: 'bar', barGrouping: 'percentStacked', chartColors: CL,
    catAxisOrientation: 'maxMin', showLegend: true, legendPos: 'b', legendFontSize: 11, legendColor: '444444', valAxisLabelFormatCode: '0%', barGapWidthPct: 45, objectName: 'chart-region-type' }));
  const ins = [['평창은 3번 중심', '대관령면 79%, 진부면 64%가 강우 노출형'], ['삼척 하장면은 4번 중심', '78%가 지형·피복 취약형'], ['임계·왕산·여량은 혼합', '네 유형이 함께 나타나, 지역 단위의 일괄 대책으로는 맞추기 어려움']];
  ins.forEach((r, i) => { const y = 2.0 + i * 1.65; card(s, 9.05, y, 3.78, 1.5); T(s, r[0], 9.3, y + 0.22, 3.3, 0.32, { fontSize: 15.5, bold: true, color: G.dk }); T(s, r[1], 9.3, y + 0.62, 3.3, 0.8, { fontSize: 12.5, color: '444444' }); });
  src(s, '강우 피처는 가장 가까운 관측소 값을 배정하므로, 유형 분포에는 지역별 강우 차이가 함께 반영됩니다', 6.95);
  s.addNotes('평창은 강우 노출형, 하장면은 지형·피복 취약형이 많습니다. 하지만 임계·왕산·여량처럼 한 지역에 네 유형이 섞인 곳도 있어, 필지 단위 접근이 필요하다는 점을 보여줍니다.');
}
/* ============ 11. Box ============ */
{
  const s = slide(2, 'Box 그래프', '유형별 분포 비교', ['유형별 차이를 ', { h: '박스플롯' }, '으로 확인했습니다']);
  card(s, 0.5, 2.0, 9.75, 4.85);
  const im = [['box_ls.png', 'LS'], ['box_r.png', '연간 R'], ['box_stream.png', '하천거리'], ['box_tc.png', 'EI30 가중 피복률'], ['box_summer.png', '6~9월 R 비중'], ['box_area.png', '필지 면적']];
  const w = 3.02, h = w * 3.3 / 4.3;
  im.forEach((r, i) => s.addImage({ path: r[0], x: 0.72 + (i % 3) * 3.13, y: 2.1 + Math.floor(i / 3) * 2.36, w, h, altText: r[1] + ' 유형별 박스플롯', objectName: nm('img-box') }));
  card(s, 10.45, 2.0, 2.38, 4.85);
  pill(s, '읽는 법', 10.65, 2.22, 1.1);
  T(s, [{ text: '상자', options: { bold: true } }, { text: '  가운데 50% 필지', options: { breakLine: true } }, { text: '흰 선', options: { bold: true } }, { text: '  중앙값(옆 숫자)', options: { breakLine: true } }, { text: '수염', options: { bold: true } }, { text: '  1.5×IQR 이내 끝값' }],
    10.65, 2.75, 2.0, 1.0, { fontSize: 11.5, color: '333333', paraSpaceAfter: 4 });
  CN.forEach((t, i) => {
    const y = 4.05 + i * 0.5;
    s.addShape(pres.ShapeType.roundRect, { x: 10.65, y: y + 0.03, w: 0.24, h: 0.24, rectRadius: 0.05, fill: { color: CL[i] }, line: { color: CL[i], width: 0 }, objectName: nm('key') });
    T(s, `${i + 1}번 ${t}`, 10.98, y, 1.75, 0.3, { fontSize: 11, valign: 'middle' });
  });
  T(s, '이상점은 표시만 생략, 통계에는 포함. 피복률은 가정값', 10.65, 6.15, 2.0, 0.6, { fontSize: 10, color: G.sub });
  s.addNotes('원단위 값의 유형별 분포입니다. LS는 4번이, 연간 R과 여름 비중은 3번이, 하천거리는 2번이 두드러지고, 가중 피복률은 4번이 낮습니다.');
}
/* ============ 12. 기여도 ============ */
{
  const s = slide(2, '군집 구분 기여도', 'Box 그래프 중요도 결과', ['유형을 가른 핵심은 ', { h: '밭 유형 · 하천거리 · 강우' }, '였습니다']);
  card(s, 0.5, 2.0, 8.3, 4.85);
  T(s, '피처별 군집 구분 기여도 (η², 상위 10개)', 0.8, 2.18, 7, 0.3, { fontSize: 15, bold: true });
  s.addChart(pres.charts.BAR, [{ name: 'η²', labels: ['경지정리 밭 비율', '미정리 밭 비율', '하천거리', '연간 R', 'EI30 가중 피복률', '6~9월 R 비중', '저피복 구간 EI30 비중', '상위 5사건 EI30 비중', 'LS', '필지 면적'], values: [0.78, 0.62, 0.55, 0.53, 0.48, 0.26, 0.22, 0.19, 0.13, 0.10] }],
    Object.assign({}, chartBase, { x: 0.65, y: 2.5, w: 8.0, h: 4.25, barDir: 'bar', chartColors: [G.g], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00', catAxisOrientation: 'maxMin',
      valAxisHidden: true, valAxisMaxVal: 0.9, valGridLine: { style: 'none' }, barGapWidthPct: 50, showLegend: false, objectName: 'chart-eta' }));
  card(s, 9.05, 2.0, 3.78, 2.3);
  pill(s, 'η²란', 9.3, 2.22, 0.95);
  T(s, '그 피처의 전체 분산 중 유형 차이로 설명되는 비율(0~1). 클수록 유형 사이에 값이 뚜렷이 갈립니다', 9.3, 2.75, 3.3, 1.4, { fontSize: 12.5, color: '333333' });
  card(s, 9.05, 4.5, 3.78, 2.35);
  pill(s, '해석할 때 주의', 9.3, 4.72, 1.7, { fill: G.brown });
  T(s, '유형을 "구분"하는 데 기여한 정도이지, 토양유실의 원인 크기가 아닙니다. LS는 0.13으로 낮지만 유형 간 중앙값은 2.5~11.1로 차이가 있습니다', 9.3, 5.25, 3.3, 1.5, { fontSize: 12.5, color: '333333' });
  src(s, '변환된 입력값 기준 일원분산분석의 η²(군집 간 제곱합 ÷ 전체 제곱합) · 44개 피처 중 상위 10개', 6.95);
  s.addNotes('군집이 각 피처의 분산을 얼마나 설명하는지를 계산했습니다. 밭이 경지정리된 밭인지, 하천에서 얼마나 떨어져 있는지, 연간 강우 침식력이 얼마인지가 유형을 가장 뚜렷하게 갈랐습니다. 이 값은 유실 원인의 크기가 아니라 구분 기여도입니다.');
}
/* ============ 13. 중요도 순 해석 ============ */
{
  const s = slide(2, '기여도 순 해석', '중요도 순서로 본 Box 그래프', ['기여도 순서대로 보면 ', { h: '유형의 성격' }, '이 드러납니다']);
  const d = [['1', 'box_221.png', '밭 유형', 0, '1번만 경지정리된 밭', '1번 중앙값 93%, 나머지 유형은 0%. 정리된 밭이라 LS도 가장 낮음'],
    ['2', 'box_stream.png', '하천거리', 1, '2번만 하천에서 멀다', '2번 중앙값 47.9m, 나머지는 1.3~2.1m로 하천에 인접'],
    ['3', 'box_r.png', '연간 R', 2, '3번의 강우 침식력이 최고', '3번 중앙값 2,226 · 4번 1,461. 여름 비중도 3번만 87%'],
    ['4', 'box_tc.png', '가중 피복률', 3, '4번은 비 올 때 덜 덮여 있다', '4번 33.0%, 나머지 41.8%. LS도 4번이 11.1로 최고']];
  const w = 2.9, gx = 0.244, iw = 2.6, ih = iw * 3.3 / 4.3;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.85);
    pill(s, `기여도 ${r[0]}위 · ${r[2]}`, x + 0.2, 2.18, w - 0.4, { fill: G.tint, color: G.dk, fontSize: 12.5 });
    s.addImage({ path: r[1], x: x + 0.15, y: 2.62, w: iw, h: ih, altText: r[2] + ' 유형별 박스플롯', objectName: nm('img-box') });
    s.addShape(pres.ShapeType.roundRect, { x: x + 0.2, y: 4.83, w: 0.22, h: 0.22, rectRadius: 0.05, fill: { color: CL[r[3]] }, line: { color: CL[r[3]], width: 0 }, objectName: nm('key') });
    T(s, r[4], x + 0.5, 4.75, w - 0.65, 0.62, { fontSize: 14, bold: true });
    T(s, r[5], x + 0.2, 5.45, w - 0.4, 1.25, { fontSize: 12, color: '444444' });
  });
  src(s, '밭 유형은 토지피복 세분류의 경지정리 밭(221) 비율 · 피복률은 배추 생육 가정곡선 기반', 6.95);
  s.addNotes('기여도가 높은 순서로 보면 유형마다 하나씩 뚜렷한 특징이 있습니다. 1번은 경지정리된 밭, 2번은 하천에서 먼 필지, 3번은 강우 침식력이 큰 필지, 4번은 비가 올 때 피복이 적고 경사 부담이 큰 필지입니다.');
}
/* ============ 14. 프로파일 ============ */
{
  const s = slide(2, '유형 프로파일', '유형별 특성 요약', ['중앙값으로 정리한 ', { h: '4개 유형의 프로파일' }]);
  const hd = (t) => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: G.dk }, align: 'center', fontSize: 12.5, fontFace: F } });
  const c = (t, hi) => ({ text: t, options: { fontSize: 14, fontFace: F, align: 'center', color: hi ? G.dk : '333333', bold: !!hi, fill: { color: hi ? G.pale : 'FFFFFF' } } });
  const nmc = (i) => ({ text: [{ text: `${i + 1}번  `, options: { bold: true, color: CL[i] } }, { text: CN[i], options: { bold: true, color: '222222' } }], options: { fontSize: 14, fontFace: F, align: 'left', fill: { color: 'FFFFFF' } } });
  const rows = [[hd('유형'), hd('필지 수'), hd('경지정리 밭(%)'), hd('LS'), hd('연간 R'), hd('6~9월 비중(%)'), hd('하천거리(m)'), hd('가중 피복률(%)'), hd('면적(㎡)')],
    [nmc(0), c('4,035'), c('93', 1), c('2.5', 1), c('1,482'), c('76'), c('1.6'), c('41.8'), c('2,228')],
    [nmc(1), c('7,476'), c('0'), c('7.2'), c('1,914'), c('76'), c('47.9', 1), c('41.8'), c('855', 1)],
    [nmc(2), c('10,157'), c('0'), c('6.1'), c('2,226', 1), c('87', 1), c('1.3'), c('41.8'), c('2,324')],
    [nmc(3), c('7,147'), c('0'), c('11.1', 1), c('1,461'), c('76'), c('2.1'), c('33.0', 1), c('2,037')]];
  s.addTable(rows, { x: 0.5, y: 2.05, w: W - 1, colW: [2.75, 1.05, 1.45, 0.9, 1.15, 1.4, 1.3, 1.4, 0.933], rowH: [0.5, 0.62, 0.62, 0.62, 0.62], border: { type: 'solid', color: 'E0E0E0', pt: 0.75 }, valign: 'middle', objectName: 'table-profile' });
  const d = ['낮은 경사의 정리된 밭. 안전하다는 뜻은 아님', '작고 하천에서 떨어진 필지. 실제 물길 연결 확인 필요', '여름에 몰리는 강한 비에 노출', '급한 지형 + 강우기에 낮은 피복이 겹침'];
  const w = 2.9, gx = 0.244;
  d.forEach((t, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 5.4, w, 1.4);
    s.addText(String(i + 1), { x: x + 0.2, y: 5.6, w: 0.46, h: 0.46, shape: pres.ShapeType.ellipse, fill: { color: CL[i] }, color: 'FFFFFF', fontFace: F, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('dot') });
    T(s, CN[i], x + 0.78, 5.6, w - 0.9, 0.46, { fontSize: 14.5, bold: true, valign: 'middle' });
    T(s, t, x + 0.2, 6.17, w - 0.4, 0.55, { fontSize: 12, color: '444444' });
  });
  src(s, '녹색 칸: 다른 유형과 뚜렷이 구분되는 값 · 모든 값은 유형별 중앙값 · 연간 R 단위 MJ·mm/(ha·h)', 6.95);
  s.addNotes('유형별 중앙값을 한 표로 정리했습니다. 녹색 칸이 각 유형을 특징짓는 값이고, 이 특징에서 유형 이름을 붙였습니다.');
}
/* fix table col widths sum */
divider('04', '예방전략 및 결론', ['유형별 맞춤 대책', '대책의 논문 근거', '가설 검증 결과', '한계와 향후 과제']);
/* ============ 15. 해결책 매칭 ============ */
{
  const s = slide(3, '유형별 맞춤 대책', '클러스터에 맞는 해결책 매칭', ['유형이 다르면 ', { h: '대책도 달라집니다' }]);
  const d = [['LS 2.5 (최저) · 경지정리 밭', '피복 유지 + 물길 점검', '경사가 낮아도 나지와 집중 물길이 있으면 유실이 생깁니다. 공통 피복을 유지하고 침식 흔적을 현장에서 확인', ['볏짚거적']],
    ['면적 855㎡ (최소) · 하천거리 47.9m', '연결 경로 확인 후 선정', '거리만으로 대책을 정하지 않습니다. 실제 배수 연결과 토사 이동 경로, 설치 공간을 먼저 확인', ['완충식생대', '식생수로']],
    ['연간 R 2,226 (최고) · 여름 87%', '강우기 전 피복 확보', '6~9월 전에 노출부를 볏짚거적 등으로 덮고, 유출부 하단에 완충식생대를 미리 조성', ['볏짚거적', '완충식생대']],
    ['LS 11.1 (최고) · 피복률 33% (최저)', '표면 피복 + 경사 하단 차단', '피복작물·볏짚거적으로 표면을 먼저 덮고, 경사 하단 완충식생대와 집중 물길의 식생수로를 조합', ['피복작물', '완충식생대', '식생수로']]];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.72);
    pill(s, `${i + 1}번  ${CN[i]}`, x + 0.2, 2.2, w - 0.4, { fill: CL[i], fontSize: 13.5, h: 0.42 });
    T(s, '핵심 특성', x + 0.22, 2.82, w - 0.44, 0.22, { fontSize: 10.5, bold: true, color: G.sub });
    T(s, r[0].replace(' · ', '\n'), x + 0.22, 3.05, w - 0.44, 0.5, { fontSize: 12, color: '333333' });
    s.addShape(pres.ShapeType.downArrow, { x: x + w / 2 - 0.17, y: 3.6, w: 0.34, h: 0.26, fill: { color: 'CFCFCF' }, line: { color: 'CFCFCF', width: 0 }, objectName: nm('arr') });
    T(s, r[1], x + 0.22, 3.98, w - 0.44, 0.36, { fontSize: 16, bold: true, color: G.dk });
    T(s, r[2], x + 0.22, 4.42, w - 0.44, 1.4, { fontSize: 12, color: '444444' });
    let tx = x + 0.2;
    r[3].forEach((t) => { const tw = t.length * 0.135 + 0.2; pill(s, t, tx, 6.2, tw, { fill: G.tint, color: G.dk, fontSize: 10, h: 0.3 }); tx += tw + 0.05; });
  });
  src(s, '대책은 논문에서 검증된 방법을 유형 특성에 연결한 것 · 실제 적용 전 현장의 경사·피복·물길 확인이 필요합니다', 6.92);
  s.addNotes('유형별 주요 원인에 맞춰 대책을 연결했습니다. 3번은 비가 오기 전 피복을 확보하는 시점 관리가, 4번은 표면 피복과 경사 하단 차단을 함께 쓰는 조합이 핵심입니다. 1번도 안전 유형이 아니며, 2번은 거리만으로 판단하지 않고 실제 연결 경로를 확인합니다.');
}
/* ============ 16. 논문 근거 ============ */
{
  const s = slide(3, '대책의 논문 근거', '대책의 근거', ['제안한 대책은 ', { h: '연구로 검증된 방법' }, '입니다']);
  const d = [['완충식생대', '59~88%', '토양유실 저감', '고랭지 배추밭(경사 17%)에 호밀 식생대 2m·4m 설치', '진용익 외(2009), 한국토양비료학회지 42(4)'],
    ['볏짚거적 피복', '50~68%', '유출량 저감', '국내 사양토 콩밭(경사 2~8.4%), 2년 시험', 'Shin et al.(2016), Irrigation and Drainage 65'],
    ['겨울 피복작물', '72%', '토양유실 평균 저감', '서유럽 메타분석(최대 37개 연구), 가을·겨울 나지 대비', 'Clement et al.(2024), Soil Use and Management 40(2)'],
    ['식생수로', '물길 안정', '집중 유출·토사 이동 억제', '농업 유역에서 집중된 표면 유출을 배수하며 물길 침식 억제', 'Fiener & Auerswald(2003), J. Environ. Qual. 32(3)']];
  const w = 2.9, gx = 0.244;
  d.forEach((r, i) => {
    const x = 0.5 + i * (w + gx);
    card(s, x, 2.0, w, 4.0);
    pill(s, r[0], x + 0.22, 2.22, 1.75);
    T(s, r[1], x + 0.22, 2.85, w - 0.44, 0.8, { fontSize: i === 3 ? 30 : 40, bold: true, color: G.dk, valign: 'middle' });
    T(s, r[2], x + 0.22, 3.7, w - 0.44, 0.3, { fontSize: 14, bold: true, color: '333333' });
    T(s, r[3], x + 0.22, 4.15, w - 0.44, 0.85, { fontSize: 12, color: '444444' });
    T(s, r[4], x + 0.22, 5.2, w - 0.44, 0.65, { fontSize: 10, color: G.mute });
  });
  s.addText('각 연구의 시험 조건에서 나온 결과입니다. 우리 필지의 예상 저감률이 아니며, 서로 다른 대책의 효과를 합산하지 않습니다',
    { x: 0.5, y: 6.25, w: W - 1, h: 0.6, shape: pres.ShapeType.roundRect, rectRadius: 0.2, fill: { color: G.tint }, color: G.dk, fontFace: F, fontSize: 14, bold: true, align: 'center', valign: 'middle', margin: 0, objectName: nm('band') });
  s.addNotes('대책의 근거가 되는 연구 네 편입니다. 수치는 각 연구 조건에서의 결과이며, 저희 필지에 그대로 적용되는 저감률은 아닙니다.');
}
/* ============ 17. 가설 검증 ============ */
{
  const s = slide(3, '가설 검증 결과', '가설 검증 결과', ['처음 세운 ', { h: '세 가지 가설' }, '은 어떻게 되었을까요?']);
  const d = [['Q1', '취약 조건은 필지마다 다른가', '필지는 인자 조합에 따라 몇 개의 취약 유형으로 나뉜다', '지지', G.g, '4개 유형으로 구분. 초기값을 바꿔도 ARI 0.997 이상. 다만 실루엣 0.14로 유형 경계는 완만'],
    ['Q2', '어떤 조건이 겹칠 때 위험이 커지는가', '급경사 · 드러난 밭 · 적은 보호 피복 · 강한 강우가 겹칠수록 위험하다', '부분 지지', G.brown, '네 조건을 모두 갖춘 유형은 없었음. 지형·피복 부담(4번)과 강우 부담(3번)이 서로 다른 유형으로 분리'],
    ['Q3', '유형마다 다른 예방법이 필요한가', '취약 원인이 다르면 효과적인 예방법도 다르다', '지지 (문헌 기반)', G.g, '유형별 주요 원인에 서로 다른 검증 대책을 연결. 현장 적용 효과 검증은 향후 과제']];
  d.forEach((r, i) => {
    const y = 2.0 + i * 1.6;
    card(s, 0.5, y, W - 1, 1.45);
    T(s, r[0], 0.8, y + 0.3, 0.9, 0.85, { fontSize: 32, bold: true, color: G.lg, valign: 'middle' });
    T(s, r[1], 1.75, y + 0.28, 4.3, 0.34, { fontSize: 16, bold: true });
    T(s, '가설: ' + r[2], 1.75, y + 0.7, 4.3, 0.65, { fontSize: 12, color: '555555' });
    pill(s, r[3], 6.35, y + 0.53, 1.75, { fill: r[4], h: 0.4 });
    T(s, r[5], 8.4, y + 0.3, 4.2, 0.95, { fontSize: 12.5, color: '333333', valign: 'middle' });
  });
  src(s, '이번 분석은 환경 특성에 따른 유형화이며, 실제 토양유실량이나 발생 확률을 예측한 결과는 아닙니다', 6.92);
  s.addNotes('Q1과 Q3는 지지되었습니다. Q2는 부분 지지입니다. 위험 조건이 한 유형에 모두 겹치지 않고, 지형·피복 부담과 강우 부담이 서로 다른 유형으로 나뉘어 나타났습니다. 그래서 유형별로 다른 대책이 필요합니다.');
}
/* ============ 18. 한계·향후 ============ */
{
  const s = slide(3, '한계와 향후 과제', '한계와 향후 과제', ['남은 한계와 ', { h: '다음 단계' }]);
  card(s, 0.5, 2.0, 6.05, 3.85); card(s, 6.78, 2.0, 6.05, 3.85);
  pill(s, '이번 분석의 한계', 0.75, 2.22, 1.9, { fill: G.brown });
  pill(s, '향후 과제', 7.03, 2.22, 1.3);
  const L = [['실측 검증 없음', '유형은 환경 특성 기준이며 현장 침식 자료로 검증하지 않음'], ['입력 자료의 해상도', '90m DEM, 관측소 단위 강우(9~10종 값), 토양 K 미반영'], ['가정에 민감', '피복은 배추 가정곡선. 가정을 바꿔도 유형이 유지되는 확정 배정은 3,829필지, 24,986필지는 판정 유보']];
  const R = [['현장 자료로 검증', '침식 흔적·탁수 발생 지점과 유형을 대조'], ['입력 정밀화', '고해상도 DEM, 필지별 작물·정식일, 토양 침식성(K) 연결'], ['서비스로 확장', '새 필지를 같은 기준으로 분류해 유형과 맞춤 대책을 안내']];
  [[L, 0.75, G.brown], [R, 7.03, G.dk]].forEach(([arr, x, col]) => arr.forEach((r, i) => { const y = 2.8 + i * 1.0; T(s, r[0], x, y, 5.55, 0.3, { fontSize: 15, bold: true, color: col }); T(s, r[1], x, y + 0.33, 5.55, 0.55, { fontSize: 12.5, color: '444444' }); }));
  s.addText('주소만 넣으면 그 땅의 유형과 맞춤 대책을 알려주는 시스템으로',
    { x: 0.5, y: 6.08, w: W - 1, h: 0.8, shape: pres.ShapeType.roundRect, rectRadius: 0.2, fill: { color: G.g }, color: 'FFFFFF', fontFace: F, fontSize: 22, align: 'center', valign: 'middle', margin: 0, objectName: nm('band') });
  s.addNotes('한계는 세 가지입니다. 실측 검증이 없고, 입력 자료의 해상도가 낮으며, 피복 가정에 따라 유형이 바뀌는 필지가 많습니다. 다음 단계는 현장 검증과 입력 정밀화, 그리고 주소 기반 안내 시스템으로의 확장입니다.');
}
pres.writeFile({ fileName: process.argv[2] }).then(f => console.log('wrote', f));
