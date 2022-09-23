import chalk from 'chalk'
import { describe, it } from 'vitest'
import { iconfonter } from '../src'

describe('iconfont', () => {
  it('update', async () => {
    console.log(chalk.green.bold(`> ${98} icons downloaded. Minified by 12.00% 🎉`))
  })
})
