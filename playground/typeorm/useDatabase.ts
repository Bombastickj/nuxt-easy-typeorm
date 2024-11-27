export const useDatabase = defineDataSource({
  type: 'sqlite',
  database: './playground/typeorm/database.sqlite',
  entities: [User],
  migrations: [],
  synchronize: true,
})
