import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/runCli',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
