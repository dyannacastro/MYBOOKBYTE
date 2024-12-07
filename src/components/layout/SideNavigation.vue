<script setup>
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase' // Import supabase for logging out

const props = defineProps(['isDrawerVisible'])
const emit = defineEmits(['update:isDrawerVisible'])

const { mobile } = useDisplay()
const router = useRouter()

watch(
  () => props.isDrawerVisible,
  newVal => {
    emit('update:isDrawerVisible', newVal)
  },
)

const mainNav = [
  ['Dashboard', 'mdi-view-dashboard'],
  ['Favorites', 'mdi-heart'],
  ['Profile', 'mdi-account'],
]

// Updated onLogout function
const onLogout = async () => {
  // Attempt to log out from Supabase
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
  } else {
    // Clear login-related data from localStorage
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('userEmail')

    // Redirect to the login page
    router.replace('/')
  }
}
</script>

<template>
  <!-- Navigation Drawer for Main Navigation and Logout -->
  <v-navigation-drawer
    v-model="props.isDrawerVisible"
    :temporary="mobile"
    :permanent="!mobile"
    width="325"
    class="custom-drawer"
  >
    <v-list density="compact" nav>
      <!-- Navigation Links -->
      <v-list-item
        v-for="([title, icon], i) in mainNav"
        :key="i"
        :prepend-icon="icon"
        :to="
          title === 'Dashboard'
            ? '/dashboard'
            : title === 'Favorites'
              ? '/favorites'
              : '/profile'
        "
        class="nav-item"
      >
        <template #title>
          <strong>{{ title }}</strong>
        </template>
      </v-list-item>

      <!-- Divider -->
      <v-divider class="divider"></v-divider>

      <!-- Logout Item -->
      <v-list-item
        :prepend-icon="'mdi-logout'"
        @click="onLogout"
        class="nav-item logout-item"
      >
        <template #title>
          <strong>Logout</strong>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.custom-drawer {
  background-color: black;
}

.nav-item {
  color: #ba68c8;
  margin-top: 2%;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: purple;
}

.logout-item {
  color: #ba68c8;
  transition: color 0.3s ease;
  margin-top: 3%;
}

.logout-item:hover {
  color: red;
}

.divider {
  margin-top: 10%;
  color: white;
}
</style>
