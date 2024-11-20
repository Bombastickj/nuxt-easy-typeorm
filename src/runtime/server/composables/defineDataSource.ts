import { DataSource, type DataSourceOptions } from 'typeorm'

/**
 * Define a new DataSource
 *
 * @param options typeorm DataSourceOptions
 * @returns Initialized DataSource
 */
export function defineDataSource(options: DataSourceOptions) {
  const dataSource = new DataSource(options)

  // This will hold the initialization promise
  let initializing: Promise<DataSource> | null = null

  return async () => {
    if (dataSource.isInitialized) {
      return dataSource
    }

    // If initialization is already in progress, wait for it
    if (initializing) {
      return initializing
    }

    // Start the initialization process and store the promise
    initializing = dataSource.initialize()
      .then(() => {
        initializing = null
        return dataSource
      })
      .catch((error) => {
        initializing = null
        console.error('Error during DataSource initialization:', error)
        throw error // Rethrow to allow handling where the function is called
      })

    return initializing
  }
}
