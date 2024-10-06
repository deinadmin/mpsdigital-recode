<script setup>

const props = defineProps(["username", "ip", "toastRef"])
import {ref, defineProps, watch, onMounted} from 'vue'
import axios from "axios";

const user = ref(null)

onMounted(async () => {
  await getUserInfo()
})

async function getUserInfo() {

  try {
    const response = await axios.get(props.ip + "user/" + props.username, {withCredentials: true});

    if (response.status === 200) {
      user.value = response.data
      console.log(user.value)
    }

  } catch (error) {
    console.log(error)
    toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

</script>

<template>
  <div v-if="user !== null">
    <v-card :title="'Benutzereinstellungen'">
      <v-card-text>
          <v-text-field
              v-model="user.username"
              label="Benutzername"
              outlined
              readonly>
            <template v-slot:append>
              <v-btn flat color="red">Passwort zurücksetzen</v-btn>
            </template>
          </v-text-field>
        <v-text-field
            v-model="user.role"
            label="Rolle"
            outlined
            readonly>
        </v-text-field>
        <div v-if="user.role === 'student'">
          <div style="display: flex">
            <v-text-field
                loading
                disabled
                label="Klasse"
                outlined
                readonly>
            </v-text-field>
            <v-text-field
                loading
                disabled
                label="Gruppe"
                outlined
                readonly>
            </v-text-field>
          </div>
          <v-switch
              v-model="user.generalParentalConsent"
              label="Allgemeine Einverständniserklärung"
              readonly
              hide-details
              style="margin: 0; padding:0"
          ></v-switch>
          <v-switch
              v-model="user.specialParentalConsent"
              label="Erweiterte Einverständniserklärung"
              readonly
              hide-details
          ></v-switch>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-else>

  </div>
</template>

<style scoped>

</style>