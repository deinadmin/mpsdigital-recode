import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/benutzerverwaltung',
      name: 'benutzerverwaltung',
      component: () => import('../views/Benutzerverwaltung.vue')
    },
    {
      path: '/gruppen',
      name: 'gruppen',
      component: () => import('../views/Gruppen.vue')
    },
    {
      path: '/gruppen/:id',
      name: 'einzelgruppe',
      component: () => import('../views/Gruppe.vue')
    },
    {
      path: '/klassen',
      name: 'klassen',
      component: () => import('../views/Klassen.vue')
    },
    {
      path: '/klassen/:id',
      name: 'klasse',
      component: () => import('../views/Klasse.vue')
    },
    {
      path: '/einstellungen',
      name: 'einstellungen',
      component: () => import('../views/Einstellungen.vue')
    },
    {
      path: '/gruppe',
      name: 'gruppe',
      component: () => import('../views/MeineGruppe.vue')
    },
  ]
})

export default router
