<template>
  <v-snackbar
      :color="color"
      :timeout="timer"
      v-model="showSnackbar"
      variant="elevated"
      location="right"
  >
    <v-icon v-if="icon !== 'none'" left>{{icon}}</v-icon>{{message}}
  </v-snackbar>
</template>

<script setup>

import { ref, defineExpose } from 'vue'

const showSnackbar = ref(false)
const message = ref('')
const color = ref('success')
const icon = ref('mdi-check')
const timer = ref(3000)

function show(data) {
  message.value = data.message || 'missing "message".'
  color.value = data.color || 'info'
  timer.value = data.timer || 3000
  icon.value = data.icon || 'none'
  showSnackbar.value = true
}

defineExpose({
  show
})
</script>
