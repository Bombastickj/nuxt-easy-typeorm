export const useDatabase = defineDataSource({
  type: 'better-sqlite3',
  database: './playground/typeorm/database.sqlite',
  entities: [User],
  migrations: [],
  synchronize: true,
})
