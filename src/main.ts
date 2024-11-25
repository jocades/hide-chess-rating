import { get, toggle } from "./opts"
;(async () => {
  const opts = await get()
  console.log("-> rat init", opts)
  toggle(opts)
})()
