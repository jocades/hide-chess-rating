export interface Opts {
  top?: boolean
  btm?: boolean
}

export async function get() {
  return (await chrome.storage.sync.get("opts")).opts as Opts
}

export async function set(opts: Opts) {
  await chrome.storage.sync.set({ opts })
}

const map: Record<string, (opts: Opts) => void> = {
  ["https://lichess.org"]: lichess,
  ["https://www.chess.com"]: chesscom,
}

export function toggle(opts: Opts) {
  const site = Object.keys(map).find((k) => location.href.startsWith(k))
  if (!site) return
  map[site](opts)
}

function lichess(opts: Opts) {
  const $top = document.querySelector<HTMLElement>(".ruser-top rating")
  if ($top) $top.style.display = opts.top ? "none" : "flex"

  const $btm = document.querySelector<HTMLElement>(".ruser-bottom rating")
  if ($btm) $btm.style.display = opts.btm ? "none" : "flex"
}

function chesscom(opts: Opts) {
  const css = (side: "top" | "bottom", active?: boolean) => `
      .player-${side} [class*=rating] { 
        display: ${active ? "none" : "flex"}; 
      }`

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
