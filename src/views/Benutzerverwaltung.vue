<script setup>
import axios from "axios";

const props = defineProps(["ip", "toastRef"])
import {onMounted, ref, defineProps} from 'vue'
import BenutzerComponent from "@/components/BenutzerComponent.vue";

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

const getUsers = async () => {
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
    const addedData = {
      role: newUser.value.role,
      form: newUser.value.role === 'student' ? newUser.value.form : undefined,
    }
    console.log(addedData)
    const response = await axios.post(props.ip + "user/" + newUser.value.username, addedData, {withCredentials: true})

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

const currentUsername = ref("")
const showUserDialog = ref(false)

function openUserDialog(event, item) {
  currentUsername.value = item.item.username
  showUserDialog.value = true
}

const search = ref("")
</script>

<template>
  <div>
    <div class="search-bar-container">
      <h1 class="main">Benutzerverwaltung</h1>
      <v-text-field style="margin-left: 10px; margin-bottom: -10px;" max-width="400px" v-model="search" hideDetails label="Suche" variant="outlined" density="compact" prepend-inner-icon="mdi-magnify"></v-text-field>
    </div>
    <v-data-table
        hover
        :loading="users.length === 0"
        :headers="[
          { title: 'Benutzername', value: 'username' },
          { title: 'Rolle', value: 'role' },
        ]"
        :items="users"
        :search="search"
        :no-data-text="users.length === 0 ? 'Es wurden noch keine Benutzer erstellt.' : 'Keine Ergebnisse gefunden.'"
        items-per-page="20"
        items-per-page-text="Benutzer pro Seite:"
        page-text="Benutzer {0} bis {1} von insg. {2}"
      @click:row="openUserDialog"
    >
      <template v-slot:item.role="{item}">
        {{ item.role === "student" ? "Schüler" : item.role === "teacher" ? "Lehrer" : "Admin" }}
      </template>
    </v-data-table>
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
    <v-dialog width="700px" v-model="showUserDialog">
      <BenutzerComponent :ip="props.ip" :toastRef="toastRef" :username="currentUsername" :fetchUserInfo="getUsers" />
    </v-dialog>
  </div>
</template>

<style scoped>

</style>