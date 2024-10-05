<script setup>
import OnboardingView from "@/views/OnboardingView.vue";

const toastComponentRef = ref(null)

const ip = "http://localhost:3001/api/"

import {onMounted, ref} from 'vue'
import AuthComponent from "@/components/AuthComponent.vue";
import axios from 'axios'
import ToastComponent from "@/components/ToastComponent.vue";

const loaded = ref(false)
const loggedIn = ref(false)
const user = ref(null)

onMounted(async () => {
  await getUserInfo()
  console.log(user.value)
})

async function logOut() {
  try {
    await axios.get(ip + "logout", {withCredentials: true})
    loggedIn.value = false
    user.value = null
  } catch (error) {
    console.log(error)
  }
}

async function getUserInfo() {

  try {
    const response = await axios.get("http://localhost:3001/api/account/", {withCredentials: true});

    if (response.status === 200) {
      loggedIn.value = true
      user.value = response.data
      console.log(user.value)
      loaded.value=true

    }

  } catch (error) {
    console.log(error)
    if (error.response.status === 401) {
      loggedIn.value = false
      loaded.value = true
    } else {
    }
  }
}

const smallMenu = ref(false)
</script>

<template>

  <v-app>
    <ToastComponent ref="toastComponentRef" />
    <v-layout>
      <v-app-bar color="primary" density="compact" title="mPSdigital">
        <template v-slot:prepend>
          <v-app-bar-nav-icon v-if="loggedIn" @click="smallMenu = !smallMenu"></v-app-bar-nav-icon>
        </template>
        <template v-slot:append>
          <v-btn @click="logOut" icon="mdi-logout"></v-btn>
        </template>
      </v-app-bar>
      <v-navigation-drawer
          color="dark"
          theme="dark"
          permanent
          :rail="smallMenu"
      >
        <div v-if="loaded && loggedIn">
          <v-list
              density="compact"
              nav

          >
            <div v-if="user.role !== 'student'">
              <v-list-item link to="/" prepend-icon="mdi-view-dashboard" title="Startseite" value="home"></v-list-item>
              <v-list-item link to="/benutzerverwaltung" prepend-icon="mdi-account-cog" title="Benutzerverwaltung" value="benutzerverwaltung"></v-list-item>
              <v-list-item link to="/klassen" prepend-icon="mdi-book-variant" title="Klassen" value="klassen"></v-list-item>
              <v-list-item link to="/gruppen" prepend-icon="mdi-account-multiple" title="Gruppen" value="gruppen"></v-list-item>
              <v-list-item link to="/antraege" prepend-icon="mdi-note-alert" title="Anträge" value="antraege"></v-list-item>
            </div>
            <div v-else>
              <v-list-item link to="/" prepend-icon="mdi-view-dashboard" title="Startseite" value="home"></v-list-item>
              <v-list-item link to="/gruppe" prepend-icon="mdi-account-multiple" title="Meine Gruppe" value="gruppe"></v-list-item>
              <v-list-item link to="/antraege" prepend-icon="mdi-note-alert" title="Meine Anträge" value="antraege"></v-list-item>
              <v-list-item link to="/pinnwand" prepend-icon="mdi-pin" title="Meine Pinnwand" value="pinnwand"></v-list-item>
            </div>
          </v-list>
        </div>
        <div v-else>
          <v-list
              density="compact"
              nav
          >
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
          </v-list>
        </div>
        <template v-slot:append>
          <div>
            <div v-if="loaded && loggedIn">
              <v-list density="compact" nav>
                <v-list-item to="/einstellungen" value="settings" link title="Einstellungen" block prepend-icon="mdi-cog"></v-list-item>
              </v-list>
            </div>
              <v-btn style="margin-bottom: 10px; margin-left: 10px" v-else @click="toastComponentRef.show({ message: 'Hier findest du mehr Infos!'})" variant="elevated" color="primary" append-icon="mdi-open-in-new">Hilfe</v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main>
        <div v-if="loggedIn && loaded">
          <router-view :ip="ip" :toastRef="toastComponentRef" :user="user" v-if="user.role !=='student' || (user.role === 'student' && user.group)"></router-view>
          <OnboardingView v-else :ip="ip" :toastRef="toastComponentRef" :user="user" />
        </div>
        <AuthComponent :getUserInfo="getUserInfo" :ip="ip" :toastRef="toastComponentRef" v-if="!loggedIn && loaded" />
        <div v-if="!loaded" style="width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center">
          <v-progress-circular size="40" indeterminate></v-progress-circular>
        </div>
      </v-main>
    </v-layout>
  </v-app>

</template>

<style scoped>

</style>
