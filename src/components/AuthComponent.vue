<script setup>

import { ref, defineProps, watch } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(["getUserInfo", "ip", "toastRef"])
const router = useRouter()


import { useMagicKeys } from '@vueuse/core'
const keys = useMagicKeys()
const enter = keys['Enter']

watch(enter, () => {
  login()
})

import axios from "axios";

const username = ref("")
const password = ref("")
const loading = ref(false)

async function login() {
  loading.value = true

  if(username.value === "" || password.value === "") {
    props.toastRef.show({
      message: "Bitte fülle alle Felder aus!",
      color: "red"
    })
    loading.value = false
    return
  }

  try {
    const response = await axios.post(props.ip + "login/", {
      username: username.value,
      password: password.value
    }, {withCredentials: true})



    if(response.status === 200) {
      await props.getUserInfo()
      username.value = ""
      password.value = ""
      router.push("/")
    } else {
      props.toastRef.show({
        message: "Die Kombination aus Benutzername und Passwort existiert nicht.",
        color: "red"
      })
      loading.value = false
      console.log(response.status)
      console.log(response.data)
    }
  } catch(error) {
    props.toastRef.show({
      message: "Die Kombination aus Benutzername und Passwort existiert nicht.",
      color: "red"
    })
    loading.value = false
    console.log(error)
  }

}


</script>

<template>
  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
    <v-card :loading="loading" width="400">
      <v-card-title><b>Willkommen bei mPSdigital!</b></v-card-title>
      <v-card-subtitle>Die Digitalisierung der mPS. Bitte logge dich ein:</v-card-subtitle>
      <v-card-text>
        <v-text-field suffix="@mps-ki.de" :disabled="loading" style="margin-bottom: 5px" hint="Dein IServ-Benutzername (z. B. max.mustermann)" variant="solo" single-line density="comfortable" label="Benutzername" v-model="username"></v-text-field>
        <v-text-field :disabled="loading" variant="solo" single-line density="comfortable" label="Passwort" v-model="password" outlined type="password"></v-text-field>
        <v-btn color="primary" variant="elevated" @click="login" :disabled="loading">Login</v-btn>
      </v-card-text>
    </v-card>
    <p style="margin-top: 10px">Made with ❤️ by Q2 Informatikprofil</p>
  </div>
</template>

<style scoped>

</style>