import { iconfonter } from ".";
import { readConfig } from './helper'

;(async function() {
  const config = await readConfig()
  await iconfonter(config)
})()
