<script setup>

const props = defineProps({
  ip: String,
  toastRef: Object,
  username: String,
  fetchUserInfo: Function,
  showComponent: Boolean
})
import {ref, defineProps, watch, onMounted} from 'vue'
import axios from "axios";

const user = ref(null)
const editing = ref(false)
const username = ref(props.username)
onMounted(async () => {
  await getUserInfo()
})

async function resetPassword() {
  
  try {
    const response = await axios.post(props.ip + "user/" + user.value.username + "/passwordReset", {}, {withCredentials: true})
    if (response.status === 200) {
      props.toastRef.show({
        message: "Das Passwort wurde zurückgesetzt.",
        color: "info"
      })
    }
  } catch (error) {
    console.log(error)
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

import { useRouter } from 'vue-router'

const router = useRouter()

function goToGroup() {
  router.push('/gruppen/' + user.value.group.id)
}

function goToForm() {
  router.push('/klassen/' + user.value.form.name)
}


async function getUserInfo() {

  try {
    const response = await axios.get(props.ip + "user/" + props.username, {withCredentials: true});

    if (response.status === 200) {
      user.value = response.data
      console.log(user.value)
    } else {
      props.toastRef.show({
        message: "Es ist ein Fehler aufgetreten.",
        color: "red"
      })
    }

  } catch (error) {
    console.log(error)
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function editUser() {
  if (editing.value) {
    try {
      // First update the user's basic info
      const response = await axios.patch(props.ip + "user/" + username.value, {
        username: user.value.username,
        role: user.value.role,
        generalParentalConsent: user.value.generalParentalConsent,
      }, {withCredentials: true})

      // If the user is a student and in a group, handle special consent changes
      if (user.value.role === 'student' && user.value.group) {
      
        if (user.value.specialParentalConsent) {
          // Add special consent
          const response = await axios.put(props.ip + `group/${user.value.group.id}/${user.value.username}/specialConsent`, {}, {withCredentials: true});
          console.log("special consent: ", response)
        } else {
          // Remove special consent
          const response = await axios.delete(props.ip + `group/${user.value.group.id}/${user.value.username}/specialConsent`, {withCredentials: true});
          console.log("special consent: ", response)
        }
      }

      if (response.status === 200) {
        props.toastRef.show({
          message: "Die Änderungen wurden gespeichert.",
          color: "info"
        })
        await props.fetchUserInfo()
        username.value = user.value.username
      } else {
        props.toastRef.show({
          message: "Es ist ein Fehler aufgetreten.",
          color: "red"
        })
      }
    } catch (error) {
      console.log(error)
      props.toastRef.show({
        message: "Es ist ein Fehler aufgetreten.",
        color: "red"
      })
    }

    editing.value = false
  } else {
    editing.value = true
  }
}

const emit = defineEmits(['update:showComponent'])

async function deleteUser() {
  try {
    const response = await axios.delete(props.ip + "user/" + user.value.username, {withCredentials: true})
    if (response.status === 200) {
      props.toastRef.show({
        message: "Der Benutzer wurde gelöscht.",
        color: "info"
      })
      await props.fetchUserInfo()
      emit('update:showComponent', false)
    } else {
      props.toastRef.show({
        message: "Es ist ein Fehler aufgetreten.",
        color: "red"
      })
    }
  } catch (error) {
    console.log(error)
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

</script>

<template>
  <div v-if="user !== null">
    <v-card :title="'Benutzereinstellungen'">
      <template v-slot:append>
        <v-alert type="info" style="margin-right: 10px;" density="compact" v-if="editing">Denke daran, die Änderungen zu speichern.</v-alert>
        <v-btn icon flat @click="editUser"><v-icon>{{ editing ? 'mdi-check' : 'mdi-pencil' }}</v-icon></v-btn>
      </template>
      <v-card-text>
          <v-text-field
              v-model="user.username"
              label="Benutzername"
              outlined
              :readonly="!editing">
            <template v-slot:append>
              <v-btn flat color="red" @click="resetPassword">Passwort zurücksetzen</v-btn>
            </template>
          </v-text-field>
        <v-select
            v-model="user.role"
            label="Rolle"
            outlined
            :readonly="!editing"
            :items="['student', 'teacher', 'admin']">
        </v-select>
        <div v-if="user.role === 'student'">
          <div style="display: flex">
            <v-text-field
                v-if="user.form !== undefined"
                v-model="user.form.name"
                label="Klasse"
                outlined
                readonly
                append-inner-icon="mdi-information-outline"
                @click:append-inner="goToForm()">
            </v-text-field>
            <v-text-field
                v-else
                label="Klasse"
                disabled
                outlined
                readonly>
            </v-text-field>
            <v-text-field
                v-if="user.group !== undefined"
                v-model="user.group.name"
                label="Gruppe"
                outlined
                readonly
                append-inner-icon="mdi-information-outline"
                @click:append-inner="goToGroup()">
            </v-text-field>
            <v-text-field
                v-else
                label="Gruppe"
                disabled
                outlined
                readonly>
            </v-text-field>
          </div>
          <v-switch
              v-model="user.generalParentalConsent"
              label="Allgemeine Einverständniserklärung"
              :disabled="!editing"
              hide-details
          ></v-switch>
          <v-switch
              v-model="user.specialParentalConsent"
              label="Erweiterte Einverständniserklärung (nur für aktuelles Projekt)"
              :disabled="!editing"
              hide-details
          ></v-switch>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" variant="tonal" @click="deleteUser">Benutzer löschen</v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <div v-else>

  </div>
</template>

<style scoped>

</style>