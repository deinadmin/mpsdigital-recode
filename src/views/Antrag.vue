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
  <div class="main">
    <h1>Antrag</h1>
  </div>
</template>

<style scoped>
</style>
