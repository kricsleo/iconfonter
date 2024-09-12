import fs from 'node:fs/promises'
import type { Icon, IconifyOptions } from './types'
import { writeFile } from './helper'

export async function writeIconify(icons: Icon[], options: IconifyOptions) {
  const iconJson = icons.reduce((all, icon) => {
    all[icon.name] = { body: icon.show_svg }
    return all
  }, {} as Record<string, { body: string }>)
  const iconifyJson = {
    ...options,
    icons: iconJson,
  }
  delete iconifyJson.path
  await Promise.all([
    writeFile(options.path!, JSON.stringify(iconifyJson, null, 2) + '\r\n'),
    updateVSCodeSetting(options),
  ])
}

export async function updateVSCodeSetting(options: IconifyOptions) {
  const ICONIFY_KEY = 'iconify.customCollectionJsonPaths'
  const SETTING_PATH = '.vscode/settings.json'
  let settings: Record<string, string[]>
  try {
    settings = JSON.parse(await fs.readFile(SETTING_PATH, 'utf-8'))
    if (settings[ICONIFY_KEY].includes(options.path!))
      return
    else
      settings[ICONIFY_KEY].push(options.path!)
  }
  catch {
    // can't find settings.json
    settings = { [ICONIFY_KEY]: [options.path!] }
  }
  await writeFile(SETTING_PATH, JSON.stringify(settings, null, 2) + '\r\n')
}
