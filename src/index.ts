import type { Config as SvgoConfig } from 'svgo'
import { downloadProjects } from './fetch'
import { logResult, deduplateIcons, mergeOptions } from './helper'
import { tryOptimizeIcon } from './optimize'
import { writeDTS } from './dts'
import type { Options, IconifyOptions, DTSOptions } from './types'
import { writeIconify } from './iconify'
import path from 'node:path'
import { writeFile } from './helper'

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
  ignoreIconPrefix: true
}

export async function iconfonter(options: Options) {
  const opts = mergeOptions<Options>(options, DEFAULT_OPTIONS as Options)
  const projectInfos = await downloadProjects(opts.projects, opts.cookie)
  const iconsRaw = deduplateIcons(projectInfos.map(project => 
    project.icons.map(icon => ({ 
      ...icon, 
      name: options.ignoreIconPrefix 
        ? icon.font_class 
        : `${project.project.prefix || ''}${icon.font_class}` 
    }))
  ).flat())
  const icons = opts.optimize 
    ? iconsRaw.map(icon => tryOptimizeIcon(icon, opts.optimize as SvgoConfig)) 
    : iconsRaw
  await Promise.all(icons.map(icon =>
    writeFile(path.resolve(process.cwd(), opts.dir!, `${icon.name}.svg`), icon.show_svg)
  ))
  opts.dts && await writeDTS(icons, opts.dts)
  opts.iconify && await writeIconify(
    icons,
    typeof opts.iconify === 'object' ? mergeOptions(opts.iconify, DEFAULT_ICONIFY) : DEFAULT_ICONIFY 
  )
  logResult(iconsRaw, opts.optimize ? icons : undefined)
}

export function defineConfig(config: Options) {
  return config
}
