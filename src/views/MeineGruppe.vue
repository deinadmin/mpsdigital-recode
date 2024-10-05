<script setup>

import { ref, onMounted, defineProps } from 'vue'
import axios from 'axios'

const props = defineProps(["ip", "toastRef", "user"])

onMounted(async () => {
  await fetchGroup()
})

const group = ref(null)

async function fetchGroup() {
  const groupId = props.user.group

  try {
    const response = await axios.get(`${props.ip}group/${groupId}`, { withCredentials: true })

    if (response.status === 200) {
      group.value = response.data
      console.log(group.value)
    } else {
      props.toastRef.show({
        message: "Es ist ein Fehler aufgetreten.",
        color: "red"
      })
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
  <div class="main" style="height: 100%">
    <h1>Meine Gruppe</h1>
    <div class="two-grid" v-if="group !== null">
      <v-card title="Informationen">
        <v-card-text>
          <p><b>Name:</b> {{ group.name }}</p>
          <p><b>Projektart:</b> {{ group.type }}</p>
          <p><b>Startdatum:</b> {{ new Date(group.startDate).toLocaleDateString() }}</p>
          <p><b>Enddatum:</b> {{ group.endDate === null ? "Noch offen" : new Date(group.endDate).toLocaleDateString() }}</p>
        </v-card-text>
      </v-card>
      <v-card title="Mitglieder">
        <v-card-text>
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-account" link v-for="student in group.members">{{ student }}</v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
    <div v-else class="flex-center" style="height: 500px">
      <v-progress-circular size="40" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>

</style>