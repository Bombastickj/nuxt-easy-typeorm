export default defineEventHandler<{ body: InstanceType<typeof User> }>(async (event) => {
  const database = await useDatabase()
  const UserRepository = database.getRepository(User)

  const body = await readBody(event)
  return UserRepository.save(body)
})
