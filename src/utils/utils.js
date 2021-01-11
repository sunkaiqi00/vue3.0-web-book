export function px2rem(px) {
  const radio = 375 / 10
  return px / radio
}
export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
