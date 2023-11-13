import type { Config as SvgoConfig } from "svgo"

export interface Icon {
  font_class: string
  show_svg: string
  project_id: string
}

export interface DTSOptions {
  name?: string
  path?: string
}


export interface IconifyOptions {
  prefix?: string
  width?: number
  height?: number
  path?: string
}

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
  optimize?: false | SvgoConfig
  /**
   * If generate ts interface file.
   *
   * @default [DEFAULT_TS]
   */
  dts?: false | DTSOptions
  /**
   * If generate iconify configs.
   * @see https://github.com/antfu/vscode-iconify
   *
   * @default false
   */
  iconify?: boolean | IconifyOptions
}
