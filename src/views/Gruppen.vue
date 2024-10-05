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

</script>

<template>
  <div>
    <h1 class="main">Gruppen</h1>
    <v-data-table
        :loading="loading"
        loading-text="Lade die Gruppen..."
        no-data-text="Es wurden noch keine Gruppen erstellt."
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