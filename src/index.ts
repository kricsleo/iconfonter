import type { Config as SvgoConfig } from 'svgo'
import { downloadProjects } from './fetch'
import { logResult, varifyDuplicateIcon } from './helper'
import { tryOptimizeIcon } from './optimize'
import { writeDTS } from './dts'
import type { Options, IconifyOptions, DTSOptions, Icon } from './types'
import { writeIconify } from './iconify'
import path from 'pathe'
import { writeFile } from './helper'
import { defu } from 'defu'

const DEFAULT_OPTIMIZE: SvgoConfig = {}

const DEFAULT_DTS: DTSOptions = {
  name: 'IconName',
  path: 'icon.d.ts',
}

const DEFAULT_ICONIFY: IconifyOptions = {
  prefix: 'i:',
  width: 24,
  height: 24,
  path: 'iconify.json',
}

const DEFAULT_OPTIONS: Partial<Options> = {
  dir: 'icons',
  optimize: DEFAULT_OPTIMIZE,
  dts: DEFAULT_DTS,
  iconify: false,
}

export async function iconfonter(options: Options) {
  const opts = defu(options, DEFAULT_OPTIONS)
  const { projects, cookie, optimize, dts, iconify } = opts

  const projectInfos: Array<{ icons: Icon[] }> = await downloadProjects(projects, cookie)
  const iconsRaw = projectInfos.map(project => project.icons).flat()

  varifyDuplicateIcon(iconsRaw)

  const icons = optimize
    ? iconsRaw.map(icon => tryOptimizeIcon(icon, optimize))
    : iconsRaw

  await Promise.all(icons.map(icon => 
    writeFile(path.resolve(options.dir!, `${icon.font_class}.svg`), icon.show_svg)
  ))

  dts && await writeDTS(icons, dts)

  iconify && await writeIconify(
    icons,
    typeof iconify === 'object' ? defu(iconify, DEFAULT_ICONIFY) : DEFAULT_ICONIFY 
  )
  logResult(iconsRaw, optimize ? icons : undefined)
}

export function defineConfig(config: Options) {
  return config
}
