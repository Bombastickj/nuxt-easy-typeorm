import { defineNuxtModule } from '@nuxt/kit'
import { NUXT_EASY_TYPEORM_MODULE_ID, DEFAULT_OPTIONS } from './constants'
import type { NuxtEasyTypeORMOptions } from './types'
import { createContext } from './context'
import { prepareRuntime } from './prepare/runtime'
import { prepareLayers } from './prepare/layers'

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
    const ctx = createContext(_options)

    await prepareLayers(ctx, _nuxt)
    prepareRuntime(ctx, _nuxt)
  },
})
