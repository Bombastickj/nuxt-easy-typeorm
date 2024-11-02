import fs from 'node:fs'
import { defineNuxtModule, createResolver, addServerImports, addServerImportsDir, addImportsDir } from '@nuxt/kit'
import { defu } from 'defu'
import { NUXT_EASY_TYPEORM_MODULE_ID, DEFAULT_OPTIONS } from './constants'
import type { NuxtEasyTypeORMOptions } from './types'

export * from './types'

export default defineNuxtModule<NuxtEasyTypeORMOptions>({
  meta: {
    name: NUXT_EASY_TYPEORM_MODULE_ID,
    configKey: 'typeorm',
    compatibility: {
      bridge: false,
    },
  },
  defaults: DEFAULT_OPTIONS,
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)
    // const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // setup typescript
    _nuxt.options.typescript = _nuxt.options.typescript || {}
    _nuxt.options.typescript.tsConfig = _nuxt.options.typescript.tsConfig || {}
    _nuxt.options.typescript.tsConfig.compilerOptions = defu(_nuxt.options.typescript.tsConfig.compilerOptions, {
      strictPropertyInitialization: false,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    })
    _nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.esbuild = nitroConfig.esbuild || {}
      nitroConfig.esbuild.options = nitroConfig.esbuild.options || {}
      nitroConfig.esbuild.options.tsconfigRaw = '{ "compilerOptions": { "experimentalDecorators": true } }'

      // Add typeorm package (auto-imports)
      nitroConfig.imports = nitroConfig.imports || {}
      nitroConfig.imports.presets = nitroConfig.imports.presets || []
      nitroConfig.imports.presets.push({ package: 'typeorm', ignore: ['default'] })
    })
    _nuxt.hook('nitro:build:before', (nitro) => {
      nitro.options.moduleSideEffects.push('reflect-metadata')
    })

    // Add defineDataSource composable
    addServerImports([
      {
        from: resolve('runtime/server/composables/defineDataSource'),
        name: 'defineDataSource',
      },
    ])

    // Go through each layer and find the typeorm directory
    const _layers = [..._nuxt.options._layers].reverse()
    for (const layer of _layers) {
      const rootDir = layer.config.rootDir
      const mabeFolder = resolve(rootDir, layer.config.typeorm?.srcDir || _options.srcDir)
      const dirStat = await fs.promises.stat(mabeFolder).catch(() => null)
      if (dirStat && dirStat.isDirectory()) {
        // Add typeorm directory to nitro (auto-imports)
        addServerImportsDir(`${mabeFolder}/**`)

        // Add typeorm directory to app (auto-imports)
        addImportsDir(mabeFolder)
      }
    }
  },
})
