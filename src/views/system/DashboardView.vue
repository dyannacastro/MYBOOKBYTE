<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useFavoritesStore } from '@/stores/userFavorites'

const isDrawerVisible = ref(true)
const tabs = ref('fiction')
const cards = ref([]) // Currently displayed books based on the selected genre
const allBooks = ref([]) // All books across genres for global search
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

const genres = ref([
  'fiction',
  'education',
  'fantasy',
  'psychology',
  'sociology',
  'adventure',
  'mystery',
  'romance',
  'self-help',
  'thriller',
  'cookbooks',
])

const favoritesStore = useFavoritesStore()

const isFavorite = book =>
  favoritesStore.favoriteBooks.some(fav => fav.id === book.id)

const toggleFavorite = book => {
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

const fullText = 'What book do you want to search today?'
const displayedText = ref('')

const typeText = async () => {
  for (let i = 0; i < fullText.length; i++) {
    displayedText.value += fullText[i]
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

// Fetch all books from all genres for global search
const fetchAllBooks = async () => {
  loading.value = true
  error.value = null
  try {
    const requests = genres.value.map(genre =>
      axios.get(`https://openlibrary.org/subjects/${genre}.json`),
    )
    const responses = await Promise.all(requests)

    allBooks.value = responses.flatMap((response, index) =>
      response.data.works.map(book => ({
        title: book.title,
        src: book.cover_id
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
          : 'default-image.jpg',
        id: book.key,
        genre: genres.value[index],
        flex: 4,
      })),
    )
  } catch (err) {
    error.value = 'Failed to load books. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Fetch books for the currently selected genre
const fetchGenreBooks = async genre => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(
      `https://openlibrary.org/subjects/${genre}.json`,
    )
    cards.value = response.data.works.map(book => ({
      title: book.title,
      src: book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : 'default-image.jpg',
      id: book.key,
      flex: 4,
    }))
  } catch (err) {
    error.value = 'Failed to load items. Please try again later.'
  } finally {
    loading.value = false
  }
}

watch(tabs, newGenre => {
  fetchGenreBooks(newGenre)
})

onMounted(() => {
  typeText()
  fetchAllBooks()
  fetchGenreBooks(tabs.value)
})

// Filtered cards for the search bar to access all books
const filteredCards = computed(() => {
  return allBooks.value.filter(book =>
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<script>
export default {
  data() {
    return {
      slides: [
        { image: '/images/table.png' },
        { image: '/images/1.png' },
        { image: '/images/book1.png' },
        { image: '/images/book2.png' },
        { image: '/images/book3.png' },
        { image: '/images/book4.png' },
        { image: '/images/book5.png' },
        { image: '/images/book6.png' },
        { image: '/images/book7.png' },
      ],
    }
  },
}
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #content>
      <v-container class="dashboard">
        <h3 class="gradient-text"></h3>

        <v-carousel
          cycle
          height="400"
          hide-arrows
          hide-delimiters
          :interval="4000"
        >
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-img :src="slide.image" height="100%"></v-img>
          </v-carousel-item>
        </v-carousel>

        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="search">
            <h2 class="text my-4 text-center">{{ displayedText }}</h2>
            <v-text-field
              v-model="searchQuery"
              label="Search by title"
              prepend-inner-icon="mdi-magnify"
              clearable
              class="mx-auto rounded-pill-search"
              :loading="loading"
              color="#E1BEE7"
            ></v-text-field>
          </v-col>
        </v-row>

        <h3 class="gradient-text my-4">BOOK GENRES</h3>
        <v-row justify="center" class="genre-icons my-4">
          <v-col
            v-for="genre in genres"
            :key="genre"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-btn
              class="genre-icon gradient-button"
              :class="{ active: tabs === genre }"
              @click="tabs = genre"
              elevation="2"
              block
              rounded
            >
              {{ genre.charAt(0).toUpperCase() + genre.slice(1) }}
            </v-btn>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <h3 class="gradient-text my-4">SEARCH RESULTS</h3>
        <v-row dense>
          <v-col v-if="loading" cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="purple"
              class="ma-3"
            ></v-progress-circular>
            <p class="loading-text">Loading books...</p>
          </v-col>
          <v-col
            v-else
            v-for="card in searchQuery ? filteredCards : cards"
            :key="card.id"
            :cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="heart mt-15">
              <v-img
                :src="card.src"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              ></v-img>
              <v-card-title
                v-text="card.title"
                class="card-title"
              ></v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="white"
                  dark
                  class="bordered mx-2 mt-5"
                  icon
                  @click="toggleFavorite(card)"
                >
                  <v-icon :color="isFavorite(card) ? 'purple' : ''"
                    >mdi-heart</v-icon
                  >
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

.gradient-text {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8rem;
  animation: gradient-animation 3s ease infinite;
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

.genre-icons {
  margin: 20px 0;
}

.genre-icon {
  height: 45px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background-color 0.3s;
}

.genre-icon.active {
  background: linear-gradient(
    45deg,
    #b909fe,
    #64c0ce,
    #64c0ce,
    #64c0ce,
    #b909fe
  );
}

.genre-icon:not(.active) {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
}

@media (max-width: 600px) {
  .genre-icon {
    font-size: 0.9rem;
    height: 40px;
  }
}

.gradient-button {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
  color: white;
  border: none;
}

.gradient-button:hover {
  background: linear-gradient(45deg, #b909fe, #64c0ce, #b909fe);
}
</style>
