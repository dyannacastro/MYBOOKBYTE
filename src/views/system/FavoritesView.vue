<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import { useFavoritesStore } from '@/stores/userFavorites'
import { computed } from 'vue'

const favoritesStore = useFavoritesStore()

const favoriteBooks = computed(() => favoritesStore.favoriteBooks)

const removeFavorite = (id) => {
  favoritesStore.removeFavorite(id)
}

const readBook = (id) => {
  console.log(`Read book with id: ${id}`);
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" @is-drawer-visible="isDrawerVisible = !isDrawerVisible">
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>

    <template #content>
      <v-container>
        <h1 class="text-right my-4"> MY FAV BOOKS
          <v-btn icon color="black" dark class="fav-icon mx-2">
            <v-icon color="purple">mdi-heart</v-icon>
          </v-btn>
        </h1>

        <v-row dense>
          <v-col v-for="book in favoriteBooks" :key="book.id" cols="12" sm="6" md="4">
            <v-card>
              <v-img :src="book.coverImage" height="200px" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"></v-img>
              <v-card-title>{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.author }}</v-card-subtitle>
              <v-card-actions class="d-flex justify-center">
                <v-btn color="purple" dark class="bordered mx-2 mt-5" @click="readBook(book.id)">Read</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon color="purple" dark class="glow mx-2 mt-5" @click="removeFavorite(book.id)">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <p v-if="favoriteBooks.length === 0" class="text">No favorite books added yet.</p>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
@keyframes pop {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.fav-icon {
  animation: pop 1s infinite ease-in-out;
  box-shadow: 0 0 15px 4px rgba(186, 104, 200, 1);
  transition: box-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
}

.fav-icon:active {
  transform: scale(0.9);
  box-shadow: 0 0 10px rgba(186, 104, 200, 0.8);
}

.fav-icon:hover {
  box-shadow: 0 0 20px 8px rgba(186, 104, 200, 1);
}

.bordered {
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 15px 4px rgba(186, 104, 200, 0.8);
  transition: box-shadow 0.3s ease-in-out;
}

.bordered:hover {
  box-shadow: 0 0 20px 8px rgba(186, 104, 200, 1);
}

.glow {
  box-shadow: 0 0 15px 4px rgba(186, 104, 200, 0.8);
  transition: box-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
}

.glow:hover {
  box-shadow: 0 0 20px 8px rgba(186, 104, 200, 1);
}

.text {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 65vh;
  font-size: .7rem;
}

.v-card-title {
  color: rgb(234, 8, 234);
  font-size: 1rem;
  padding: 16px;
  text-align: center;
}

.v-card {
  padding-top: 30px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.v-card:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
