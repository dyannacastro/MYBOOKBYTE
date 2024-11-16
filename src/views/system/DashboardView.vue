<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useFavoritesStore } from '@/stores/userFavorites'

// Reactive variables
const isDrawerVisible = ref(true)
const tabs = ref('fiction')
const cards = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)


// Genres array
const genres = ref([
  'fiction', 'education', 'fantasy', 'philosophy',
  'psychology', 'sociology', 'adventure', 'biography',
  'mystery', 'romance', 'self-help', 'thriller', 'cookbooks'
]);

// Favorites store logic
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

// Typing effect variables and function
const fullText = "What do you want to read today?"
const displayedText = ref('')

const typeText = async () => {
  for (let i = 0; i < fullText.length; i++) {
    displayedText.value += fullText[i]
    await new Promise((resolve) => setTimeout(resolve, 100)) // Adjust the delay as needed
  }
}

// Fetch items function
const fetchItems = async (genre) => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(`https://openlibrary.org/subjects/${genre}.json`)
    console.log(response.data)
    cards.value = response.data.works.map((book) => ({
      title: book.title,
      src: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'default-image.jpg',
      id: book.key,
      flex: 4,
    }))
  } catch (error) {
    error.value = 'Failed to load items. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Watch for changes in tabs and fetch new items
watch(tabs, (newGenre) => {
  fetchItems(newGenre)
})

// Initial component setup
onMounted(() => {
  typeText() // Start the typing effect
  fetchItems(tabs.value) // Fetch items on initial load
})

// Filtered cards computed property
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
            <h2 class="text my-4 text-center">{{ displayedText }}</h2> <!-- Typing effect -->
            <v-text-field v-model="searchQuery" label="Search by title" prepend-inner-icon="mdi-magnify" clearable
              class="mx-auto rounded-pill-search" :loading="loading" color="#E1BEE7">
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Book Genres Title with Gradient -->
        <h3 class="gradient-text my-4">BOOK GENRES</h3>

        <v-row justify="center" class="genre-icons my-4">
          <v-col v-for="genre in genres" :key="genre" cols="3">
            <v-btn class="genre-icon gradient-button" @click="tabs = genre" elevation="2" rounded>
              {{ genre.charAt(0).toUpperCase() + genre.slice(1) }}
            </v-btn>
          </v-col>
        </v-row>

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

/* Gradient Text Styles */
.gradient-text {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  /* Adjust this value for the gradient text size */
  animation: gradient-animation 3s ease infinite;
  /* Add animation */
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Styles for genre icons */
.genre-icons {
  margin: 20px 0;
}

.genre-icon {
  width: 90%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  background-color: transparent;
  /* Remove default background color */
  transition: background-color 0.3s;
}

/* Gradient background for genre buttons */
.gradient-button {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
  color: white;
  border: none;
}

.gradient-button:hover {
  background: linear-gradient(45deg, #b909fe, #64c0ce, #b909fe);
}
</style>
