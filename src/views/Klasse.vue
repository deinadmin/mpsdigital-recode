<script setup>

import {useRoute} from "vue-router";
import {onMounted, defineProps, ref} from "vue";
const props = defineProps(["ip", "toastRef"])
import axios from "axios";

const route = useRoute()
const students = ref([])
const showAddStudent = ref(false)
const newStudent = ref("")

onMounted(async () => {
  await getForm()
})

async function getForm() {
  try {
    const response = await axios.get(props.ip + "form/" + route.params.id, {withCredentials: true})

    if(response.status === 200) {
      students.value = response.data
    } else {
      props.toastRef.show({
        message: "Es ist ein Fehler aufgetreten.",
        color: "red"
      })
    }
    console.log(response)
  } catch (error) {
    props.toastRef.show({
      message: "Es ist ein Fehler aufgetreten.",
      color: "red"
    })
  }
}

async function addStudent() {
  if (newStudent.value === "") {
    props.toastRef.show({
      message: "Gib den Schüler einen Namen.",
      color: "red"
    })

    return
  }
  try {
    const response = await axios.put(props.ip + "form/" + route.params.id + "/" + newStudent.value, {}, {withCredentials: true})

    if(response.status === 200) {
      showAddStudent.value = false
      await getForm()
      props.toastRef.show({
        message: "Der Schüler wurde hinzugefügt.",
        color: "info"
      })
    } else if(response.status === 409) {
      props.toastRef.show({
        message: "Der Schüler ist bereits in einer Klasse.",
        color: "red"
      })
    } else {
      props.toastRef.show({
        message: "Der Schüler scheint nicht zu existieren.",
        color: "red"
      })
    }
    console.log(response)
  } catch (error) {
    props.toastRef.show({
      message: "Der Schüler ist bereits in einer Klasse oder existiert nicht.",
      color: "red"
    })
    console.log(error)
  }
}

function openDialog() {
  showAddStudent.value = true
  newStudent.value = ""
}

</script>

<template>
  <div>
    <h1 class="main">Klasse {{ route.params.id }}</h1>
    <v-fab style="position: fixed; right: 60px; bottom: 35px" color="primary" icon="mdi-plus" @click="openDialog"></v-fab>
    <v-table
        fixed-header
        :rail="true"
        :hover="students.length > 0"
        density="comfortable"
    >
      <thead>
      <tr>
        <th class="text-left">
          <b>Schüler</b>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-if="students.length !== 0"
          v-for="student in students"
          :key="student.username"
          style="cursor: pointer"
      >
        <td>{{ student.username }}</td>
      </tr>
      <tr v-else>
        <td style="display: flex; flex-direction: column; padding: 20px; height: 100px; align-items: center; justify-content: center">
          <p>In dieser Klasse sind noch keine Schüler.</p>
          <v-btn style="margin-top: 10px" color="primary" @click="openDialog">Schüler hinzufügen</v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-dialog width="500px" v-model="showAddStudent">
      <v-card
          prepend-icon="mdi-account-plus"
          title="Einen Schüler der Klasse hinzufügen"
      >
        <v-card-text>
          <v-text-field label="Benutzername" v-model="newStudent"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addStudent">Hinzufügen</v-btn>
          <v-btn color="error" @click="showAddStudent = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>