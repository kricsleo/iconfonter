import type { OptimizeOptions } from 'svgo'
import { downloadProjects } from './fetch'
import type { Icon } from './helper'
import { logResult, mergeOptions, varifyDuplicateIcon } from './helper'
import { optimizeIcons, writeIcons } from './svg'
import type { TSOptions } from './ts'
import { writeTS } from './ts'
import type { IconifyOptions } from './iconify'
import { writeIconify } from './iconify'

export interface Options {
  /**
   * Iconfont project ids.
   */
  projects: string[]
  /**
   * Iconfont cookie.
   *
   * https://www.iconfont.cn/
   */
  cookie: string
  /**
   * Local icon dir.
   *
   * @default icons
   */
  dir?: string
  /**
   * If optimize icon.
   *
   * @default [DEFAULT_OPTIMIZE]
   */
  optimize?: false | OptimizeOptions
  /**
   * If generate ts interface file.
   *
   * @default [DEFAULT_TS]
   */
  ts?: false | TSOptions
  /**
   * If generate iconify configs.
   * @see https://github.com/antfu/vscode-iconify
   *
   * @default false
   */
  iconify?: boolean | IconifyOptions
}

const DEFAULT_OPTIMIZE: OptimizeOptions = {
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: '(class)',
      },
    },
  ],
}

const DEFAULT_TS: TSOptions = {
  name: 'IconName',
  path: 'icon.ts',
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
  ts: DEFAULT_TS,
  iconify: false,
}

export async function iconfonter(options: Options) {
  const opts = mergeOptions<Options>(options, DEFAULT_OPTIONS as Options)
  const { projects, cookie, optimize, ts, iconify } = opts

  const projectInfos: Array<{ icons: Icon[] }> = await downloadProjects(projects, cookie)
  const iconsRaw = projectInfos.map(project => project.icons).flat()

  varifyDuplicateIcon(iconsRaw)

  const icons = optimize
    ? optimizeIcons(iconsRaw, optimize)
    : iconsRaw

  await writeIcons(icons, opts)

  ts && await writeTS(icons, ts)

  iconify && await writeIconify(
    icons,
    iconify === true ? DEFAULT_ICONIFY : mergeOptions(iconify, DEFAULT_ICONIFY),
  )

  logResult(iconsRaw, optimize ? icons : undefined)
}
