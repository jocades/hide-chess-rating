// src/opts.ts
async function get() {
  return (await chrome.storage.sync.get("opts")).opts;
}
async function set(opts) {
  await chrome.storage.sync.set({ opts });
}
async function toggle(opts) {
  console.log("tab", opts);
  if (location.href.startsWith("https://lichess.org")) {
    const $top = document.querySelector(".ruser-top rating");
    console.log($top);
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
  if (location.href.startsWith("https://www.chess.com")) {
    const $top = document.querySelector(".player-top");
    console.log("-> top", $top);
    const observer = new MutationObserver((muts) => {
      muts.forEach((mut) => {
        if (!mut.addedNodes)
          return;
        mut.addedNodes.forEach((node) => {
          console.log("-> added", node);
        });
      });
    });
    observer.observe($top, {
      childList: true,
      subtree: true
    });
    const $btm = document.querySelector(".player-bottom .rating-score-rating");
    console.log("-> btm", $btm);
  }
}

// src/main.ts
(async () => {
  const opts = await get();
  console.log("-> rat init", opts);
  toggle(opts);
})();
