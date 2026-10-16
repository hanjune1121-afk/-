# 이미지 소스 (수정·재렌더링용)

- `pages/*.html`: 이미지 한 장당 HTML 한 개. 문구·가격은 여기서 수정
- `assets/products.js`: 제품 패키지·음식 일러스트 (SVG)
- `assets/brand.css`: 컬러(#FCCA03 / #111111)·폰트 설정

## 다시 렌더링하기
1. `_source/` 옆에 `fonts/` 폴더를 만들고 Google Fonts의 Black Han Sans, Noto Sans KR(400/500/700/900) TTF를
   `BlackHanSans.ttf`, `NotoKR-400.ttf` … 이름으로 넣기 (`assets/brand.css`가 `../../fonts/`를 참조)
2. `node render.js pages/06_매대.html` → `out/`에 PNG 생성 (Playwright 필요)
