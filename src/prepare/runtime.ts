import defu from 'defu'
import { addServerImports } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import type { NuxtEasyTypeORMContext } from '../context'

export function prepareRuntime(
  { resolver }: NuxtEasyTypeORMContext,
  nuxt: Nuxt,
) {
  // setup typescript
  nuxt.options.typescript = nuxt.options.typescript || {}
  nuxt.options.typescript.tsConfig = nuxt.options.typescript.tsConfig || {}
  nuxt.options.typescript.tsConfig.compilerOptions = defu(nuxt.options.typescript.tsConfig.compilerOptions, {
    strictPropertyInitialization: false,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    importHelpers: true,
  })
  nuxt.hook('nitro:config', (nitroConfig) => {
    nitroConfig.typescript = nitroConfig.typescript || {}
    nitroConfig.typescript.tsConfig = nitroConfig.typescript.tsConfig || {}
    nitroConfig.typescript.tsConfig.compilerOptions = defu(nitroConfig.typescript.tsConfig.compilerOptions, {
      strictPropertyInitialization: false,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      importHelpers: true,
    })

    nitroConfig.esbuild = nitroConfig.esbuild || {}
    nitroConfig.esbuild.options = nitroConfig.esbuild.options || {}
    nitroConfig.esbuild.options.tsconfigRaw = '{ "compilerOptions": { "experimentalDecorators": true } }'

    // Add typeorm package (auto-imports)
    nitroConfig.imports = nitroConfig.imports || {}
    nitroConfig.imports.presets = nitroConfig.imports.presets || []
    nitroConfig.imports.presets.push({ package: 'typeorm', ignore: ['default'] })
    nitroConfig.imports.presets.push({
      from: 'typeorm',
      imports: ['EntitySubscriberInterface', 'InsertEvent', 'UpdateEvent'],
      type: true,
    })
  })
  nuxt.hook('nitro:build:before', (nitro) => {
    nitro.options.moduleSideEffects.push('reflect-metadata')
  })

  // Add defineDataSource composable
  addServerImports([
    {
      from: resolver.resolve('runtime/server/composables/defineDataSource'),
      name: 'defineDataSource',
    },
  ])
}
