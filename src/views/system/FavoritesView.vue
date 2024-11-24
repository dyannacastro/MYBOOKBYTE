<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SideNavigation from '@/components/layout/SideNavigation.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(false)
const favoriteBooks = ref([])
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

    // Modify query to only fetch favorites for the currently logged-in user
    const { data: favoriteData, error: fetchError } = await supabase
      .from('favorites')
      .select('book_id')
      .eq('user_id', userId.value) // Only fetch favorites for the current user

    if (fetchError) {
      console.error(
        'Error fetching favorites from Supabase:',
        fetchError.message,
        fetchError.details,
      )
      return
    }

    console.log('Favorite entries fetched from Supabase:', favoriteData)

    // If there are favorites, fetch details from the books table
    if (favoriteData && favoriteData.length > 0) {
      favoriteBooks.value = [] // Clear current favorites

      for (const favorite of favoriteData) {
        const bookId = favorite.book_id
        console.log('Fetching book details for Book ID:', bookId)

        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single()

        if (bookError) {
          console.error(
            'Error fetching book details from Supabase:',
            bookError.message,
            bookError.details,
          )
          continue // Skip if there's an issue fetching this book
        }

        console.log('Book details fetched:', bookData)

        if (bookData) {
          favoriteBooks.value.push({
            id: bookData.id,
            title: bookData.title,
            author: bookData.author,
            coverImage: bookData.cover_image,
          })
        }
      }
    } else {
      console.log('No favorite books found for user.')
      favoriteBooks.value = []
    }
  } catch (err) {
    console.error('Unexpected error while fetching favorites:', err.message)
  }
}

// Function to add a book to Supabase favorites
const addFavoriteToSupabase = async book => {
  try {
    if (!userId.value) {
      console.error('User is not authenticated. User ID is missing.')
      return
    }

    if (!book || !book.id) {
      console.error('Invalid book data. Book object or book ID is missing.')
      return
    }

    console.log('Attempting to add book to favorites:', book)

    // Insert favorite into Supabase for the current user
    const { data, error } = await supabase.from('favorites').insert([
      {
        user_id: userId.value,
        book_id: book.id,
      },
    ])

    if (error) {
      console.error(
        'Error inserting favorite to Supabase:',
        error.message,
        error.details,
      )
      return
    }

    console.log('Book successfully added to favorites in Supabase:', data)

    // Update local state to reflect added favorite
    favoriteBooks.value.push(book)
    console.log(
      'Updated favoriteBooks list after addition:',
      favoriteBooks.value,
    )
  } catch (err) {
    console.error('Unexpected error while adding favorite:', err.message)
  }
}

// Function to remove a book from Supabase favorites
const removeFavoriteFromSupabase = async id => {
  try {
    if (!userId.value) {
      throw new Error('User is not authenticated')
    }

    console.log('Attempting to remove book from favorites with ID:', id)

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId.value) // Ensure we only delete the favorite for the current user
      .eq('book_id', id)

    if (error) {
      console.error(
        'Error deleting from Supabase:',
        error.message,
        error.details,
      )
      return
    }

    console.log('Book successfully removed from favorites with ID:', id)

    // Update local state to reflect removed favorite
    favoriteBooks.value = favoriteBooks.value.filter(book => book.id !== id)
    console.log(
      'Updated favoriteBooks list after removal:',
      favoriteBooks.value,
    )
  } catch (err) {
    console.error('Error removing favorite:', err.message)
  }
}

// Function to handle adding/removing favorites
const toggleFavorite = book => {
  const index = favoriteBooks.value.findIndex(favBook => favBook.id === book.id)
  if (index === -1) {
    console.log('Book not found in favorites, adding:', book)
    addFavoriteToSupabase(book)
  } else {
    console.log('Book found in favorites, removing:', book.id)
    removeFavoriteFromSupabase(book.id)
  }
}

// Function to check if a book is a favorite
const isFavorite = book => {
  return favoriteBooks.value.some(favBook => favBook.id === book.id)
}

// Function to handle reading a book
const readBook = id => {
  console.log(`Read book with id: ${id}`)
}

// On component mounted, check if user is logged in and load their favorites
onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error fetching user session:', error.message)
      router.push('/login') // Redirect to login page if user session could not be retrieved
      return
    }

    if (data?.session?.user) {
      const user = data.session.user
      userEmail.value = user.email
      userId.value = user.id

      console.log('User email found:', user.email)
      console.log('User ID fetched successfully:', user.id)

      // Fetch the user's favorite books
      await fetchFavoritesFromSupabase()
    } else {
      console.error('No user found, unable to load favorites.')
      router.push('/login') // Redirect to login page if the user is not authenticated
    }
  } catch (err) {
    console.error('Unexpected error while loading favorites:', err.message)
    router.push('/login') // Redirect to login page if an unexpected error occurs
  }
})
</script>

<template>
  <AppLayout
    :is-with-app-bar-nav-icon="true"
    @is-drawer-visible="isDrawerVisible = !isDrawerVisible"
  >
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>

    <template #content>
      <v-container>
        <h1 class="text-right my-4">
          <!-- <span class="gradient-text">MY FAVORITES</span> -->
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
              ></v-img>
              <v-card-title>{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.author }}</v-card-subtitle>
              <v-card-actions class="d-flex justify-center">
                <v-btn
                  color="purple"
                  dark
                  class="bordered mx-2 mt-5"
                  @click="readBook(book.id)"
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
