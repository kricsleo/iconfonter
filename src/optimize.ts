import type { Config as SvgoConfig } from 'svgo'
import { optimize } from 'svgo'
import type { Icon } from './types'
import c from 'picocolors'

export function tryOptimizeIcon(icon: Icon,  options?: SvgoConfig) {
  try {
    const optimized = optimize(icon.show_svg, options)
    return { ...icon, show_svg: optimized.data }
  } catch(e) {
    console.error(c.red(`Optimize icon ${icon.font_class} error, ignore optimize.`), e)
    return icon
  }
}

