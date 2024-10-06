<script setup>

import MeineAnträge from "@/views/MeineAnträge.vue";

const props = defineProps(["ip", "toastRef", "user"])
import {ref, defineProps, onMounted} from 'vue'
import axios from "axios";

onMounted(async () => {
  await fetchExcursions()
})

const excursions = ref([])
async function fetchExcursions() {
  try {
    const response = await axios.get(props.ip + "excursion", {withCredentials: true})

    if(response.status === 200) {
      excursions.value = response.data
      console.log(excursions.value)
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
  <MeineAnträge :ip="props.ip" :toastRef="props.toastRef" :user="props.user" v-if="props.user.role === 'student'" />
  <div v-else>
    <h1 class="main">Anträge</h1>
    <v-data-table
        :headers="[
        { title: 'ID', value: 'id' },
        { title: 'Beschreibung', value: 'description' },
        { title: 'Gruppe', value: 'group.name' },
        { title: 'Datum', value: 'date' },
        { title: 'Status', value: 'status' },
        { title: 'Aktionen', key: 'actions', sortable: false },
      ]"
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
        <span>{{ new Date(item.date).toLocaleDateString() }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="item.status = 'accepted'" :disabled="item.status === 'accepted'" size="small" flat style="margin-right: 6px" icon color="success"><v-icon icon="mdi-check-bold"></v-icon></v-btn>
        <v-btn :disabled="item.status === 'accepted'" size="small" flat icon color="red"><v-icon icon="mdi-close-thick"></v-icon></v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>

</style>