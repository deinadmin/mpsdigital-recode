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

async function fetchExcursion() {
  try {
    const response = await axios.get(props.ip + "excursion/" + route.params.id, {withCredentials: true})
    console.log(response.data)
    if(response.status === 200) {
      excursion.value = response.data
      console.log(excursion.value)
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
  </div>
</template>

<style scoped>
</style>
