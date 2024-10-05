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

</script>

<template>
  <div class="main">
    <h1>Einstellungen</h1>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 20px; margin-right: 10px">
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
      <v-card title="Benutzerspezifisches">
        <v-card-text>
          <v-text-field disabled label="Spitzname" persistent-hint hint="Wie möchtest du genannt werden?"></v-text-field>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>

</style>