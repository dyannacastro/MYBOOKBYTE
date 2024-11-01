<script setup>
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'

const props = defineProps(['isDrawerVisible']);
const emit = defineEmits(['update:isDrawerVisible']);

const { mobile } = useDisplay();

watch(() => props.isDrawerVisible, (newVal) => {
  emit('update:isDrawerVisible', newVal);
});

const mainNav = [
  ['Dashboard', 'mdi-view-dashboard'],
  ['Favorites', 'mdi-heart'],
  ['Profile', 'mdi-account']
];
</script>

<template>
  <v-navigation-drawer
    v-model="props.isDrawerVisible"
    :temporary="mobile"
    :permanent="!mobile"
    width="325"
  >
    <v-list density="compact" nav>
      <v-list-item
        v-for="([title, icon], i) in mainNav"
        :key="i"
        :prepend-icon="icon"
        :to="title === 'Dashboard' ? '/dashboard' : title === 'Favorites' ? '/favorites' : '/profile'"
        class="nav-item"
      >
        <template #title>
          <strong>{{ title }}</strong>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>