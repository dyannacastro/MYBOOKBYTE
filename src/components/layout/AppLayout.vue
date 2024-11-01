<script setup>
import { isAuthenticated } from '@/utils/supabase'
import ProfileHeader from './ProfileHeader.vue'
import SideNavigation from './SideNavigation.vue'
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps(['isWithAppBarNavIcon'])

const { mobile } = useDisplay()
const isDrawerVisible = ref(false)
const isLoggedIn = ref(false)

const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

onMounted(() => {
  getLoggedStatus()
})
</script>

<template>
  <v-responsive>
    <v-app>
      <v-app-bar class="px-3" border :style="{ background: 'linear-gradient(#BA68C8, #AB47BC, #b909fe, #64c0ce)' }">
        <v-app-bar-nav-icon
          v-if="props.isWithAppBarNavIcon"
          icon="mdi-menu"
          class="white-border"
          @click="toggleDrawer"
        />
        <v-spacer></v-spacer>
        <ProfileHeader v-if="isLoggedIn" />
      </v-app-bar>

      <SideNavigation v-model:isDrawerVisible="isDrawerVisible" />

      <v-main>
        <slot name="navigation" />
        <slot name="content" />
      </v-main>

      <v-footer class="font-weight-bold d-flex justify-center align-center" :class="mobile ? 'text-caption' : ''" color="black" app>
        <div :class="mobile ? 'w-100 text-center' : 'text-center'">
          <p class="font-italic">
            Copyright © 2024 - <span class="font-weight-thin">BookByte | All Rights Reserved</span>
          </p>
        </div>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.white-border {
  border: 2px solid white;
  border-radius: 4px;
  padding: 4px;
}

.font-weight-thin {
  color: blueviolet;
}
</style>