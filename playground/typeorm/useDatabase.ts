export const useDatabase = defineDataSource({
  type: 'sqlite',
  database: './typeorm/database.sqlite',
  entities: [User],
  migrations: [],
  synchronize: true,
})
