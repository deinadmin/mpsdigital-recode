<script setup>
import axios from "axios";

const props = defineProps(["ip", "toastRef"])
import {onMounted, ref, defineProps} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const forms = ref([])
const showAddForm = ref(false)
const newForm = ref({
  name: "",
})

onMounted(async () => {
  await getForms()
})

async function getForms() {
  try {
    const response = await axios.get(props.ip + "form", {withCredentials: true})

    if(response.status === 200) {
      forms.value = response.data
      console.log(forms.value)
    }
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

function openDialog() {
  showAddForm.value = true
  newForm.value = {
    name: "",
  }
}

async function addForm() {
  if (newForm.value.name === "") {
    props.toastRef.show({
      message: "Gib der Klasse einen Namen.",
      color: "red"
    })

    return
  }
  try {
    const response = await axios.post(props.ip + "form", newForm.value, {withCredentials: true})

    if(response.status === 201) {
      showAddForm.value = false
      await getForms()
      props.toastRef.show({
        message: "Die Klasse wurde erstellt.",
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

function handleRowClick(event, item) {
  router.push(`/klassen/${item.item.name}`)
}

const search = ref("")
</script>

<template>
  <div>
    <div class="search-bar-container">
      <h1 class="main">Klassen</h1>
      <v-text-field style="margin-left: 10px; margin-bottom: -10px;" max-width="400px" v-model="search" hideDetails label="Suche" variant="outlined" density="compact" prepend-inner-icon="mdi-magnify"></v-text-field>
    </div>
    <v-data-table
        :search="search"
        :headers="[
        { title: 'Klassenname', value: 'name' },
      ]"
      items-per-page="20"
        :items="forms"
        :no-data-text="forms.length === 0 ? 'Es wurden noch keine Klassen erstellt.' : 'Keine Ergebnisse gefunden.'"
        items-per-page-text="Klassen pro Seite:"
        page-text="Klassen {0} bis {1} von insg. {2}"
        @click:row="handleRowClick"
    ></v-data-table>
    <v-fab class="floating-btn" color="primary" icon="mdi-plus" @click="openDialog"></v-fab>
    <v-dialog width="500px" v-model="showAddForm">
      <v-card
          prepend-icon="mdi-account-multiple-plus"
          title="Eine Klasse erstellen"
      >
        <v-card-text>
          <v-text-field label="Klassenname" v-model="newForm.name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addForm">Hinzufügen</v-btn>
          <v-btn color="error" @click="showAddForm = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>