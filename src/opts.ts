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

export async function toggle(opts: Opts) {
  console.log("tab", opts)

  if (location.href.startsWith("https://lichess.org")) {
    const $top = document.querySelector<HTMLElement>(".ruser-top rating")!
    console.log($top)
    if (opts.top) $top.style.display = "none"
    else $top.style.display = "flex"

    const $btm = document.querySelector<HTMLElement>(".ruser-bottom rating")!
    if (opts.btm) $btm.style.display = "none"
    else $btm.style.display = "flex"
  }

  if (location.href.startsWith("https://www.chess.com")) {
    const $top = document.querySelector<HTMLElement>(".player-top")!
    console.log("-> top", $top)
    // if (opts.top) $top.style.display = "none"
    // else $top.style.display = "block"

    const observer = new MutationObserver((muts) => {
      muts.forEach((mut) => {
        if (!mut.addedNodes) return
        mut.addedNodes.forEach((node) => {
          console.log("-> added", node)
        })
      })
    })

    observer.observe($top, {
      childList: true,
      subtree: true,
    })

    const $btm = document.querySelector<HTMLElement>(".player-bottom .rating-score-rating")!
    console.log("-> btm", $btm)
    // if (opts.btm) $btm.style.display = "none"
    // else $btm.style.display = "block"
  }
}
