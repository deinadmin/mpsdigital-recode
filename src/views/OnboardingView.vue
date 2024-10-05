<script setup>

import { ref, onMounted, defineProps } from 'vue'
import axios from 'axios'

const props = defineProps(["ip", "toastRef", "user"])

const step = ref(1)
const currentTab = ref("beitreten")

onMounted(async () => {
  if (props.user.changedPassword) {
    step.value = 2
  }
  await getGroups()
})

const groups = ref([])
const currentDate = new Date()
const newGroup = ref({
  name: "",
  type: null,
  startDate: currentDate
})
const selectedGroup = ref(null)

async function joinGroup() {
  console.log(groups.value)
  if (!selectedGroup.value) {
    props.toastRef.show({
      message: "Bitte wähle eine Gruppe aus!",
      color: "red"
    })
    return
  }

  try {
    const response = await axios.put(`${props.ip}group/${selectedGroup.value}/${props.user.username}`, {}, { withCredentials: true })

    if (response.status === 200) {
      props.toastRef.show({
        message: "Du bist der Gruppe beigetreten.",
        color: "info"
      })
      step.value = 3
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function createGroup() {
  if (newGroup.name === "" || newGroup.type === null) {
    props.toastRef.show({
      message: "Bitte fülle alle Felder aus!",
      color: "red"
    })
    return
  }

  try {
    const response = await axios.post(props.ip + "group", newGroup.value, {withCredentials: true})

    if(response.status === 201) {
      props.toastRef.show({
        message: "Die Gruppe wurde erstellt.",
        color: "info"
      })
      newGroup.name = ""
      newGroup.type = null
      step.value = 3
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function getGroups() {
  try {
    const response = await axios.get(props.ip + "group", {withCredentials: true})

    if(response.status === 200) {
      groups.value = response.data.groups
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

const newPassword = ref("")
const newPasswordRepeat = ref("")

async function updatePassword() {
  if (newPassword.value === "" || newPasswordRepeat.value === "") {
    props.toastRef.show({
      message: "Bitte fülle alle Felder aus!",
      color: "red"
    })
    return
  }

  if (newPassword.value !== newPasswordRepeat.value) {
    props.toastRef.show({
      message: "Die Passwörter stimmen nicht überein!",
      color: "red"
    })
    return
  }

  try {
    const response = await axios.post(props.ip + "account/changePassword", {
      old: props.user.username,
      new: newPassword.value
    }, {withCredentials: true})

    if(response.status === 200) {
      props.toastRef.show({
        message: "Das Passwort wurde geändert.",
        color: "info"
      })
      newPassword.value = ""
      newPasswordRepeat.value = ""
      step.value = 2
    } else {
      props.toastRef.show({
        message: "Das alte Passwort ist falsch.",
        color: "red"
      })
    }
  } catch(error) {
    props.toastRef.show({
      message: "Das alte Passwort ist falsch.",
      color: "red"
    })
  }
}



</script>


<template>
  <div class="main" style="margin-right: 15px">
    <h1>Willkommen bei mPSdigital!</h1>
    <p>Bevor du mit der Nutzung von mPSdigital beginnen kannst, musst du ein paar Schritte erledigen.</p>
    <v-divider style="margin: 15px 0" />
    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px; margin-right: 10px">
      <v-card :elevation="step !== 1 ? 0 : 2" :disabled="step !== 1">
        <v-card-text>
          <h2><v-chip :color="step > 1 ? 'success' : 'info'">Schritt 1</v-chip> Passwort aktualisieren</h2>
          <v-alert style="font-size: 14px; margin: 15px 0" color="info">Dein Account hat ein unsicheres Standard-Passwort. Bitte versehe deinen Account mit einem sicheren Passwort.</v-alert>
          <v-text-field v-model="newPassword" label="Neues Passwort" type="password"></v-text-field>
          <v-text-field v-model="newPasswordRepeat" label="Neues Passwort wiederholen" type="password"></v-text-field>
          <v-btn color="info" @click="updatePassword">Passwort aktualisieren</v-btn>
        </v-card-text>
      </v-card>
      <v-card :elevation="step !== 2 ? 0 : 2" :disabled="step !== 2">
        <v-card-text>
              <h2><v-chip color="info">Schritt 2</v-chip> Gruppe beitreten/erstellen</h2>
              <p style="margin-top: 10px">Möchtest du eine neue Gruppe erstellen oder einer bereits vorhandenen Gruppe beitreten?</p>
              <v-tabs v-model="currentTab" fixed-tabs grow>
                <v-tab value="beitreten" text="beitreten"></v-tab>
                <v-tab value="erstellen" text="erstellen"></v-tab>
              </v-tabs>
              <v-tabs-window v-model="currentTab" style="padding: 10px">
                <v-tabs-window-item value="beitreten">
                  <v-autocomplete
                      no-data-text="Keine Gruppen gefunden"
                      label="Gruppenname"
                      :items="groups"
                      item-title="name"
                      item-value="id"
                      v-model="selectedGroup"
                  ></v-autocomplete>
                  <v-btn color="info" @click="joinGroup">Gruppe Beitreten</v-btn>
                </v-tabs-window-item>
                <v-tabs-window-item value="erstellen">
                  <v-text-field label="Gruppenname" v-model="newGroup.name" type="text" size="small"></v-text-field>
                  <v-select
                    v-model="newGroup.type"
                    :items="['mPS', 'Herausforderung']"
                    item-title="text"
                    item-value="value"
                    label="Art des Projekts"
                  >
                  </v-select>
                  <v-btn color="info" @click="createGroup">Gruppe Erstellen</v-btn>
                </v-tabs-window-item>
              </v-tabs-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>

</style>