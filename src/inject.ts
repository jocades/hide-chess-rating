import { get, toggle } from "./opts"
;(async () => {
  const opts = await get()
  toggle(opts)
})()
