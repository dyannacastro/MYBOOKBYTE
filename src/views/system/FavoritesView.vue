<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(false)
const favoriteBooks = ref([])
const isLoading = ref(true);
const userEmail = ref(null)
const userId = ref(null)
const router = useRouter()
const alertMessage = ref('')
const showAlert = ref(false)


// Function to fetch the user's favorite books from Supabase
const fetchFavoritesFromSupabase = async () => {
  try {
    if (!userId.value) {
      console.error('No user ID available, unable to fetch favorites.')
      return
    }


    const { data: favoriteData, error: fetchError } = await supabase
      .from('favorites')
      .select('book_id, books(id, title, author, cover_image, pdf_url)')
      .eq('user_id', userId.value)

    if (fetchError) {
      console.error(
        'Error fetching favorites from Supabase:',
        fetchError.message,
      )
      return
    }

    favoriteBooks.value = favoriteData.map(favorite => ({
      id: favorite.books.id,
      title: favorite.books.title,
      author: favorite.books.author,
      coverImage: favorite.books.cover_image,
      booksUrl: favorite.books.pdf_url,
    }))
  } catch (err) {
    console.error('Unexpected error while fetching favorites:', err.message);
  } finally {
    isLoading.value = false;
  }
}

//PDF
const readBook = book => {
  if (book.booksUrl) {
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
    iframe.src = book.booksUrl
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
    alertMessage.value = `No PDF available for this book: ${book.title}`
    showAlert.value = true
  }
}

// Function to toggle a book as favorite (add/remove)
const toggleFavorite = async book => {
  try {
    const isFav = isFavorite(book)
    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId.value)
        .eq('book_id', book.id)

      favoriteBooks.value = favoriteBooks.value.filter(
        favBook => favBook.id !== book.id,
      )
      console.log('Book removed from favorites:', book)
    } else {
      await supabase.from('favorites').insert([
        {
          user_id: userId.value,
          book_id: book.id,
        },
      ])
      await fetchFavoritesFromSupabase()
      console.log('Book added to favorites:', book)
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error.message)
  }
}

// Function to check if a book is a favorite
const isFavorite = book => {
  return favoriteBooks.value.some(favBook => favBook.id === book.id)
}

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data?.session?.user) {
      router.push('/login')
      return
    }

    userEmail.value = data.session.user.email
    userId.value = data.session.user.id
    await fetchFavoritesFromSupabase()
  } catch (err) {
    console.error('Error loading favorites:', err.message)
    router.push('/login')
  }
})
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" @is-drawer-visible="isDrawerVisible = !isDrawerVisible">
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible" />
    </template>

    <template #content>
      <v-container>
        <h1 class="text-right my-4">
          <v-btn icon color="black" dark class="fav-icon mx-6" @click="triggerConfetti">
            <v-icon color="purple">mdi-heart</v-icon>
          </v-btn>
        </h1>


        <v-row dense>
          <v-col v-for="book in favoriteBooks" :key="book.id" cols="12" sm="6" md="4">
            <v-card>
              <v-img :src="book.coverImage" height="200px" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" />
              <v-card-title>{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.author }}</v-card-subtitle>
              <v-card-actions class="d-flex justify-center">
                <v-btn color="purple" dark class="bordered mx-2 mt-5" @click="readBook(book)">Read</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon color="purple" dark class="glow mx-2 mt-5" @click="toggleFavorite(book)">
                  <v-icon :color="isFavorite(book) ? 'purple' : ''">mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div v-if="isLoading" class=" text d-flex justify-center align-center" style="height: 50vh;">
          <div class="text-center">
            <p>Loading favorites, please wait...</p>
            <v-progress-circular indeterminate color="purple" size="45"></v-progress-circular>
          </div>
        </div>


        <p v-if="!isLoading && favoriteBooks.length === 0" class="text d-flex justify-center align-center"
          style="height: 50vh;">
          No favorite books added yet.
        </p>

        <!-- Snackbar Alert -->
        <v-snackbar v-model="showAlert" :timeout="3000" top right>
          {{ alertMessage }}
          <v-btn color="pink" text @click="showAlert = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </template>
  </AppLayout>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js'
    script.onload = () => {
    }
    document.head.appendChild(script)
  },
  methods: {
    triggerConfetti() {
      if (window.confetti) {
        confetti({
          particleCount: 300,
          spread: 360,
          origin: { y: 0.6 },
          scalar: .5,
          colors: ['#f749f1', '#0ff', '#b909fe', '#c096ff'],
        })
      }
    }
  }
}
</script>



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
  transition:
    box-shadow 0.3s ease-in-out,
    color 0.3s ease-in-out;
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
  transition:
    box-shadow 0.3s ease-in-out,
    color 0.3s ease-in-out;
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
  font-size: 0.7rem;
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

.v-card-subtitle {
  text-align: center;
}
</style>
