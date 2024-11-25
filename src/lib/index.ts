import { lichess } from "./lichess"
import { chesscom } from "./chesscom"

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

export type Side = "top" | "bottom"
export type Color = "white" | "black"
