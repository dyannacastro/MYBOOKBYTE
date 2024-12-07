<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useFavoritesStore } from '@/stores/userFavorites'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const tabs = ref('fiction')
const cards = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)
const showAlert = ref(false)
const alertMessage = ref('')

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

// Function to get user ID
const getUserId = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting user session:', error.message)
    return null
  }
  return data?.session?.user?.id || null
}

// Function to fetch user's favorites when the component is mounted
const fetchUserFavorites = async () => {
  try {
    const userId = await getUserId()
    if (!userId) {
      console.error('User not authenticated. Unable to fetch favorites.')
      return
    }

    // Fetch favorite books from Supabase
    const { data: favoriteBooks, error: fetchError } = await supabase
      .from('favorites')
      .select('book_id, books(title, author, cover_image)')
      .eq('user_id', userId)

    if (fetchError) {
      console.error(
        'Error fetching favorite books from Supabase:',
        fetchError.message,
      )
      return
    }

    // Update the favorites store
    favoritesStore.favoriteBooks = favoriteBooks.map(fav => ({
      id: fav.book_id,
      title: fav.books.title,
      author: fav.books.author,
      coverImage: fav.books.cover_image,
    }))

  } catch (err) {
    console.error('Unexpected error while fetching favorites:', err.message)
  }
}

// Function to check if the book is a favorite
const isFavorite = bookId => {
  return favoritesStore.favoriteBooks.some((favorite) => {
    return favorite.id === bookId
  })
}

const isFavoriteTitle = bookTitle => {
  return favoritesStore.favoriteBooks.some((favorite) => {
    return favorite.title === bookTitle
  })
}

// Function to toggle favorite
const toggleFavorite = async book => {
  try {
    const { data: bookData, error: fetchError } = await supabase
      .from('books')
      .select('id')
      .eq('title', book.title)
      .eq('author', book.author)
      .single()

    if (fetchError) {
      console.error('Error fetching book ID from Supabase:', fetchError.message)
      return
    }

    const bookId = bookData.id

    const userId = await getUserId()
    if (!userId) {
      console.error('User not authenticated. Unable to toggle favorite.')
      return
    }

    if (isFavorite(bookId)) {
      alertMessage.value = `Removing book from favorites: "${book.title}".`
      showAlert.value = true

      console.log(`Removing book from favorites: ${book.title}`)
      await removeFavoriteFromSupabase(bookId, userId)
      favoritesStore.removeFavorite(bookId)
    } else {
      console.log(`Adding book to favorites: ${book.title}`)
      alertMessage.value = `Adding book to favorites: ${book.title}`
      showAlert.value = true

      await addFavoriteToSupabase(bookId, userId)
      favoritesStore.addFavorite({
        id: bookId,
        title: book.title,
        author: book.author,
        coverImage: book.src,
      })
    }
  } catch (err) {
    console.error('Error toggling favorite:', err)
  }
}



// Function to add a favorite to Supabase
const addFavoriteToSupabase = async (bookId, userId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, book_id: bookId }])

    if (error) {
      console.error('Error inserting favorite to Supabase:', error.message)
      return
    }

    console.log('Book successfully added to favorites.')
  } catch (err) {
    console.error('Unexpected error while adding favorite:', err.message)
  }
}

// Function to remove a favorite from Supabase
const removeFavoriteFromSupabase = async (bookId, userId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId)

    if (error) {
      console.error('Error deleting from Supabase:', error.message)
      return
    }

    console.log('Book successfully removed from favorites.')
  } catch (err) {
    console.error('Unexpected error while removing favorite:', err.message)
  }
}

// Function to handle typing effect in the UI
const fullText = 'What book do you want to search today?'
const displayedText = ref('')

const typeText = async () => {
  for (let i = 0; i < fullText.length; i++) {
    displayedText.value += fullText[i]
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

// Function to fetch books from the API and insert them into the Supabase books table
const fetchItems = async genre => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(
      `https://openlibrary.org/subjects/${genre}.json`,
    )
    cards.value = response.data.works.map((book, index) => ({
      id: book.key || `temp-id-${index}`,
      title: book.title || 'Untitled Book',
      src: book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : 'default-image.jpg',
      author: book.authors?.[0]?.name || 'Unknown Author',
      flex: 4,
      booksUrl: book.key
        ? `https://openlibrary.org${book.key}.pdf`
        : null,
    }))

    // Transform the books data to match the Supabase table structure
    const transformedBooks = response.data.works.map(book => ({
      title: book.title,
      cover_image: book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : null,
      author: book.authors?.[0]?.name || 'Unknown Author',
      genre: genre,
    }))

    // Insert the transformed books into the Supabase books table
    const { data, error: supabaseError } = await supabase
      .from('books')
      .upsert(transformedBooks, { onConflict: ['title', 'author'] })

    if (supabaseError) {
      console.error(
        'Error inserting books into Supabase:',
        supabaseError.message,
      )
    } else {
    }
  } catch (error) {
    error.value = 'Failed to load items. Please try again later.'
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

//PDF
const readBook = booksUrl => {
  if (booksUrl) {
    const existingModal = document.getElementById('pdfModal')
    if (existingModal) {
      existingModal.remove()
    }

    // Create a new modal for the PDF viewer
    const modal = document.createElement('div')
    modal.id = 'pdfModal'
    modal.style.position = 'fixed'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.width = '100%'
    modal.style.height = '100%'
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    modal.style.zIndex = '1000'
    modal.style.display = 'flex'
    modal.style.flexDirection = 'column'
    modal.style.alignItems = 'center'
    modal.style.justifyContent = 'center'

    // Add loading indicator
    const loadingIndicator = document.createElement('div')
    loadingIndicator.id = 'loadingIndicator'
    loadingIndicator.style.display = 'flex'
    loadingIndicator.style.flexDirection = 'column'
    loadingIndicator.style.alignItems = 'center'
    loadingIndicator.style.justifyContent = 'center'
    loadingIndicator.style.height = '100%'
    loadingIndicator.style.color = '#fff'

    loadingIndicator.innerHTML = `
  <p style="margin-bottom: 10px;">Loading preview, please wait...</p>
  <div style="
    border: 5px solid #f3f3f3;
    border-top: 5px solid #9C27B0;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  "></div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`

    // Add iframe for the PDF
    const iframe = document.createElement('iframe')
    iframe.id = 'pdfViewer'
    iframe.src = booksUrl
    iframe.style.width = '80%'
    iframe.style.height = '80%'
    iframe.style.border = 'none'
    iframe.style.display = 'none'

    // Handle iframe load event
    iframe.onload = () => {
      loadingIndicator.style.display = 'none'
      iframe.style.display = 'block'
    }

    const backButton = document.createElement('button')
    backButton.innerText = 'Close'
    backButton.style.margin = '10px'
    backButton.style.marginTop = '31.8px'
    backButton.style.marginBottom = '3px'
    backButton.style.padding = '5px 20px'
    backButton.style.backgroundColor = '#9C27B0'
    backButton.style.color = '#fff'
    backButton.style.border = 'none'
    backButton.style.borderRadius = '5px'
    backButton.style.cursor = 'pointer'

    backButton.onclick = () => {
      modal.remove()
    }

    modal.appendChild(backButton)
    modal.appendChild(loadingIndicator)
    modal.appendChild(iframe)

    document.body.appendChild(modal)
  } else {
    alert('No PDF available for this book.')
  }
}

watch(tabs, newGenre => {
  fetchItems(newGenre)
})

watch(tabs, newGenre => fetchItems(newGenre))

watch(searchQuery, newQuery => {
  if (newQuery.trim() === '') {
    fetchItems(tabs.value)
  }
})

function clearSearch() {
  searchQuery.value = ''
  fetchItems(tabs.value)
}

// Fetch items and run typing animation when the component is mounted
onMounted(() => {
  typeText()
  fetchItems(tabs.value)
  fetchUserFavorites()
})

// Computed property for filtering books based on the search query
const filteredCards = computed(() => {
  return cards.value.filter(card =>
    card.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
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
  <AppLayout :is-with-app-bar-nav-icon="true" @is-drawer-visible="isDrawerVisible = !isDrawerVisible">
    <template #content>
      <v-container class="dashboard">
        <h3 class="gradient-text"></h3>

        <!-- Carousel Section -->
        <v-carousel cycle height="400" hide-arrows hide-delimiters :interval="4000">
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-img :src="slide.image" height="100%">
              <v-row class="fill-height" align="center" justify="center"></v-row>
            </v-img>
          </v-carousel-item>
        </v-carousel>

        <!-- Search Bar Section -->
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="search">
            <h2 class="text my-4 text-center">{{ displayedText }}</h2>
            <v-text-field v-model="searchQuery" label="Search by title" prepend-inner-icon="mdi-magnify" clearable
              @click:clear="clearSearch" class="mx-auto rounded-pill-search" :loading="loading"
              color="#E1BEE7"></v-text-field>
          </v-col>
        </v-row>

        <!-- Genres Section -->
        <h3 class="gradient-text my-4">BOOK GENRES</h3>
        <v-row class="genre-icons my-4" justify="center">
          <v-col v-for="genre in genres" :key="genre" cols="6" md="3" lg="2">
            <v-btn class="genre-icon gradient-button" :class="{ active: tabs === genre }" @click="tabs = genre"
              elevation="2" block rounded>
              {{ genre.charAt(0).toUpperCase() + genre.slice(1) }}
            </v-btn>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Search Results Section -->
        <h3 class="gradient-text my-4">SEARCH RESULTS</h3>
        <v-row dense>
          <v-col v-if="loading" cols="12" class="text-center">
            <v-progress-circular indeterminate color="purple" class="ma-3"></v-progress-circular>
            <p class="loading-text">Loading books...</p>
          </v-col>
          <v-col v-else v-for="card in filteredCards" :key="card.id" :cols="12" sm="6" md="4" lg="3">
            <v-card class="heart mt-15">
              <v-img :src="card.src" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"></v-img>
              <v-card-title>{{ card.title }}</v-card-title>
              <v-card-actions>
                <v-btn color="purple" dark class="bordered mx-2 mt-5" @click="readBook(card.booksUrl)">
                  Read
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="white" dark class="glow mx-2 mt-5" icon @click="toggleFavorite(card)">
                  <v-icon :color="isFavoriteTitle(card.title) ? 'purple' : ''">mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <p v-if="error" class="error">{{ error }}</p>

        <!-- Snackbar Alert -->
        <v-snackbar v-model="showAlert" :timeout="3000" top right>
          {{ alertMessage }}
          <v-btn color="pink" text @click="showAlert = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.dashboard {
  color: plum;
}

.search {
  color: rgb(225, 81, 225);
}

.text {
  background: linear-gradient(45deg, #b909fe, #64c0ce, #b909fe);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.error {
  color: rgb(252, 1, 1);
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
  transition:
    box-shadow 0.3s ease-in-out,
    color 0.3s ease-in-out;
}

.glow:hover {
  box-shadow: 0 0 20px 8px rgba(186, 104, 200, 1);
}

.gradient-text {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.5rem;
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
  width: 100%;
}

.genre-icon.active {
  background: linear-gradient(45deg,
      #b909fe,
      #64c0ce,
      #64c0ce,
      #64c0ce,
      #b909fe);
}

.genre-icon:not(.active) {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
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
