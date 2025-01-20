<script setup>

const props = defineProps(["ip", "toastRef", "user"])
import {onMounted, ref, defineProps} from 'vue'
import axios from 'axios'

const oldPassword = ref("")
const newPassword = ref("")
const newPasswordRepeat = ref("")
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showNewPasswordRepeat = ref(false)
const userSettings = ref({})
const dark = ref(false)
const isValidClasses = ref(true)

function validateClasses(classes) {
  if (!classes) return true;
  const classPattern = /^(\s*[A-Za-zÄäÖöÜüß0-9.]{1,5}\s*)(,\s*[A-Za-zÄäÖöÜüß0-9.]{1,5}\s*)*$/;
  return classPattern.test(classes);
}

onMounted(() => {
  fetchUserSettings()
})

async function fetchUserSettings() {
  const response = await axios.get(props.ip + "account/settings", {withCredentials: true})
  userSettings.value = response.data
  if (Object.keys(userSettings.value).length === 0) {
    if (props.user.role === "student") {
      userSettings.value = {
        nickname: "",
        dark: false
      }
    } else {
      userSettings.value = {
        nickname: "",
        dark: false,
        preferredForm: ""
      }
    }
    await saveUserSettings()
  }
  
}

async function saveUserSettings() {
  if (props.user.role !== 'student' && !validateClasses(userSettings.value.preferredForm)) {
    props.toastRef.show({
      message: "Ungültiges Klassenformat. Bitte geben Sie die Klassen im Format '5a, 5b, 6a' ein.",
      color: "red"
    })
    return;
  }

  const response = await axios.put(props.ip + "account/settings", userSettings.value, {withCredentials: true})
  if (response.status === 200) {
    props.toastRef.show({
      message: "Die Einstellungen wurden gespeichert.",
      color: "info"
    })
  } else {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function changePassword() {
  if (oldPassword.value === "" || newPassword.value === "" || newPasswordRepeat.value === "") {
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
    const response = await axios.post("http://localhost:3001/api/account/changePassword", {
      old: oldPassword.value,
      new: newPassword.value
    }, {withCredentials: true})

    if(response.status === 200) {
      props.toastRef.show({
        message: "Das Passwort wurde geändert.",
        color: "info"
      })
      oldPassword.value = ""
      newPassword.value = ""
      newPasswordRepeat.value = ""
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

async function createExcursion() {
  try {
    const response = await axios.post(props.ip + "excursion", {
      description: "Testtt",
      date: new Date("2024-"+ Math.floor(Math.random() * 12 + 1) + "-" + Math.floor(Math.random() * 28 + 1)),
      group: 1
    }, {withCredentials: true})

    if(response.status === 201) {
      props.toastRef.show({
        message: "Der Antrag wurde erstellt.",
        color: "info"
      })
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
    console.log(error)
  }
}

</script>

<template>
  <div class="main">
    <h1>Einstellungen</h1>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 20px; margin-right: 10px">
      <v-card title="Benutzerspezifisches">
        <v-card-text>
          <v-text-field v-model="userSettings.nickname" label="Spitzname" persistent-hint hint="Wie möchtest du genannt werden?"></v-text-field>
          <v-switch style="margin-bottom: -22px" v-model="userSettings.dark" label="Dark Mode"></v-switch>
          <v-text-field 
            v-if="props.user.role !== 'student'" 
            v-model="userSettings.preferredForm" 
            label="Klassen" 
            persistent-hint 
            hint="Mit Komma getrennt (z.B. 5a, 5b, 6a, 6b)"
            :rules="[v => validateClasses(v) || 'Ungültiges Format. Beispiel: 5a, 5b, 6a']"
            @input="isValidClasses = validateClasses(userSettings.preferredForm)"
          ></v-text-field>
          <v-alert variant="outlined" style="font-size: 12px; margin-top: 15px; margin-bottom: -10px" color="info" density="compact" type="info">Lade die Seite neu, um die Änderungen zu sehen.</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveUserSettings">Speichern</v-btn>
        </v-card-actions>
      </v-card>
      <v-card title="Passwort">
        <v-card-text>
          <v-form>
            <v-text-field
                v-model="oldPassword"
                :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showOldPassword ? 'text' : 'password'"
                label="Altes Passwort"
                @click:append="showOldPassword = !showOldPassword"
            ></v-text-field>
            <v-text-field
                v-model="newPassword"
                :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showNewPassword ? 'text' : 'password'"
                label="Neues Passwort"
                @click:append="showNewPassword = !showNewPassword"
            ></v-text-field>
            <v-text-field
                v-model="newPasswordRepeat"
                :append-icon="showNewPasswordRepeat ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showNewPasswordRepeat ? 'text' : 'password'"
                label="Neues Passwort wiederholen"
                @click:append="showNewPasswordRepeat = !showNewPasswordRepeat"
            ></v-text-field>
            <v-btn @click="changePassword" color="primary">Passwort ändern</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card v-if="props.user.role === 'admin'" title="Entwickleroptionen">
        <v-card-text>
          <v-btn disabled @click="createExcursion" color="info" prepend-icon="mdi-creation">AI-Antrag stellen</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>

</style>