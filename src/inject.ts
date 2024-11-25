import { get, toggle } from "./lib"
;(async () => {
  const opts = await get()
  toggle(opts)
})()
