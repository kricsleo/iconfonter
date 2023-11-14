import type { Config as SvgoConfig } from 'svgo'
import { downloadProjects } from './fetch'
import { logResult, deduplateIcons } from './helper'
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
  const projectInfos: Array<{ icons: Icon[] }> = await downloadProjects(opts.projects, opts.cookie)
  const iconsRaw = deduplateIcons(projectInfos.map(project => project.icons).flat())
  const icons = opts.optimize 
    ? iconsRaw.map(icon => tryOptimizeIcon(icon, opts.optimize as SvgoConfig)) 
    : iconsRaw
  await Promise.all(icons.map(icon => 
    writeFile(path.resolve(process.cwd(), opts.dir!, `${icon.font_class}.svg`), icon.show_svg)
  ))
  opts.dts && await writeDTS(icons, opts.dts)
  opts.iconify && await writeIconify(
    icons,
    typeof opts.iconify === 'object' ? defu(opts.iconify, DEFAULT_ICONIFY) : DEFAULT_ICONIFY 
  )
  logResult(iconsRaw, opts.optimize ? icons : undefined)
}

export function defineConfig(config: Options) {
  return config
}
