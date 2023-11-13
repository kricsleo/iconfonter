import type { Config as SvgoConfig } from 'svgo'
import { optimize } from 'svgo'
import type { Icon } from './types'
import chalk from 'chalk'

export function tryOptimizeIcon(icon: Icon,  options?: SvgoConfig) {
  try {
    const optimized = optimize(icon.show_svg, options)
    return { ...icon, show_svg: optimized.data }
  } catch(e) {
    chalk.red(`Optimize icon ${icon.font_class} error, ignore optimize.`, e)
    return icon
  }
}

