import type { Icon } from './helper'
import { writeFile } from './helper'

export interface TSOptions {
  name?: string
  path?: string
}

export async function writeTS(icons: Icon[], options: TSOptions) {
  const names = icons.map(icon => `\r\n  | '${icon.font_class}'`).join('')
  const typeName = options.name || 'IconName'
  const content = `export type ${typeName} = ${names}`
  await writeFile(options.path!, content)
}
