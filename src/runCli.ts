import { iconfonter } from ".";
import { readConfig } from './helper'

const CONFIG_FILE_NAME = 'iconfonter.config.js'

;(async function() {
  const configFileName = process.argv[2] || CONFIG_FILE_NAME;
  const config = await readConfig(configFileName)
  await iconfonter(config)
})()
