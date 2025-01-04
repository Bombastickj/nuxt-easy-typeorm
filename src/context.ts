import { createResolver, useLogger } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

import { NUXT_EASY_TYPEORM_MODULE_ID } from './constants'
import type { NuxtEasyTypeORMOptions } from './types'

export interface NuxtEasyTypeORMContext {
  resolver: Resolver
  logger: ReturnType<(typeof import('@nuxt/kit'))['useLogger']>
  userOptions: NuxtEasyTypeORMOptions
  options: Required<NuxtEasyTypeORMOptions>
}

// const debug = createDebug('@nuxtjs/i18n:context')
const resolver = createResolver(import.meta.url)

export function createContext(userOptions: NuxtEasyTypeORMOptions): NuxtEasyTypeORMContext {
  const options = userOptions as Required<NuxtEasyTypeORMOptions>

  return {
    resolver,
    logger: useLogger(NUXT_EASY_TYPEORM_MODULE_ID),
    userOptions,
    options,
  }
}
