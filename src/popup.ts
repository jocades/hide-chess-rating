import { get, set, toggle, type Opts } from "./opts"

const opts: Opts = {}
const $form = document.querySelector("form")!

$form.addEventListener("change", async (e) => {
  // @ts-ignore
  opts[e.target.name] = e.target.checked
  await set(opts)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab.id) return
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggle,
    args: [opts],
  })
})

Object.assign(opts, await get())
$form.top.checked = !!opts.top
$form.btm.checked = !!opts.btm
