// src/lib.ts
async function get() {
  return (await chrome.storage.sync.get("opts")).opts;
}
async function set(opts) {
  await chrome.storage.sync.set({ opts });
}
var siteMap = {
  ["https://lichess.org"]: lichess,
  ["https://www.chess.com"]: chesscom
};
function toggle(opts) {
  const site = Object.keys(siteMap).find(location.href.startsWith);
  if (!site)
    return;
  siteMap[site](opts);
}
function lichess(opts) {
  const $top = document.querySelector(".ruser-top rating");
  if ($top)
    $top.style.display = opts.top ? "none" : "flex";
  const $btm = document.querySelector(".ruser-bottom rating");
  if ($btm)
    $btm.style.display = opts.btm ? "none" : "flex";
}
function chesscom(opts) {
  const css = (side, active) => `
      .player-${side} [class*=rating] { 
        display: ${active ? "none" : "block"}; 
      }`;
  const apply = (style) => {
    style.innerHTML = css("top", opts.top);
    style.innerHTML += css("bottom", opts.btm);
  };
  const existing = document.head.querySelector("style#hiderat");
  if (!existing) {
    const style = document.createElement("style");
    style.id = "hiderat";
    apply(style);
    document.head.appendChild(style);
  } else {
    apply(existing);
  }
}

// src/popup.ts
var opts = {};
var $form = document.querySelector("form");
$form.addEventListener("change", async (e) => {
  opts[e.target.name] = e.target.checked;
  await set(opts);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id)
    return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggle,
    args: [opts]
  });
});
Object.assign(opts, await get());
$form.top.checked = !!opts.top;
$form.btm.checked = !!opts.btm;
