<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
import axios from 'axios'


const loadingStudentExcursions = ref(false)
const students = ref([])
const search = ref("")

const props = defineProps({
  ip: String,
  user: Object,
  toastRef: Object
})

onMounted(async () => {
  if (props.user.role === "student") {
    router.push("/gruppe")
    return
  }

  await fetchSettings()
  await fetchStudentExcursions()
})

const fetchStudentExcursions = async () => {
  loadingStudentExcursions.value = true
  const forms = settings.value.preferredForm // looks like this: "5a, 5b, 5c"
  const formArray = forms.split(", ")
  

  formArray.forEach(async form => {
    const response = await axios.get(props.ip + "form/" + form, {withCredentials: true})
    console.log(response.data)
    response.data.forEach(student => {
      students.value.push(student)

    })
  })

  loadingStudentExcursions.value = false
}

const settings = ref({})
async function fetchSettings() {
  const response = await axios.get(props.ip + "account/settings", {withCredentials: true})
  settings.value = response.data
}

</script>

<template>
  <div class="main" style="margin-right: 15px; height: 100%;">
    <h1>Startseite</h1>
    <div style="display: flex; flex-direction: row; gap: 15px; justify-content: space-between; height: 100%;">
      <v-card :loading="loadingStudentExcursions" style="width: 50%; height: 85vh;">
        <v-card-title><b>Anwesenheitsliste {{ new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) }} {{ settings.preferredForm ? "(" + settings.preferredForm +")" : "" }}</b></v-card-title>
        <v-card-subtitle>Verwalte die hier angezeigten Klassen in den Einstellungen.</v-card-subtitle>
        <v-card-text>
          <div v-if="settings.preferredForm">
            <div v-if="!loadingStudentExcursions">
              <v-text-field v-model="search" label="Suche"></v-text-field>
              <v-data-table 
                :headers="[
                  {title: 'Benutzername', value: 'username', sortable: true},
                  {title: 'Anwesend', value: 'hasExcursion', sortable: true},
                  ]" 
                :items="students" 
                item-key="name" 
                :search="search"
                no-data-text="Keine Schüler gefunden."
                items-per-page="5"
                items-per-page-text="Schüler pro Seite:"
                page-text="Schüler {0} bis {1} von insg. {2}"
                >
                <template v-slot:item.hasExcursion="{item}">
                  <v-chip :color="item.hasExcursion ? 'red' : 'green'">{{ item.hasExcursion ? 'Nein' : 'Ja' }}</v-chip>
                </template>
                <template v-slot:item.form="{ item }">
                  <v-chip>{{ item.form }}</v-chip>
                </template>
              </v-data-table>
            </div>
          </div>
          <div style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: end;" v-else>
            <v-alert title="Keine Klassen ausgewählt" text="Bitte wählen Sie in den Einstellungen eine oder mehrere Klassen aus, um die Anwesenheitsliste zu sehen." type="info"></v-alert>
          </div>
        </v-card-text>
      </v-card>
      <v-card style="width: 50%; height: 85vh;">
        <v-card-title><b>Neueste Anträge</b></v-card-title>
        <template v-slot:extra>
        <v-btn
          class="text-none"
          color="primary"
          text="Create goal"
          variant="text"
          slim
        ></v-btn>
      </template>
        <v-card-text>
          
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
