<script setup>
import AppLayout from '@/components/layout/AppLayout.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase';

const isDrawerVisible = ref(false); // Define the `isDrawerVisible` variable here
const favoriteBooks = ref([]);
const userEmail = ref(null);
const userId = ref(null);
const router = useRouter(); // Import the router to handle redirection

// Function to fetch the user's favorite books from Supabase
const fetchFavoritesFromSupabase = async () => {
  try {
    console.log('Fetching favorite books for user:', userId.value);
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        book_id,
        books (
          id,
          title,
          author,
          genre,
          url
        )
      `)
      .eq('user_id', userId.value);

    if (error) {
      console.error('Error fetching favorites from Supabase:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('Successfully fetched favorite books:', data);
      favoriteBooks.value = data.map(fav => ({
        id: fav.books.id,
        title: fav.books.title,
        author: fav.books.author,
        genre: fav.books.genre,
        coverImage: fav.books.url,
      }));
    } else {
      console.log('No favorite books found for user.');
    }
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
  }
};

// Function to add a book to Supabase favorites
const addFavoriteToSupabase = async (book) => {
  try {
    console.log('Attempting to add book to favorites:', book);
    if (!userId.value) {
      throw new Error('User is not authenticated');
    }

    const { error } = await supabase
      .from('favorites')
      .insert([
        {
          user_id: userId.value,
          book_id: book.id,
        }
      ]);

    if (error) {
      console.error('Error inserting to Supabase:', error.message);
      return;
    }

    console.log('Book successfully added to favorites:', book);
    favoriteBooks.value.push(book);
  } catch (err) {
    console.error('Error adding favorite:', err.message);
  }
};

// Function to remove a book from Supabase favorites
const removeFavoriteFromSupabase = async (id) => {
  try {
    console.log('Attempting to remove book from favorites with ID:', id);
    if (!userId.value) {
      throw new Error('User is not authenticated');
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId.value)
      .eq('book_id', id);

    if (error) {
      console.error('Error deleting from Supabase:', error.message);
      return;
    }

    console.log('Book successfully removed from favorites with ID:', id);
    favoriteBooks.value = favoriteBooks.value.filter(book => book.id !== id);
  } catch (err) {
    console.error('Error removing favorite:', err.message);
  }
};

// Function to handle adding/removing favorites
const toggleFavorite = (book) => {
  const index = favoriteBooks.value.findIndex(favBook => favBook.id === book.id);
  if (index === -1) {
    addFavoriteToSupabase(book);
  } else {
    removeFavoriteFromSupabase(book.id);
  }
};

// Function to handle reading a book
const readBook = (id) => {
  console.log(`Read book with id: ${id}`);
};

// On component mounted, check if user is logged in and load their favorites
onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching user session:', error.message);
      router.push('/login'); // Redirect to login page if user session could not be retrieved
      return;
    }

    if (data?.session?.user) {
      const user = data.session.user;
      userEmail.value = user.email;
      userId.value = user.id;

      console.log('User email found:', user.email);
      console.log('User ID fetched successfully:', user.id);

      // Fetch the user's favorite books
      await fetchFavoritesFromSupabase();
    } else {
      console.error('No user found, unable to load favorites.');
      router.push('/login'); // Redirect to login page if the user is not authenticated
    }
  } catch (err) {
    console.error('Unexpected error while loading favorites:', err.message);
    router.push('/login'); // Redirect to login page if an unexpected error occurs
  }
});
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" @is-drawer-visible="isDrawerVisible = !isDrawerVisible">
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template>

    <template #content>
      <v-container>
        <h1 class="text-right my-4">
          <span class="gradient-text">MY FAVORITES</span>
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
                <v-btn icon color="purple" dark class="glow mx-2 mt-5" @click="toggleFavorite(book)">
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
/* Your existing styles */
</style>


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
</style>