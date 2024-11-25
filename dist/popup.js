// src/opts.ts
async function get() {
  return (await chrome.storage.sync.get("opts")).opts;
}
async function set(opts) {
  await chrome.storage.sync.set({ opts });
}
function toggle(opts) {
  if (location.href.startsWith("https://lichess.org"))
    lichess(opts);
  else if (location.href.startsWith("https://www.chess.com"))
    chesscom(opts);
}
function lichess(opts) {
  const $top = document.querySelector(".ruser-top rating");
  if (opts.top)
    $top.style.display = "none";
  else
    $top.style.display = "flex";
  const $btm = document.querySelector(".ruser-bottom rating");
  if (opts.btm)
    $btm.style.display = "none";
  else
    $btm.style.display = "flex";
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
  const existing = document.head.querySelector("style#rmrating");
  if (!existing) {
    const style = document.createElement("style");
    style.id = "rmrating";
    apply(style);
    document.head.appendChild(style);
  } else {
    apply(existing);
  }
  console.log(document.querySelector("style #rmrating"));
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
