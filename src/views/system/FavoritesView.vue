<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(false)
const favoriteBooks = ref([]) // This will hold the list of favorite books
const userEmail = ref(null)
const userId = ref(null)
const router = useRouter()

// Function to fetch the user's favorite books from Supabase
const fetchFavoritesFromSupabase = async () => {
  try {
    if (!userId.value) {
      console.error('No user ID available, unable to fetch favorites.')
      return
    }

    console.log('Fetching favorite books for user ID:', userId.value)

    // Fetch favorites with book details including `pdf_url`
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

    console.log('Favorite entries fetched from Supabase:', favoriteData)

    // Map favorites data to the format expected by the UI
    favoriteBooks.value = favoriteData.map(favorite => ({
      id: favorite.books.id,
      title: favorite.books.title,
      author: favorite.books.author,
      coverImage: favorite.books.cover_image,
      booksUrl: favorite.books.pdf_url, // Include the `pdf_url`
    }))
  } catch (err) {
    console.error('Unexpected error while fetching favorites:', err.message)
  }
}

//PDF
const readBook = booksUrl => {
  if (booksUrl) {
    // Create a modal or overlay to display the loading spinner and iframe
    const existingModal = document.getElementById('pdfModal')
    if (existingModal) {
      // If modal already exists, remove it to prevent duplicates
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
    loadingIndicator.style.flexDirection = 'column' // Stack elements vertically
    loadingIndicator.style.alignItems = 'center' // Horizontally center the content
    loadingIndicator.style.justifyContent = 'center' // Vertically center the content
    loadingIndicator.style.height = '100%' // Take full height of the container
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
    iframe.style.display = 'none' // Initially hide until loaded

    // Handle iframe load event
    iframe.onload = () => {
      loadingIndicator.style.display = 'none' // Hide loading indicator
      iframe.style.display = 'block' // Show iframe
    }

    // Create the button
    const backButton = document.createElement('button')
    backButton.innerText = 'Close'
    backButton.style.margin = '10px' // Uniform margin
    backButton.style.marginTop = '50px'
    backButton.style.marginBottom = '10px' // Extra space below the button
    backButton.style.padding = '5px 20px' // Padding inside the button
    backButton.style.backgroundColor = '#9C27B0'
    backButton.style.color = '#fff'
    backButton.style.border = 'none'
    backButton.style.borderRadius = '5px'
    backButton.style.cursor = 'pointer'
    backButton.style.display = 'none' // Initially hidden
    document.body.appendChild(backButton)

    // Function to handle loading state
    function setLoading(isLoading) {
      if (isLoading) {
        backButton.style.display = 'none' // Hide button during loading
      } else {
        backButton.style.display = 'block' // Show button after loading
      }
    }

    // Example usage
    setLoading(true) // Simulate loading state

    setTimeout(() => {
      setLoading(false) // End loading state and show button
    }, 5000)

    backButton.onclick = () => {
      modal.remove() // Remove modal when back button is clicked
    }

    // Append elements to modal
    modal.appendChild(backButton)
    modal.appendChild(loadingIndicator)
    modal.appendChild(iframe)

    // Append modal to body
    document.body.appendChild(modal)
  } else {
    alert('No PDF available for this book.')
  }
}

// Function to toggle a book as favorite (add/remove)
const toggleFavorite = async book => {
  try {
    const isFav = isFavorite(book)
    if (isFav) {
      // Remove from favorites
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId.value)
        .eq('book_id', book.id)

      // Update UI
      favoriteBooks.value = favoriteBooks.value.filter(
        favBook => favBook.id !== book.id,
      )
      console.log('Book removed from favorites:', book)
    } else {
      // Add to favorites
      await supabase.from('favorites').insert([
        {
          user_id: userId.value,
          book_id: book.id,
        },
      ])
      // Refresh the list
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

// On Component Mount
onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data?.session?.user) {
      router.push('/login') // Redirect if not logged in
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
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible" />
    </template>

    <template #content>
      <v-container>
        <h1 class="text-right my-4">
          <v-btn icon color="black" dark class="fav-icon mx-6">
            <v-icon color="purple">mdi-heart</v-icon>
          </v-btn>
        </h1>

        <v-row dense>
          <v-col
            v-for="book in favoriteBooks"
            :key="book.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-img
                :src="book.coverImage"
                height="200px"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              />
              <v-card-title>{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.author }}</v-card-subtitle>
              <v-card-actions class="d-flex justify-center">
                <v-btn
                  color="purple"
                  dark
                  class="bordered mx-2 mt-5"
                  @click="readBook(book.booksUrl)"
                  >Read</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  color="purple"
                  dark
                  class="glow mx-2 mt-5"
                  @click="toggleFavorite(book)"
                >
                  <v-icon :color="isFavorite(book) ? 'purple' : ''"
                    >mdi-heart</v-icon
                  >
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <p v-if="favoriteBooks.length === 0" class="text">
          No favorite books added yet.
        </p>
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
/* .gradient-text {
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
} */
</style>
