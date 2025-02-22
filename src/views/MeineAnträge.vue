<script setup>

const props = defineProps(["user", "ip", "toastRef"])
import {ref, defineProps, watch, onMounted} from 'vue'
import axios from "axios";

onMounted(async () => {
  await getExcursions()
})

const excursions = ref([])
const newExcursion = ref({
  description: "",
  date: null
})
const showAddExcursion = ref(false)
function openDialog() {
  showAddExcursion.value = true
  newExcursion.value = {
    description: "",
    date: null
  }
}

async function getExcursions() {
  try {
    const response = await axios.get(props.ip + "excursion", {withCredentials: true})

    if(response.status === 200) {
      excursions.value = response.data
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function addExcursion() {
  if (newExcursion.value.description === "" || newExcursion.value.date === null) {
    props.toastRef.show({
      message: "Bitte fülle alle Felder aus!",
      color: "red"
    })
    return
  }
  try {
    const response = await axios.post(props.ip + "excursion", {
      description: newExcursion.value.description,
      date: newExcursion.value.date,
      group: props.user.group
    }, {withCredentials: true})

    if(response.status === 201) {
      showAddExcursion.value = false
      await getExcursions()
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
  <div>
    <h1 class="main">Meine Anträge auf Exkursionen</h1>
    <v-tooltip text="Einen Antrag stellen">
      <template v-slot:activator="{ props }">
        <v-fab v-bind="props" class="floating-btn" color="primary" icon="mdi-plus" @click="openDialog"></v-fab>
      </template>
    </v-tooltip>
    <v-dialog v-model="showAddExcursion" max-width="500">
      <v-card
          prepend-icon="mdi-note-plus"
          title="Einen Antrag stellen"
      >
        <v-card-text>
          <v-textarea
            v-model="newExcursion.description"
            label="Beschreibung"
          ></v-textarea>
          <v-date-input cancel-text="Abbrechen" v-model="newExcursion.date" label="Datum" prepend-icon="" ></v-date-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" @click="addExcursion">Hinzufügen</v-btn>
          <v-btn color="blue darken-1" @click="showAddExcursion = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="[
        { title: 'ID', value: 'id' },
        { title: 'Beschreibung', value: 'description' },
        { title: 'Datum', value: 'date' },
        { title: 'Status', value: 'status' }
      ]"
      items-per-page="20"
      :items="excursions"
      :no-data-text="excursions.length === 0 ? 'Es wurden noch keine Anträge gestellt.' : 'Keine Ergebnisse gefunden.'"
      items-per-page-text="Anträge pro Seite:"
      page-text="Anträge {0} bis {1} von insg. {2}"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="item.status === 'pending' ? 'orange' : item.status === 'accepted' ? 'green' : 'red'"
          text-color="white"
        >
          {{ item.status === 'pending' ? 'Ausstehend' : item.status === 'accepted' ? 'Angenommen' : 'Abgelehnt' }}
        </v-chip>
      </template>
      <template v-slot:item.date="{ item }">
        <span>{{ new Date(item.date).toLocaleDateString('de-DE') }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>

</style>