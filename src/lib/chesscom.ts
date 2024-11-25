import type { Opts, Side } from "."

function css(side: Side, active?: boolean) {
  return `.player-${side} [class*=rating] { 
    display: ${active ? "none" : "flex"}; 
  }`
}

export function chesscom(opts: Opts) {
  const apply = (style: HTMLStyleElement) => {
    style.innerHTML = css("top", opts.top)
    style.innerHTML += css("bottom", opts.btm)
  }

  const existing = document.head.querySelector<HTMLStyleElement>("style#hiderat")
  if (!existing) {
    const style = document.createElement("style")
    style.id = "hiderat"
    apply(style)
    document.head.appendChild(style)
  } else {
    apply(existing)
  }
}
