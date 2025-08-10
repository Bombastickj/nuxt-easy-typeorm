import defu from 'defu'
import { addServerImports } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import type { NuxtEasyTypeORMContext } from '../context'

export function prepareRuntime(
  { resolver, logger }: NuxtEasyTypeORMContext,
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

    // Throw warning if minify is enabled
    if (nitroConfig.minify) {
      logger.warn(
        [
          'Nitro `minify` is enabled.',
          '',
          'For TypeORM projects this is **not recommended** — safest is to set:',
          '  `nitro: { minify: false }`',
          '',
          'Why:',
          ' - Minification renames classes and can break TypeORM metadata.',
          ' - Entities without an explicit table name can fail to map.',
          ' - Subscribers without a name string can fail to register.',
          ' - Migrations without an explicit `name` property will NOT run correctly.',
          '',
          'If you must keep minify on, you MUST:',
          '  1) Give every entity/view a string name:',
          '      @Entity("project")',
          '  2) Give every subscriber a string name:',
          '      @EventSubscriber("CashRegisterReceiptTemplateSubscriber")',
          '  3) Add a stable `name` property to EVERY migration class:',
          '      export class MyMigration_1754130143690 implements MigrationInterface {',
          '        name = "MyMigration_1754130143690"',
          '      }',
          '',
          'Failing to do this will cause runtime errors during development and after build.',
          '',
          'By keeping `minify` enabled in a TypeORM project, you acknowledge that you are proceeding **at your own risk**.',
        ].join(' \n'),
      )
    }
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
