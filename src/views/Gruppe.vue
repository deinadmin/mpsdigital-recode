<script setup>

import {useRoute} from "vue-router";

const props = defineProps(["ip", "toastRef", "user"])
import {onMounted, ref, defineProps} from 'vue'
import axios from 'axios'

const route = useRoute()

onMounted(async () => {
  await fetchGroup()
})

const group = ref(null)
const newUser = ref("")
const showAddUser = ref(false)
const showRemoveConfirmation = ref(false)
const userToRemove = ref("")

const startDate = ref(new Date())
const endDate = ref(new Date())


async function fetchGroup() {
  try {
    const response = await axios.get(props.ip + "group/" + route.params.id, {withCredentials: true})

    if(response.status === 200) {
      group.value = response.data
      startDate.value = new Date(group.value.startDate).toLocaleDateString()
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function addUser() {
  if (newUser.value === "") {
    props.toastRef.show({
      message: "Bitte fülle alle Felder aus!",
      color: "red"
    })
    return
  }

  try {
    const response = await axios.put(props.ip + "group/" + route.params.id + "/" + newUser.value, {}, {withCredentials: true})

    if(response.status === 200) {
      props.toastRef.show({
        message: "Der Schüler wurde hinzugefügt.",
        color: "info"
      })
      await fetchGroup()
      showAddUser.value = false
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function removeUser() {
  if (userToRemove.value === "") {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
    return
  }
  try {
    const response = await axios.delete(props.ip + "group/" + route.params.id + "/" + userToRemove.value, {withCredentials: true})

    if(response.status === 200) {
      props.toastRef.show({
        message: "Der Schüler wurde entfernt.",
        color: "info"
      })
      await fetchGroup()
      showRemoveConfirmation.value = false
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
  <div class="main">
    <div v-if="group">
      <h1>Gruppe</h1>
      <div class="two-grid">
        <v-card title="Informationen">
          <template v-slot:append>
            <v-btn flat icon><v-icon icon="mdi-pencil"></v-icon></v-btn>
          </template>
          <v-card-text>
            <v-text-field label="Name" v-model="group.name" readonly></v-text-field>
            <v-text-field label="Projektart" v-model="group.type" readonly></v-text-field>
            <h3>Zeitraum</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px; margin-top: 10px">
              <v-text-field label="Startdatum" v-model="startDate" readonly></v-text-field>
              <v-text-field label="Enddatum" v-model="group.endDate" readonly></v-text-field>
            </div>
          </v-card-text>
        </v-card>
        <v-card title="Mitglieder">
          <template v-slot:append>
            <v-btn flat icon><v-icon icon="mdi-account-plus" @click="() => {showAddUser=true; newUser = ''}"></v-icon></v-btn>
          </template>
          <v-card-text>
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-account" v-for="student in group.members">
                {{ student }}
                <template v-slot:append>
                  <v-btn @click="() => {showRemoveConfirmation = true; userToRemove = student }" flat icon><v-icon color="red" icon="mdi-close-circle"></v-icon></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else class="flex-center" style="height: 500px">
      <v-progress-circular size="40" indeterminate></v-progress-circular>
    </div>
    <v-dialog width="500px" v-model="showAddUser">
      <v-card prepend-icon="mdi-account-plus" title="Einen Schüler der Gruppe hinzufügen">
        <v-card-text>
          <v-text-field label="Benutzername" v-model="newUser"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addUser">Hinzufügen</v-btn>
          <v-btn @click="showAddUser = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="500px" v-model="showRemoveConfirmation">
      <v-card prepend-icon="mdi-account-remove" title="Schüler aus der Gruppe entfernen">
        <v-card-text>
          <p>Möchtest du {{ userToRemove === "" ? "den Schüler" : ('"' + userToRemove + '"') }} wirklich aus der Gruppe entfernen?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="removeUser">Entfernen</v-btn>
          <v-btn @click="showRemoveConfirmation = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>