<script setup>

import MeineAnträge from "@/views/MeineAnträge.vue";

const props = defineProps(["ip", "toastRef", "user"])
import {ref, defineProps, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import axios from "axios";

onMounted(async () => {
  await fetchExcursions()
})

const excursions = ref([])
async function fetchExcursions() {
  loading.value = true
  try {
    const response = await axios.get(props.ip + "excursion", {withCredentials: true})

    if(response.status === 200) {
      excursions.value = response.data
      loading.value = false
      console.log(excursions.value)
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function setStatus(event, id, status) {
  event.stopPropagation()
  try {
    loading.value = true
    const response = await axios.patch(props.ip + "excursion/" + id, {status: status}, {withCredentials: true})
    if(response.status === 200) {
      props.toastRef.show({
        message: "Status erfolgreich geändert.",
        color: "info"
      })
      await fetchExcursions()
    }
    loading.value = false
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

const router = useRouter()

function openExcursion(event, item) {
  router.push("/antraege/" + item.item.id)
}

const search = ref("")
const loading = ref(false)

</script>

<template>
  <MeineAnträge :ip="props.ip" :toastRef="props.toastRef" :user="props.user" v-if="props.user.role === 'student'" />
  <div v-else>
    <div class="search-bar-container">
      <h1 class="main">Anträge auf Exkursionen</h1>
      <v-text-field style="margin-left: 10px; margin-bottom: -10px;" max-width="400px" v-model="search" hideDetails label="Suche" variant="outlined" density="compact" prepend-inner-icon="mdi-magnify"></v-text-field>
    </div>

    <v-data-table
        :search="search"
        :headers="[
        { title: 'ID', value: 'id' },
        { title: 'Beschreibung', value: 'description' },
        { title: 'Gruppe', value: 'group.name' },
        { title: 'Datum', value: 'date', sortable: true },
        { title: 'Status', value: 'status', sortable: true, filterable: true },
        { title: 'Aktionen', key: 'actions', sortable: false },
      ]"
        :items="excursions"
        :loading="loading"
        loading-text="Lade die Anträge..."
        :no-data-text="excursions.length === 0 ? 'Es wurden noch keine Anträge gestellt.' : 'Keine Ergebnisse gefunden.'"
        items-per-page="20"
        items-per-page-text="Anträge pro Seite:"
        page-text="Anträge {0} bis {1} von insg. {2}"
        @click:row="openExcursion"
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
        <span>{{ new Date(item.date).toLocaleDateString() }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="(event) => setStatus(event, item.id, 'accepted')" :disabled="item.status === 'accepted'" size="small" flat style="margin-right: 6px" icon color="success">
          <v-icon icon="mdi-check-bold"></v-icon>
          <v-tooltip activator="parent" location="bottom">Antrag annehmen</v-tooltip>
        </v-btn>
        <v-btn @click="(event) => setStatus(event, item.id, 'pending')" size="small" flat :disabled="item.status === 'pending'" :style="'margin-right: 6px; ' + (item.status === 'pending' ? 'opacity: 0.5' : '')" icon color="orange">
          <v-icon color="white" icon="mdi-minus-thick"></v-icon>
          <v-tooltip activator="parent" location="bottom">Status zurücksetzen</v-tooltip>
        </v-btn>
        <v-btn @click="(event) => setStatus(event, item.id, 'denied')" :disabled="item.status === 'denied'" size="small" flat icon color="red">
          <v-icon icon="mdi-close-thick"></v-icon>
          <v-tooltip activator="parent" location="bottom">Antrag ablehnen</v-tooltip>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>

</style>