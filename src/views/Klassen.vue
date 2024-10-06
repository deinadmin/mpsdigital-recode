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
</script>

<template>
  <div>
    <h1 class="main">Klassen</h1>
    <v-table
        fixed-header
        :rail="true"
        :hover="forms.length > 0"
        density="comfortable"
    >
      <thead>
      <tr>
        <th class="text-left">
          <b>Klassenname</b>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-if="forms.length !== 0"
          v-for="form in forms"
          :key="form.name"
          style="cursor: pointer"
          @click="router.push('/klassen/' + form.name)"
      >
        <td>{{ form.name }}</td>
      </tr>
      <tr v-else>
        <td style="display: flex; flex-direction: column; padding: 20px; height: 100px; align-items: center; justify-content: center">
          <p>Es wurden noch keine Klassen erstellt.</p>
          <v-btn style="margin-top: 10px" color="primary" @click="openDialog">Klasse erstellen</v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-fab style="position: fixed; right: 60px; bottom: 35px" color="primary" icon="mdi-plus" @click="openDialog"></v-fab>
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