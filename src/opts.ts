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

export function toggle(opts: Opts) {
  if (location.href.startsWith("https://lichess.org")) lichess(opts)
  else if (location.href.startsWith("https://www.chess.com")) chesscom(opts)
}

function lichess(opts: Opts) {
  const $top = document.querySelector<HTMLElement>(".ruser-top rating")!
  if (opts.top) $top.style.display = "none"
  else $top.style.display = "flex"

  const $btm = document.querySelector<HTMLElement>(".ruser-bottom rating")!
  if (opts.btm) $btm.style.display = "none"
  else $btm.style.display = "flex"
}

function chesscom(opts: Opts) {
  const css = (side: "top" | "bottom", active?: boolean) => `
      .player-${side} [class*=rating] { 
        display: ${active ? "none" : "block"}; 
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
