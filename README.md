# Iconfonter

Download icons on [iconfont](https://www.iconfont.cn/) with your iconfont cookie, and generate TS interface, iconify configs, and so on.

## Feature

- <span style="font-size: 20px">🔍</span> Download icons in svg format
- <span style="font-size: 20px">⚙️</span> Optimize svg by [svgo](https://github.com/svg/svgo)
- <span style="font-size: 20px">☕</span> Auto-Generate TS interface
- <span style="font-size: 20px">😃</span> Support [iconify](https://github.com/antfu/vscode-iconify) extension

## Usage

### Use With CLi

1. Create a config file named `iconfonter.config.js` in the root directory like this:
(Or custom the filename and path yourself)

```ts
module.exports = {
  projects: ['<your_project_id_1>', '<your_project_id_2>'],
  cookie: '<your_iconfont_cookie>',
  // ...
}

```

2. Run CLI as follows:

```bash
npx iconfonter

# If a custom config filename or path is used,
# it can be specified as an argument
# npx iconfonter <custom_config_file>
```

### Use With Package

```bash
npm i -D iconfonter
```

```ts
import { iconfonter } from 'iconfonter'

iconfonter({
  projects: ['<your_project_id_1>', '<your_project_id_2>'],
  cookie: '<your_iconfont_cookie>',
  // ...
})
```

### API

By default, `dts` and `optimize` are enabled, but `iconify` is not.

```ts
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
   * @see https://github.com/svg/svgo
   */
  optimize?: false | OptimizeOptions
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
```

### Iconify

If you want to use it with [iconify](https://github.com/antfu/vscode-iconify) extension, just set `iconify: true` or a custom config. (Don't forget to install [iconify](https://github.com/antfu/vscode-iconify))

<p align="center">
  <img src="https://raw.githubusercontent.com/antfu/vscode-iconify/main/screenshots/preview-1.png" alt="iconify 预览" />
</p>

### Q & A

- What's my project id?

Login in [iconfont](https://www.iconfont.cn) -> Go to your project -> Copy the `projectId` param in the location bar

- What's my cookie?

Login in [iconfont](https://www.iconfont.cn) -> Open browser DevTool -> Copy `cookie` from Request-Headers in any request

### PR Welcome

## License

[MIT](./LICENSE) License © 2022 [Krcisleo](https://github.com/krcisleo)
