<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useFavoritesStore } from '@/stores/userFavorites'

const isDrawerVisible = ref(true)
const tabs = ref('fiction') 
const cards = ref([]) 
const searchQuery = ref('') 
const loading = ref(false) 
const error = ref(null) 

const favoritesStore = useFavoritesStore()

const isFavorite = (book) => {
  return favoritesStore.favoriteBooks.some(favorite => favorite.id === book.id)
}

const toggleFavorite = (book) => {
  if (isFavorite(book)) {
    favoritesStore.removeFavorite(book.id)
  } else {
    favoritesStore.addFavorite({
      id: book.id,
      title: book.title,
      author: book.author, 
      coverImage: book.src, 
    })
  }
}

const fetchItems = async (genre) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`https://openlibrary.org/subjects/${genre}.json`);
    console.log(response.data);
    cards.value = response.data.works.map((book) => ({
      title: book.title,
      src: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'default-image.jpg',
      id: book.key, 
      flex: 4, 
    }));
  } catch (error) {
    error.value = 'Failed to load items. Please try again later.';
  } finally {
    loading.value = false;
  }
};

watch(tabs, (newGenre) => {
  fetchItems(newGenre)
})

fetchItems(tabs.value)

const filteredCards = computed(() => {
  return cards.value.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<script>
export default {
  data() {
    return {
      slides: [
        { image: '/images/img1.png' },
        { image: '/images/img2.png' },
        { image: '/images/img3.png' },
        { image: '/images/img4.png' },
        { image: '/images/img5.png' },
        { image: '/images/img6.png' },
        { image: '/images/img9.png' },
        { image: '/images/img10.png' },
        { image: '/images/img11.png' },
        { image: '/images/img13.png' },
        { image: '/images/img14.png' }
      ],
    }
  },
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" @is-drawer-visible="isDrawerVisible = !isDrawerVisible">
    <template #content>
      <v-container class="dashboard">
        <v-carousel cycle height="400" hide-arrows hide-delimiter-background :interval="2500">
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-img :src="slide.image" height="100%">
              <v-row class="fill-height" align="center" justify="center"></v-row>
            </v-img>
          </v-carousel-item>
        </v-carousel>

        <v-row justify="center">
          <v-col cols="12" sm="6" md="8" class="search">
            <h4 class="text my-4 text-center">What do you want to read today?</h4>
            <v-text-field v-model="searchQuery" label="Search for Books" append-inner-icon="mdi-magnify"
              clearable class="mx-auto"></v-text-field>
          </v-col>
        </v-row>

        <v-tabs v-model="tabs" align-with-title>
          <v-tab value="fiction">Fiction</v-tab>
          <v-tab value="education">Education</v-tab>
          <v-tab value="fantasy">Fantasy</v-tab>
          <v-tab value="philosophy">Philosophy</v-tab>
          <v-tab value="psychology">Psychology</v-tab>
          <v-tab value="sociology">Sociology</v-tab>
          <v-tab value="adventure">Adventure</v-tab>
          <v-tab value="biography">Biography</v-tab>
          <v-tab value="mystery">Mystery</v-tab>
          <v-tab value="romance">Romance</v-tab>
          <v-tab value="self-help">Self-Help</v-tab>
          <v-tab value="thriller">Thriller</v-tab>
          <v-tab value="cookbooks">Cookbooks</v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-row dense>
          <v-col v-if="loading" cols="12" class="text-center">
            <v-progress-circular indeterminate color="purple" class="ma-3"></v-progress-circular>
            <p class="loading-text">Loading books...</p>
          </v-col>
          <v-col v-else v-for="card in filteredCards" :key="card.title" :cols="card.flex">
            <v-card class="heart mt-15">
              <v-img :src="card.src" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"></v-img>
              <v-card-title v-text="card.title" class="card-title"></v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="white" dark class="bordered mx-2 mt-5" icon @click="toggleFavorite(card)">
                  <v-icon :color="isFavorite(card) ? 'purple' : ''">mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <p v-if="error" class="error">{{ error }}</p>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.dashboard {
  color: white;
}

.search {
  color: rgb(225, 81, 225);
}

.text {
  color: white;
}

.error {
  color: red;
  font-weight: bold;
}

.loading-text {
  color: white;
  margin-top: 10px;
}

.v-card-title {
  color: rgb(234, 8, 234);
  font-size: 1rem;
  padding: 16px; 
  text-align: center;
}

.v-card {
  border-radius: 8px; 
  transition: background-color 0.3s;
}

.v-card:hover {
  background-color: rgba(255, 255, 255, 0.2); 
}
</style>
