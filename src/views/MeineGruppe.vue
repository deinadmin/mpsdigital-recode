<script setup>

import { ref, onMounted, defineProps } from 'vue'
import axios from 'axios'

const props = defineProps(["ip", "toastRef", "user"])

onMounted(async () => {
  await fetchGroup()
})

const group = ref(null)
const startDate = ref(null)
const endDate = ref(null)

async function fetchGroup() {
  const groupId = props.user.group

  try {
    const response = await axios.get(`${props.ip}group/${groupId}`, { withCredentials: true })

    if (response.status === 200) {
      group.value = response.data
      startDate.value = new Date(group.value.startDate).toLocaleDateString()
      endDate.value = group.value.endDate ? new Date(group.value.endDate).toLocaleDateString() : null
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
          <v-text-field v-model="group.name" label="Name" readonly></v-text-field>
          <v-text-field v-model="group.type" label="Projektart" readonly></v-text-field>
          <v-text-field v-model="startDate" label="Startdatum" readonly></v-text-field>
          <v-text-field v-model="group.endDate" label="Enddatum" placeholder="Noch offen" readonly></v-text-field>
        </v-card-text>
      </v-card>
      <v-card title="Mitglieder">
        <v-card-text>
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-account" link v-for="student in group.members">{{ student.user.username }}</v-list-item>
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