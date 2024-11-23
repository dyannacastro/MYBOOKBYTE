<script setup>
import { isAuthenticated } from '@/utils/supabase';
import { onMounted, ref } from 'vue'


// Load Variables
const isLoggedIn = ref(false)

// Get Authentication status from supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => {
  getLoggedStatus()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="mx-auto mt-16 text-center" cols="12" lg="4">
        <h1 class="text-h1 font-weight-black text-purple-darken-4">404</h1>
        <h2 class="text-h2 font-weight-black mb-2">Page Not Found</h2>

        <p class="text-subtitle-1 font-weight-bold mb-4">
          Page does not exist.
        </p>

        <v-btn
          class="mt-2"
          color="purple-darken-4"
          prepend-icon="mdi-home"
          to="/"
        >
          Back to {{ isLoggedIn ? 'Dashboard' : 'Homepage' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>