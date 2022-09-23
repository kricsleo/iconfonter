# Iconfonter

Download icons in [iconfont](https://www.iconfont.cn/) using your iconfont cookie, and generate TS interface files, iconify files, and so on.

## Feature

- Download icons in svg format
- Optimize svg by [svgo](https://github.com/svg/svgo)
- Generate TS interface file
- Support [iconify](https://github.com/antfu/vscode-iconify) extension

## Usage

### Install

```bash
npm i -D iconfonter
```

### Use

```ts
import { iconfonter } from 'iconfonter'

iconfonter({
  projects: ['project_id1', 'project_id2'],
  cookie: 'your_iconfont_cookie'
  //...
})
```

By default, generating TS interface files is enabled, but iconify files are not enabled.

```ts
import { Options } from 'iconfonter'

// example of full options
// see `Options` interface for detail.
const options: Options = {
  projects: ['project_id1', 'project_id2'],
  cookie: 'your_iconfont_cookie',
  dir: 'icons',
  ts: {
    name: 'IconName',
    path: 'icon.ts',
  },
  optimize: {
    plugins: [
      {
        name: 'removeAttrs',
        params: {
          attrs: '(style|class|version)',
        },
      },
    ],
  },
  iconify: {
    prefix: 'i:',
    width: 24,
    height: 24,
    path: 'iconify.json',
  }
}
```

### Iconify

If you want to use it with [iconify](https://github.com/antfu/vscode-iconify) extension, just set `iconify: true` or custom config `iconify: {/**  */}`. (Don't forget to install [iconify](https://github.com/antfu/vscode-iconify))

<p align="center">
  <img src="https://raw.githubusercontent.com/antfu/vscode-iconify/main/screenshots/preview-1.png" alt="iconify 预览" />
</p>


### Q & A

- What's my project id?

Login in [iconfont](https://www.iconfont.cn) -> Go to your project -> Copy the `projectId` param in the location bar

- What's my cookie?

Login in [iconfont](https://www.iconfont.cn) -> Open browser DevTool -> Copy `cookie` from Request-Headers in any request

## License

[MIT](./LICENSE) License © 2022 [Krcisleo](https://github.com/krcisleo)
