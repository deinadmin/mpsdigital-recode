<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
import axios from 'axios'



const props = defineProps({
  ip: String,
  user: Object,
  toastRef: Object
})

onMounted(() => {
  if (props.user.role === "student") {
    router.push("/gruppe")
    return
  }

  fetchSettings()
})

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
      <v-card style="width: 50%; height: 85vh;">
        <v-card-title><b>Anwesenheitsliste</b></v-card-title>
        <v-card-text>
          <div v-if="settings.preferredForm">
            ja
          </div>
          <div style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: end;" v-else>
            <v-alert title="Keine Klassen ausgewählt" text="Bitte wählen Sie in den Einstellungen eine oder mehrere Klassen aus, um die Anwesenheitsliste zu sehen." type="info"></v-alert>
          </div>
        </v-card-text>
      </v-card>
      <v-card style="width: 50%; height: 85vh;">
        <v-card-title><b>Neueste Anträge</b></v-card-title>
        <v-card-text>
          
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
