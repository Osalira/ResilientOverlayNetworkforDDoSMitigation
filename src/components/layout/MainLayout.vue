<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-app-bar app>
      <v-app-bar-title>
        Resilient Overlay Network for DDoS Mitigation
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/posts" text>All Posts</v-btn>
      <v-btn to="/logbook" text>Logbook</v-btn>
      <v-btn to="/proposal" text>Project Proposal</v-btn>
      <v-btn to="/updates" text>BiWeekly Update</v-btn>
      <v-btn to="/demo" text>Project Demo</v-btn>
      <v-btn to="/report" text>Project Report</v-btn>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-btn v-if="!isAuthenticated" @click="signIn" text>
        Sign In
      </v-btn>
      <v-btn v-else @click="signOut" text>
        Sign Out
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="text-center">
          © {{ new Date().getFullYear() }} - CSC466 Project
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@vueuse/firebase'
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/firebaseConfig'

const isDark = ref(false)
const { isAuthenticated, user } = useAuth(auth)

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const signIn = async () => {
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error('Authentication error:', error)
  }
}

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
})
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style> 