import type { OptimizeOptions } from 'svgo'
import { downloadProjects } from './fetch'
import { logResult, mergeOptions, varifyDuplicateIcon } from './helper'
import { optimizeIcons, writeIcons } from './svg'
import { writeDTS } from './ts'
import type { Options, IconifyOptions, DTSOptions, Icon } from './types'
import { writeIconify } from './iconify'

const DEFAULT_OPTIMIZE: OptimizeOptions = {}

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
  const opts = mergeOptions<Options>(options, DEFAULT_OPTIONS as Options)
  const { projects, cookie, optimize, dts, iconify } = opts

  const projectInfos: Array<{ icons: Icon[] }> = await downloadProjects(projects, cookie)
  const iconsRaw = projectInfos.map(project => project.icons).flat()

  varifyDuplicateIcon(iconsRaw)

  const icons = optimize
    ? optimizeIcons(iconsRaw, optimize)
    : iconsRaw

  await writeIcons(icons, opts)
  dts && await writeDTS(icons, dts)

  iconify && await writeIconify(
    icons,
    iconify === true ? DEFAULT_ICONIFY : mergeOptions(iconify, DEFAULT_ICONIFY),
  )
  logResult(iconsRaw, optimize ? icons : undefined)
}

export function defineConfig(config: Options) {
  return config
}
