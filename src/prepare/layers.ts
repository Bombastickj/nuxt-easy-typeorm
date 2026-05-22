import fs from 'node:fs'
import { addServerImportsDir, getLayerDirectories } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { NuxtEasyTypeORMContext } from '../context'

export async function prepareLayers(
  { resolver, options }: NuxtEasyTypeORMContext,
  nuxt: Nuxt,
) {
  const layerDirs = getLayerDirectories()

  // Access directories from all layers
  for (const [index, layer] of layerDirs.entries()) {
    const layerCfg = nuxt.options._layers[index]?.config
    if (!layerCfg) continue

    const mabeFolder = resolver.resolve(
      layer.root,
      (layerCfg.typeorm ? layerCfg.typeorm.srcDir : undefined) || options.srcDir,
    )
    const dirStat = await fs.promises.stat(mabeFolder).catch(() => null)
    if (dirStat && dirStat.isDirectory()) {
      // Add typeorm directory to nitro (auto-imports)
      addServerImportsDir(`${mabeFolder}/**`)
    }
  }
}
