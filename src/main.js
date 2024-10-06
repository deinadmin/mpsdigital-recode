import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
const app = createApp(App)
import "@/assets/main.css"
import { VDateInput } from 'vuetify/labs/VDateInput'

app.use(router)
app.use(createVuetify({
    components: {
        ...components,
        VDateInput,
    },
    directives,
}))

app.mount('#app')
