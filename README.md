# Nuxt EasyTypeORM

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This Nuxt module is aimed for a seamless integration of TypeORM.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Installation

```bash
npx nuxi@latest module add nuxt-easy-typeorm
```


## Configuration

In your Nuxt project, configure the module options inside `nuxt.config.js`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-easy-typeorm'],
  typeorm: {
    directory: 'my-typeorm-folder', // optional: defaults to 'typeorm' if not specified
  }
})
```

## Setup

1. **Create the** `typeorm` **Directory**: Inside the root of your project, create a typeorm directory (or the directory specified in your config). This is where you'll organize TypeORM-related files, such as entities and migrations.
2. **Organize with Subdirectories**: To keep the folder organized, create subdirectories like `entities` for entity files and `migrations` for migration files.
3. **Define a Data Source**: Create a file (e.g., `useDatabase.ts`) in the `typeorm` directory. Use the provided `defineDataSource` function to configure your TypeORM data source.

```ts
export const useDatabase = defineDataSource({
  type: 'sqlite',
  database: './typeorm/database.sqlite',
  entities: [],
  migrations: [],
  synchronize: true,
})
```

> [!NOTE]
> You can add all entities and migrations here without additional imports.

## Usage

After setting up, the data source will be auto-imported and ready for use in your Nitro routes. Here’s a simple example of using `useDatabase` to interact with an entity called `User`.

### Example: Fetching Users

```ts
// server/api/user/list/index.get.ts
export default defineEventHandler(async (event) => {
  const database = await useDatabase()
  const UserRepository = database.getRepository(User)
  return UserRepository.find()
})
```

In this example, `useDatabase()` initializes the database connection and retrieves the repository for the `User` entity, allowing you to perform operations like `.find()`.

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-easy-typeorm/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-easy-typeorm

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-easy-typeorm.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-easy-typeorm

[license-src]: https://img.shields.io/npm/l/nuxt-easy-typeorm.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-easy-typeorm

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
