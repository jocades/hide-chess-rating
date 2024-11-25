// src/lib/lichess.ts
function clock(side, active) {
  const $el = document.querySelector(`.ruser-${side} rating`);
  if ($el)
    $el.style.display = active ? "none" : "";
}
function panel(color, active) {
  const $mask = document.querySelector(`.game__meta__players .${color} .user-link span#hiderat`);
  if (!$mask) {
    const $el = document.querySelector(`.game__meta__players .${color} .user-link`);
    if (!$el)
      return;
    const expr = /\(\d+\)/;
    const match = $el.innerHTML.match(expr);
    if (!match)
      return;
    $el.innerHTML = $el.innerHTML.replace(expr, `<span id="hiderat" style="${active ? "display: none;" : ""}">${match[0]}</span>`);
  } else {
    $mask.style.display = active ? "none" : "";
  }
}
function lichess(opts) {
  clock("top", opts.top);
  clock("bottom", opts.btm);
  panel("white", opts.top);
  panel("black", opts.btm);
}

// src/lib/chesscom.ts
function css(side, active) {
  return `.player-${side} [class*=rating] { 
    display: ${active ? "none" : "flex"}; 
  }`;
}
function chesscom(opts) {
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

// src/lib/index.ts
async function get() {
  return (await chrome.storage.sync.get("opts")).opts;
}
async function set(opts) {
  await chrome.storage.sync.set({ opts });
}
var map = {
  ["https://lichess.org"]: lichess,
  ["https://www.chess.com"]: chesscom
};
function toggle(opts) {
  const site = Object.keys(map).find((k) => location.href.startsWith(k));
  if (!site)
    return;
  map[site](opts);
}

// src/inject.ts
(async () => {
  const opts = await get();
  toggle(opts);
})();
