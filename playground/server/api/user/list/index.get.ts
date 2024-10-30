export default defineEventHandler(async () => {
  const database = await useDatabase()
  const UserRepository = database.getRepository(User)
  return UserRepository.find()
})
