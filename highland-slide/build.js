// 고랭지 농업의 환경적 취약성 슬라이드 (참고 슬라이드 톤앤매너: 회색 배경 + 그린 팔레트 + 지시선)
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const tb = require("react-icons/tb");
const path = require("path");

const OUT = process.argv[2] || "highland_vulnerability.pptx";
const FONT = "Pretendard";

// 참고 슬라이드에서 추출한 팔레트
const COL = {
  dark: "4F6B44", // 진녹 (도넛/막대)
  mid: "759A63",
  light: "94BC7C", // 연두 (범례/도넛)
  deep: "3B5233", // 큰 수치 텍스트
  track: "D3D3D3", // 막대 트랙
  ink: "1A1A1A",
  sub: "6E6E6E",
  body: "555555",
  faint: "8A8A8A",
  navOff: "BDBDBD",
  navBg: "F8F8F8",
  line: "4A4A4A",
};

// Venn 기하 (assets.py 와 동일 값)
const V = { cx: 3.35, top: 2.6, r: 1.35, s: 1.65 };
const AY = V.top + V.r;
const CY = AY + V.s * 0.8660254;
const A = { x: V.cx - V.s / 2, y: AY };
const B = { x: V.cx + V.s / 2, y: AY };
const C = { x: V.cx, y: CY };
const CENTROID = { x: V.cx, y: (A.y + B.y + C.y) / 3 };

async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: "#" + color, size: String(size), strokeWidth: 1.6 })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

function T(slide, text, opts) {
  slide.addText(text, { fontFace: FONT, margin: 0, isTextBox: true, valign: "middle", ...opts });
}

// 지시선: 점(dot) → 꺾이는 점 → 텍스트 왼쪽 끝까지
function leader(slide, from, elbow, toX, name) {
  const seg = (p, q, n) => {
    const x = Math.min(p.x, q.x);
    const y = Math.min(p.y, q.y);
    const w = Math.max(Math.abs(q.x - p.x), 0.001);
    const h = Math.max(Math.abs(q.y - p.y), 0.001);
    // 선이 오른쪽 위로 향하면 flipV
    const flipV = (q.x - p.x) * (q.y - p.y) < 0;
    slide.addShape("line", { x, y, w, h, flipV, line: { color: COL.line, width: 0.75 }, objectName: n });
  };
  seg(from, elbow, name + " 사선");
  seg(elbow, { x: toX, y: elbow.y }, name + " 수평선");
  const d = 0.085;
  slide.addShape("ellipse", {
    x: from.x - d / 2, y: from.y - d / 2, w: d, h: d,
    fill: { color: "222222" }, line: { color: "FFFFFF", width: 0.75 }, objectName: name + " 점",
  });
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
  pres.title = "고랭지 농업의 환경적 취약성";

  const slide = pres.addSlide();
  slide.background = { path: path.join(__dirname, "bg.png") };

  // ── 상단 내비게이션 (참고 슬라이드와 동일 구조)
  slide.addShape("rect", {
    x: 0, y: 0, w: 13.333, h: 0.46, fill: { color: COL.navBg }, line: { color: COL.navBg, width: 0 },
    shadow: { type: "outer", color: "000000", opacity: 0.1, blur: 4, offset: 1, angle: 90 },
    objectName: "내비게이션 바",
  });
  const tabs = ["주제 선정 배경", "데이터 수집 및 전처리", "데이터 분석", "예방전략 및 결론"];
  const tabW = 3.11, tabX0 = 0.45;
  tabs.forEach((t, i) => {
    const x = tabX0 + i * tabW;
    if (i === 0) {
      T(slide, [
        { text: t, options: { fontSize: 11, bold: true, color: "2B2B2B", breakLine: true } },
        { text: "# 강원 고랭지 선정 이유", options: { fontSize: 7.5, bold: true, color: "2B2B2B" } },
      ], { x, y: 0.03, w: tabW, h: 0.4, align: "center", lineSpacingMultiple: 0.95, objectName: "탭 활성" });
    } else {
      T(slide, t, { x, y: 0.03, w: tabW, h: 0.4, fontSize: 11, color: COL.navOff, align: "center", objectName: "탭 " + (i + 1) });
    }
  });

  // ── 제목부
  T(slide, "경사 · 맨땅 · 폭우, 고랭지 밭의 세 가지 조건", {
    x: 1.5, y: 0.82, w: 10.333, h: 0.36, fontSize: 14, color: COL.sub, align: "center", objectName: "부제",
  });
  T(slide, "그러나 고랭지 농업에는 환경적 취약성이 존재합니다", {
    x: 1.5, y: 1.18, w: 10.333, h: 0.5, fontSize: 22, bold: true, color: COL.ink, align: "center", objectName: "제목",
  });

  // ── Venn (그림자 → 원 3개 → 라벨 → 중앙 태그)
  slide.addImage({ path: path.join(__dirname, "venn_shadow.png"), x: 0.575, y: 2.0, w: 5.55, h: 5.3289, altText: "장식용 그림자", objectName: "벤다이어그램 그림자" });
  const circles = [
    { c: A, color: COL.light, name: "경사 원" },
    { c: B, color: COL.mid, name: "맨땅 원" },
    { c: C, color: COL.dark, name: "폭우 원" },
  ];
  circles.forEach(({ c, color, name }) => {
    slide.addShape("ellipse", {
      x: c.x - V.r, y: c.y - V.r, w: V.r * 2, h: V.r * 2,
      fill: { color, transparency: 26 }, line: { color: "FFFFFF", width: 1.25, transparency: 30 }, objectName: name,
    });
  });

  const vLabel = (text, x, y, color, n) =>
    T(slide, text, { x: x - 0.6, y: y - 0.2, w: 1.2, h: 0.4, fontSize: 17, bold: true, color, align: "center", objectName: n });
  const LA = { x: A.x - 0.55, y: A.y - 0.15 };
  const LB = { x: B.x + 0.55, y: B.y - 0.15 };
  const LC = { x: C.x, y: C.y + 0.62 };
  vLabel("경사", LA.x, LA.y, "24361E", "경사 라벨");
  vLabel("맨땅", LB.x, LB.y, "FFFFFF", "맨땅 라벨");
  vLabel("폭우", LC.x, LC.y, "FFFFFF", "폭우 라벨");

  // 중앙 태그 (참고 슬라이드의 수치 라벨 박스 모티프)
  const tagW = 1.25, tagH = 0.6;
  slide.addShape("rect", {
    x: CENTROID.x - tagW / 2, y: CENTROID.y - tagH / 2 + 0.04, w: tagW, h: tagH,
    fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 0 },
    shadow: { type: "outer", color: "1E2A19", opacity: 0.25, blur: 6, offset: 2, angle: 90 },
    objectName: "중앙 태그",
  });
  T(slide, [
    { text: "토양유실", options: { breakLine: true } },
    { text: "위험 ↑" },
  ], {
    x: CENTROID.x - tagW / 2, y: CENTROID.y - tagH / 2 + 0.04, w: tagW, h: tagH,
    fontSize: 13, bold: true, color: COL.deep, align: "center", lineSpacingMultiple: 0.95, objectName: "중앙 태그 텍스트",
  });

  // ── 오른쪽: 조건별 근거 (참고 슬라이드의 사진+막대+수치 행 구조)
  const X0 = 6.9, XR = 12.75;
  const TILE = 0.85;
  const X1 = X0 + TILE + 0.22;
  const BAR_W = 3.45;
  const rows = [
    {
      hy: 2.2, num: "01", head: "경사가 클수록 물길이 생기기 쉽다",
      icon: tb.TbMountain, alt: "경사 아이콘",
      desc: "고랭지 밭은 경사 7% 이상인 곳이 많아 빗물 유실 위험이 큼",
      label: "국내 밭 중 경사 7% 이상 비율", value: 0.617, big: "61.7%",
      dot: { x: LA.x + 0.05, y: LA.y - 0.42 }, elbowDx: 0.6,
    },
    {
      hy: 3.8, num: "02", head: "땅이 덮여 있지 않으면 표토가 드러난다",
      icon: tb.TbPlantOff, alt: "맨땅(피복 부족) 아이콘",
      desc: "수확 후 작물이 사라지면 땅이 맨살로 노출됨 (피복 부족)",
      label: "고랭지 무밭, 파종 후 한 달간 땅을 덮은 비율", value: 0.09, big: "9%",
      dot: { x: LB.x + 0.05, y: LB.y + 0.38 }, elbowDx: 0.45,
    },
    {
      hy: 5.4, num: "03", head: "비가 강할수록 흙 알갱이가 쉽게 쓸린다",
      icon: tb.TbCloudRain, alt: "폭우 아이콘",
      desc: "수확 후 느슨해진 흙이 태풍·집중호우를 만나 쉽게 씻겨 내려감",
      label: "고랭지 채소 수확기 = 태풍이 잦은 시기", months: [8, 9], big: "8~9월",
      dot: { x: LC.x + 0.62, y: LC.y }, elbowDx: 0.55,
    },
  ];

  for (const r of rows) {
    const hc = r.hy + 0.16; // 헤딩 세로 중심
    T(slide, [
      { text: r.num + "  ", options: { bold: true, color: COL.dark } },
      { text: r.head, options: { bold: true, color: COL.ink } },
    ], { x: X0, y: r.hy, w: XR - X0, h: 0.32, fontSize: 14, objectName: `조건 ${r.num} 제목` });

    leader(slide, r.dot, { x: r.dot.x + r.elbowDx, y: hc }, X0 - 0.12, `조건 ${r.num} 지시선`);

    const ty = r.hy + 0.44;
    slide.addShape("rect", {
      x: X0, y: ty, w: TILE, h: TILE, fill: { color: COL.dark }, line: { color: COL.dark, width: 0 },
      objectName: `조건 ${r.num} 아이콘 타일`,
    });
    slide.addImage({ data: await icon(r.icon, "FFFFFF"), x: X0 + 0.19, y: ty + 0.19, w: 0.47, h: 0.47, altText: r.alt, objectName: `조건 ${r.num} 아이콘` });

    T(slide, r.desc, { x: X1, y: ty - 0.02, w: XR - X1, h: 0.26, fontSize: 10.5, color: COL.body, objectName: `조건 ${r.num} 설명` });
    T(slide, r.label, { x: X1, y: ty + 0.3, w: BAR_W, h: 0.2, fontSize: 9, bold: true, color: COL.dark, objectName: `조건 ${r.num} 지표명` });

    const by = ty + 0.58;
    if (r.months) {
      const gap = 0.035;
      const sw = (BAR_W - gap * 11) / 12;
      for (let m = 1; m <= 12; m++) {
        const on = r.months.includes(m);
        const sx = X1 + (m - 1) * (sw + gap);
        slide.addShape("rect", {
          x: sx, y: by, w: sw, h: 0.1, fill: { color: on ? COL.dark : COL.track }, line: { color: on ? COL.dark : COL.track, width: 0 },
          objectName: `${m}월 칸`,
        });
        T(slide, String(m), {
          x: sx - 0.05, y: by + 0.12, w: sw + 0.1, h: 0.14, fontSize: 7, bold: on, color: on ? COL.dark : COL.faint, align: "center", objectName: `${m}월 라벨`,
        });
      }
    } else {
      slide.addShape("rect", { x: X1, y: by, w: BAR_W, h: 0.1, fill: { color: COL.track }, line: { color: COL.track, width: 0 }, objectName: `조건 ${r.num} 막대 트랙` });
      slide.addShape("rect", { x: X1, y: by, w: BAR_W * r.value, h: 0.1, fill: { color: COL.dark }, line: { color: COL.dark, width: 0 }, objectName: `조건 ${r.num} 막대` });
    }
    T(slide, r.big, {
      x: X1 + BAR_W + 0.1, y: by - 0.24, w: XR - (X1 + BAR_W + 0.1), h: 0.46,
      fontSize: 20, bold: true, color: COL.deep, align: "right", objectName: `조건 ${r.num} 수치`,
    });
  }

  // ── 출처
  T(slide, "자료: 농촌진흥청(2015) 국내 밭 경사도 현황, 이정태 외(2011) 고랭지 무밭 피복률, 고랭지 채소 수확기(8~9월)·태풍 발생 시기 참고", {
    x: X0, y: 6.88, w: XR - X0, h: 0.3, fontSize: 7.5, color: COL.faint, valign: "top", objectName: "출처",
  });

  slide.addNotes(
    "고랭지 밭은 경사, 맨땅(피복 부족), 폭우라는 세 가지 조건이 겹치는 곳입니다. " +
    "국내 밭의 61.7%가 경사 7% 이상이고, 고랭지 무밭은 파종 후 한 달간 땅을 덮은 비율이 9%에 불과하며, " +
    "채소 수확기인 8~9월은 태풍과 집중호우가 잦은 시기와 겹칩니다. 세 조건이 겹치면서 토양유실 위험이 커집니다."
  );

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
