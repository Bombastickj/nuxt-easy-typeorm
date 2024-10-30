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
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    // const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    const typeormDir = resolver.resolve(_nuxt.options.rootDir, _options.srcDir)

    // setup typescript
    _nuxt.options.typescript.tsConfig.compilerOptions = defu(_nuxt.options.typescript.tsConfig.compilerOptions, {
      experimentalDecorators: true,
      strictPropertyInitialization: false,
      emitDecoratorMetadata: true,
    })
    _nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.esbuild = nitroConfig.esbuild || {}
      nitroConfig.esbuild.options = nitroConfig.esbuild.options || {}
      nitroConfig.esbuild.options.tsconfigRaw = '{ "compilerOptions": { "experimentalDecorators": true } }'
    })

    // Add types
    const nitroImports = [
      'DataSource',
      'DataSourceOptions',

      // entitiy imports
      'Entity',
      'Column',
      'PrimaryGeneratedColumn',
      'CreateDateColumn',
      'UpdateDateColumn',
      'ManyToOne',
      'OneToMany',
      'OneToOne',
      'JoinColumn',

      // query imports
      'In',
      'Between',
    ]
    addServerImports([
      ...nitroImports.map(name => ({ name, from: 'typeorm' })),
      {
        from: resolver.resolve('runtime/server/composables/defineDataSource'),
        name: 'defineDataSource',
      },
    ])

    // Add entities directory to TypeORM config
    addServerImportsDir(typeormDir)

    addImportsDir(typeormDir)
  },
})