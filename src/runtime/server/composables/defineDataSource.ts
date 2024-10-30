import { DataSource, type DataSourceOptions } from 'typeorm'

/**
 * Define a new DataSource
 *
 * @param options typeorm DataSourceOptions
 * @returns Initialized DataSource
 */
export function defineDataSource(options: DataSourceOptions) {
  const dataSource = new DataSource(options)

  return async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize().catch((error) => {
        if (error instanceof Error) {
          console.log(error.stack)
        }
      })
    }

    return dataSource
  }
}
