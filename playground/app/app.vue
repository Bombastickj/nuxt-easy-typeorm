<template>
  <div>
    <h1>EasyTypeORM playground example!</h1>
    <h2>New user</h2>
    <input
      v-model="newUser.name"
      type="text"
      placeholder="Name"
    >
    <input
      v-model="newUser.email"
      type="text"
      placeholder="E-Mail"
    >
    <input
      v-model="newUser.age"
      type="number"
      placeholder="Age"
    >
    <button
      @click="createUser()"
    >
      Fetch user list
    </button>

    <h2>User list</h2>
    <ul>
      <li
        v-for="user in data"
        :key="user.id"
      >
        {{ user }}
      </li>
    </ul>
    <button
      @click="refresh()"
    >
      Fetch user list
    </button>
  </div>
</template>

<script setup lang="ts">
const { data, refresh } = await useFetch('/api/user/list')

const newUser = ref<Omit<InstanceType<typeof User>, 'id'>>({
  name: '',
  email: '',
  age: 0,
})
async function createUser() {
  await $fetch('/api/user', {
    method: 'POST',
    body: newUser.value,
  })
}
</script>
