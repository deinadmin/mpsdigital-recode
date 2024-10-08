<script setup>
import { ref, defineProps, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
const route = useRoute()

const props = defineProps({
  ip: String,
  toastRef: Object,
  user: Object
})

onMounted(async () => {
  await fetchExcursion()
})

const excursion = ref(null)
const group = ref(null)

async function fetchExcursion() {
  try {
    const response = await axios.get(props.ip + "excursion/" + route.params.id, {withCredentials: true})
    console.log(response.data)
    if(response.status === 200) {
      excursion.value = response.data
      console.log(excursion.value)
      const groupResponse = await axios.get(props.ip + "group/" + excursion.value.group, {withCredentials: true})
      if(groupResponse.status === 200) {
        group.value = groupResponse.data
        console.log(group.value)
      }
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
  <div v-if="excursion === null" class="flex-center">
    <v-progress-circular
      indeterminate
      size="40"
      color="black"
    ></v-progress-circular>
  </div>
  <div v-else class="main">
    <h1>Antrag #{{ excursion.id }}</h1>
    <div class="two-grid">
        <v-card title="Informationen">
            <v-card-text>
                <h3>Beschreibung</h3>
                <v-textarea auto-grow v-model="excursion.description" readonly></v-textarea>
                <h3>Datum</h3>
                <v-text-field :value="new Date(excursion.date).toLocaleDateString()" readonly></v-text-field>
                <h3>Status</h3>
                <v-chip :color="excursion.status === 'pending' ? 'yellow' : (excursion.status === 'accepted' ? 'green' : 'red')">{{ excursion.status === 'pending' ? 'Ausstehend' : (excursion.status === 'accepted' ? 'Angenommen' : 'Abgelehnt') }}</v-chip>
            </v-card-text>
        </v-card>
        <v-card title="Gruppenmitglieder" :loading="group === null">
            <template v-if="group !== null" v-slot:append>
                <v-chip :color="group.members.filter(member => member.generalParentalConsent).length === group.members.length ? 'green' : 'orange'">{{ group.members.filter(member => member.generalParentalConsent).length }} von {{ group.members.length }} Einverständniserklärungen</v-chip>
            </template>
            <v-card-text v-if="group !== null">
                <v-list>
                    <v-list-item prepend-icon="mdi-account" v-for="member in group.members" :key="member.id">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                            <span>{{ member.user.username }}</span>
                            <v-chip :color="member.generalParentalConsent ? 'green' : 'red'">{{ member.generalParentalConsent ? 'Einverständniserklärung vorhanden' : 'Keine Einverständniserklärung vorhanden' }}</v-chip>
                        </div>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
  </div>
</template>

<style scoped>
</style>
