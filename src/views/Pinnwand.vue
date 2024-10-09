<script setup>

import {ref, defineProps, onMounted} from 'vue'
import axios from "axios";

const props = defineProps(["ip", "toastRef", "user"])
const loading = ref(false)

onMounted(async () => {
  await fetchPinboardLink()
})
const pinboard = ref(null)

async function fetchPinboardLink() {
  try {
    loading.value = true
    const response = await axios.get(props.ip + "group/" + props.user.group, {withCredentials: true})

    if(response.status === 200) {
      pinboard.value = response.data.onlinePinboard
      if (pinboard.value !== null) {
        props.toastRef.show({
          message: "Die Pinnwand wird geladen...",
          color: "info"
        })
      }
    }
    loading.value = false
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
  <div style="height: 100%">
    <div v-if="loading" class="flex-center">
      <v-progress-circular
        indeterminate
        size="40"
        color="black"
      ></v-progress-circular>
    </div>
    <div v-else-if="!pinboard" class="flex-center">
      <div>
        <h1>Deine Gruppe hat noch keine Pinnwand!</h1>
        <v-alert type="info">Frage deinen Lehrer, wenn du das für einen Fehler hältst.</v-alert>
      </div>
    </div>
    <div v-else style="height: 100%">
      <iframe frameborder='0' :src='pinboard' style='width:100%;height:100%;padding:0;margin: 0;'></iframe>
    </div>
  </div>
</template>

<style scoped>

</style>