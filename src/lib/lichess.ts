import type { Color, Opts, Side } from "."

function clock(side: Side, active?: boolean) {
  const $el = document.querySelector<HTMLElement>(`.ruser-${side} rating`)
  if ($el) $el.style.display = active ? "none" : ""
}

function panel(color: Color, active?: boolean) {
  const selector = `.game__meta__players .${color} .user-link `
  const $mask = document.querySelector<HTMLElement>(`${selector} span#hiderat`)
  if (!$mask) {
    const $el = document.querySelector<HTMLElement>(selector)
    if (!$el) return
    const expr = /\(\d+\)/
    const match = $el.innerHTML.match(expr)
    if (!match) return
    $el.innerHTML = $el.innerHTML.replace(
      expr,
      `<span id="hiderat" style="${active ? "display: none;" : ""}">${match[0]}</span>`,
    )
  } else {
    $mask.style.display = active ? "none" : ""
  }
}

export function lichess(opts: Opts) {
  clock("top", opts.top)
  clock("bottom", opts.btm)

  // assume white on top?
  panel("white", opts.top)
  panel("black", opts.btm)
}
