import type { DTSOptions, Icon } from './types'
import { writeFile } from './helper'

export async function writeDTS(icons: Icon[], options: DTSOptions) {
  const names = icons.map(icon => `\r\n  | '${icon.name}'`).join('')
  const typeName = options.name || 'IconName'
  const prefix = options.path!.endsWith('.d.ts') ? '' : 'export '
  const content = `${prefix}type ${typeName} =${names}` + '\r\n'
  await writeFile(options.path!, content)
}
