import path from 'path'
import type { OptimizeOptions, OptimizedSvg } from 'svgo'
import { optimize } from 'svgo'
import type { Icon } from './helper'
import { warn, writeFile } from './helper'
import type { Options } from '.'

export function optimizeIcons(icons: Icon[], options?: OptimizeOptions) {
  const optimizedIcons = icons.map((icon) => {
    const optimized = optimize(icon.show_svg, options)
    if (optimized.error) {
      warn(`Optimize icon [${icon.font_class}] error, ignore optimize.`, optimized.error)
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
