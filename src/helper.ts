import { promises as fs } from 'fs'
import path from 'path'
import chalk from 'chalk'
import { pathToFileURL } from 'url'
import type { Icon, Options } from './types'

export function varifyDuplicateIcon(icons: Icon[]) {
  const iconMap = icons.reduce((all, icon) => {
    (all[icon.font_class] ||= []).push(icon.project_id)
    return all
  }, {} as Record<string, string[]>)
  Object.entries(iconMap).filter(t => t[1].length > 1)
    .forEach(t => console.warn(chalk.yellow(`Found duplicate icon '${t[0]}' between projects ${t[1]}.`)))
}

export function logResult(icons: Icon[], optimizedIcons?: Icon[]) {
  if (optimizedIcons) {
    const [optimizedSize, size] = [optimizedIcons, icons].map(t =>
      t.reduce((total, cur) => total + cur.show_svg.length, 0),
    )
    const minifiedRatio = `${((1 - optimizedSize / size) * 100).toFixed(2)}%`
    console.log(chalk.green.bold(`${icons.length} icons downloaded. Minified by ${minifiedRatio} 🎉`))
  }
  else {
    console.log(chalk.green.bold(`${icons.length} icons downloaded 🎉`))
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