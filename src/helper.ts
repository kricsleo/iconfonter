import { promises as fs } from 'fs'
import path from 'path'
import c from 'picocolors'
import { pathToFileURL } from 'url'
import type { Icon, Options } from './types'

export function deduplateIcons(icons: Icon[]) {
  const iconMap = new Map<string, Icon>()
  const uniqueIcons = icons.filter(icon => {
    if(iconMap.has(icon.font_class)) {
      console.warn(c.bgGreen(' Iconfonter '), c.yellow(`Found duplate icon \`${icon.font_class}\` between projects ${iconMap.get(icon.font_class)!.project_id} and ${icon.project_id}, using the former.`))
      return false
    }
    iconMap.set(icon.font_class, icon)
    return true
  })
  return uniqueIcons
}

export function logResult(icons: Icon[], optimizedIcons?: Icon[]) {
  if (optimizedIcons) {
    const [optimizedSize, size] = [optimizedIcons, icons].map(t =>
      t.reduce((total, cur) => total + cur.show_svg.length, 0),
    )
    const minifiedRatio = `${((1 - optimizedSize / size) * 100).toFixed(2)}%`
    console.log(c.bgGreen(' Iconfonter '), c.green(`${icons.length} icons downloaded. Minified by ${minifiedRatio} 🎉`))
  }
  else {
    console.log(c.bgGreen(' Iconfonter '), c.green(`${icons.length} icons downloaded 🎉`))
  }
}

export async function writeFile(filePath: string, content: string) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(filePath, content)
}

export async function readConfig(configFile: string) {
  let configFilePath: string
  if (path.isAbsolute(configFile)) {
    configFilePath = configFile;
  } else {
    configFilePath = path.join(process.cwd(), configFile);
  }
  const configFileURL = pathToFileURL(configFilePath).toString()
  let config: Options = (await import(configFileURL)).default;
  if (typeof config !== 'object') {
    throw Error(`Invalid config file "${configFilePath}"`);
  }
  return config;
};

export async function writeIcon(icon: Icon, options: Options) {
  await writeFile(path.resolve(options.dir!, `${icon.font_class}.svg`), icon.show_svg)
}

export function mergeOptions<T extends { [k: string]: any }>(
  options: T,
  defaultOptions: T,
): T {
  const merged = { ...options }
  Object.entries(defaultOptions).forEach(([k, v]: [keyof T, any]) => {
    const type = typeof merged[k]
    merged[k] = type === 'object'
      ? mergeOptions(merged[k], v)
      : type === 'undefined'
        ? v
        : merged[k]
  })
  return merged
}
