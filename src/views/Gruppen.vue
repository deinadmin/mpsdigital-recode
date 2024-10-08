<script setup>

import axios from "axios";

const props = defineProps(["ip", "toastRef"])
import {onMounted, ref, defineProps} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  await getGroups()
})

const groups = ref([])

async function getGroups() {
  try {
    const response = await axios.get(props.ip + "group", {withCredentials: true})

    if(response.status === 200) {
      console.log(response.data)
      groups.value = response.data.groups
      loading.value = false
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

function handleRowClick(event, item) {
  router.push(`/gruppen/${item.item.id}`)

}

const search = ref("")
</script>

<template>
  <div>
    <div class="search-bar-container">
      <h1 class="main">Gruppen</h1>
      <v-text-field style="margin-left: 10px; margin-bottom: -10px;" max-width="400px" v-model="search" hideDetails label="Suche" variant="outlined" density="compact" prepend-inner-icon="mdi-magnify"></v-text-field>
    </div>
    <v-data-table
        :search="search"
        :loading="loading"
        loading-text="Lade die Gruppen..."
        :no-data-text="groups.length === 0 ? 'Es wurden noch keine Gruppen erstellt.' : 'Keine Ergebnisse gefunden.'"
        items-per-page="20"
      :headers="[
          { title: 'ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Projekttyp', key: 'projectType' },
        { title: 'Startdatum', key: 'startDate' },
        { title: 'Enddatum', key: 'endDate' }
      ]"
      :items="groups"
        items-per-page-text="Gruppen pro Seite:"
        page-text="Gruppen {0} bis {1} von insg. {2}"
        @click:row="handleRowClick"
    >
      <template v-slot:item.startDate="{ item }">
        <span>{{ new Date(item.startDate).toLocaleString() }}</span>
      </template>
      <template v-slot:item.endDate="{ item }">
        <span>{{ item.endDate === null ? 'Noch nicht festgelegt' : new Date(item.endDate).toLocaleString() }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>

</style>