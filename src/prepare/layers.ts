import fs from 'node:fs'
import { addServerImportsDir } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import type { NuxtEasyTypeORMContext } from '../context'

export async function prepareLayers(
  { resolver, options }: NuxtEasyTypeORMContext,
  nuxt: Nuxt,
) {
  const _layers = [...nuxt.options._layers].reverse()
  for (const layer of _layers) {
    const rootDir = layer.config.rootDir
    const mabeFolder = resolver.resolve(rootDir, layer.config.typeorm?.srcDir || options.srcDir)
    const dirStat = await fs.promises.stat(mabeFolder).catch(() => null)
    if (dirStat && dirStat.isDirectory()) {
      // Add typeorm directory to nitro (auto-imports)
      addServerImportsDir(`${mabeFolder}/**`)
    }
  }
}
