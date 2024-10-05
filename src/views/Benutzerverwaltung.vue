<script setup>
import axios from "axios";

const props = defineProps(["ip", "toastRef"])
import {onMounted, ref, defineProps} from 'vue'

const users = ref([])
const showAddUser = ref(false)
const newUser = ref({
  username: "",
  role: ""
})
const roles = [
  {
    value: "student",
    text: "Schüler"
  },
  {
    value: "teacher",
    text: "Lehrer"
  },
  {
    value: "admin",
    text: "Admin"
  }
]

const forms = ref([])

async function getForms() {
  try {
    const response = await axios.get(props.ip + "form", {withCredentials: true})

    if(response.status === 200) {
      forms.value = response.data
      console.log(forms.value)
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

onMounted(async () => {
  await getUsers()
  await getForms()
})

async function getUsers() {
  try {
    const response = await axios.get(props.ip + "user", {withCredentials: true})

    if(response.status === 200) {
      users.value = response.data
      console.log(users.value)
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

function openDialog() {
  showAddUser.value = true
  newUser.value = {
    username: "",
    role: null
  }
}

async function resetPass(username) {
  try {
    const response = await axios.post(props.ip + "user/" + username + "/passwordReset", {  }, {withCredentials: true})

    if(response.status === 200) {
      props.toastRef.show({
        message: "Das Passwort wurde zurückgesetzt.",
        color: "info"
      })
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function addUser() {
  console.log(newUser.value)
  newUser.value.username = newUser.value.username.replace(" ", "")
  try {
    const response = await axios.post(props.ip + "user/" + newUser.value.username, { role: newUser.value.role }, {withCredentials: true})

    if(response.status === 201) {
      showAddUser.value = false
      await getUsers()
      props.toastRef.show({
        message: "Der Benutzer wurde erstellt.",
        color: "info"
      })
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}
</script>

<template>
  <div>
    <h1 class="main">Benutzerverwaltung</h1>
    <v-table
        v-if="users.length > 0"
        fixed-header
        hover
        density="comfortable"
    >
      <thead>
      <tr>
        <th class="text-left">
          <b>Benutzername</b>
        </th>
        <th class="text-left">
          <b>Rolle</b>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="user in users"
          :key="user.username"
      >
        <td @click="resetPass(user.username)">{{ user.username }}</td>
        <td>{{ user.role }}</td>
      </tr>
      </tbody>
    </v-table>
    <div v-else class="flex-center">
      <v-progress-circular size="40" indeterminate></v-progress-circular>
    </div>
    <v-fab style="position: fixed; right: 60px; bottom: 35px" color="primary" icon="mdi-plus" @click="openDialog"></v-fab>
    <v-dialog width="500px" v-model="showAddUser">
      <v-card
          prepend-icon="mdi-account-plus"
          title="Einen Benutzer hinzufügen"
      >
        <v-card-text>
          <v-text-field label="Benutzername" v-model="newUser.username"></v-text-field>
          <v-select
              label="Rolle"
              v-model="newUser.role"
              :items="roles"
              item-title="text"
              item-value="value"
          ></v-select>
          <v-select
              v-if="newUser.role === 'student'"
              label="Klasse"
              v-model="newUser.form"
              :items="forms"
              item-title="name"
              item-value="name"
          ></v-select>
          <v-alert color="info" density="compact" type="info" style="font-size: 13px">
            Der Account wird mit einem Einmal-Passwort versehen, welches äquivalent zu dem Benutzernamen ist.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addUser">Hinzufügen</v-btn>
          <v-btn color="error" @click="showAddUser = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>