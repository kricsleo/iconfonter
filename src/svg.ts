import path from 'path'
import type { OptimizeOptions, OptimizedSvg } from 'svgo'
import { optimize } from 'svgo'
import { writeFile } from './helper'
import type { Options, Icon } from './types'
import chalk from 'chalk'

export function optimizeIcons(icons: Icon[], options?: OptimizeOptions) {
  const optimizedIcons = icons.map((icon) => {
    const optimized = optimize(icon.show_svg, options)
    if (optimized.error) {
      console.log(chalk.yellow(`Optimize icon [${icon.font_class}] error, ignore optimize.`), optimized.error)
      return icon
    }
    else {
      return { ...icon, show_svg: (optimized as OptimizedSvg).data }
    }
  })
  return optimizedIcons
}

export async function writeIcons(icons: Icon[], options: Options) {
  await Promise.all(icons.map(icon => writeFile(
    path.resolve(options.dir!, `${icon.font_class}.svg`),
    icon.show_svg,
  )))
}
