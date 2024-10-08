<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  ip: String,
  user: Object,
  toastRef: Object
})

onMounted(() => {
  if (props.user.role === "student") {
    router.push("/gruppe")
  }
})

</script>

<template>
  <div class="main">
    <h1>Startseite</h1>
  </div>
</template>
