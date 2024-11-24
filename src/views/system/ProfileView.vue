<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/utils/supabase'

const router = useRouter()

const user = ref({
  displayName: '',
  email: '',
  profilePicture: '/images/profile.jpg',
  coverPhoto: '/images/cover.webp',
})

const profileImage = ref(user.value.profilePicture)
const coverImage = ref(user.value.coverPhoto)
const favoriteBooks = ref([])

const quotes = ref([
  {
    author: 'Oscar Wilde',
    text: '“Be yourself; everyone else is already taken.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1673611182i/3565._UX200_CR0,15,200,200_.jpg',
  },
  {
    author: 'Frank Zappa',
    text: '“So many books, so little time.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1696236573i/22302._UX200_CR0,0,200,200_.jpg',
  },
  {
    author: 'Albert Einstein',
    text: "“Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.”",
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1429114964i/9810._UX200_CR0,14,200,200_.jpg',
  },
  {
    author: 'Marcus Tullius Cicero',
    text: '“A room without books is like a body without a soul.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1197881416i/13755._UX200_CR0,47,200,200_.jpg',
  },
  {
    author: 'Dr. Seuss',
    text: "“You know you're in love when you can't fall asleep because reality is finally better than your dreams.”",
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1193930952i/61105._UX200_CR0,30,200,200_.jpg',
  },
  {
    author: 'Mae West',
    text: '“You only live once, but if you do it right, once is enough.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1198551937i/259666._UX200_CR0,16,200,200_.jpg',
  },
  {
    author: 'Mahatma Gandhi',
    text: '“Be the change that you wish to see in the world.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1356810912i/5810891._UX200_CR0,21,200,200_.jpg',
  },
  {
    author: 'Robert Frost',
    text: "“In three words I can sum up everything I've learned about life: it goes on.”",
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1605640483i/7715._UX200_CR0,33,200,200_.jpg',
  },
  {
    author: 'J.K. Rowling',
    text: "“If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.”",
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1596216614i/1077326._UX200_CR0,15,200,200_.jpg',
  },
  {
    author: 'Albert Camus',
    text: '“Don’t walk in front of me… I may not follow. Don’t walk behind me… I may not lead. Walk beside me… just be my friend.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1686463588i/957894._UY200_CR46,0,200,200_.jpg',
  },
  {
    author: 'Mark Twain',
    text: "“If you tell the truth, you don't have to remember anything.”",
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1322103868i/1244._UX200_CR0,40,200,200_.jpg',
  },
  {
    author: 'Maya Angelou',
    text: "“I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.”",
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1379017377i/3503._UX200_CR0,6,200,200_.jpg',
  },
  {
    author: 'Ray Bradbury',
    text: '“You don’t have to burn books to destroy a culture. Just get people to stop reading them.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1445955959i/1630._UX200_CR0,14,200,200_.jpg',
  },
  {
    author: 'Oscar Wilde',
    text: '“To live is the rarest thing in the world. Most people exist, that is all.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1673611182i/3565._UX200_CR0,15,200,200_.jpg',
  },
  {
    author: 'Martin Luther King Jr.',
    text: '“Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1198518558i/23924._UX200_CR0,21,200,200_.jpg',
  },
  {
    author: 'Elbert Hubbard',
    text: '“A friend is someone who knows all about you and still loves you.”',
    img: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1216826209i/114059._CR0,24,200,200_.jpg',
  },
])

const currentQuoteIndex = ref(0)
let quoteInterval

// Function to automatically move to the next quote
const startQuoteRotation = () => {
  quoteInterval = setInterval(() => {
    currentQuoteIndex.value =
      (currentQuoteIndex.value + 1) % quotes.value.length
  }, 5000) // Change quote every 5 seconds
}

// Stop the quote rotation when the component is destroyed
const stopQuoteRotation = () => {
  if (quoteInterval) {
    clearInterval(quoteInterval)
  }
}

const handleImageChange = (event, type) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'profile') {
        profileImage.value = reader.result
      } else if (type === 'cover') {
        coverImage.value = reader.result
      }
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()
    if (sessionError) {
      console.error('Error fetching session:', sessionError)
      return
    }

    const userId = sessionData?.session?.user?.id
    if (!userId) {
      console.error('User is not logged in.')
      return
    }

    const updates = {
      user_id: userId,
      img: profileImage.value,
      cover_img: coverImage.value,
    }

    const { error } = await supabase
      .from('user_profile')
      .upsert(updates, { onConflict: ['user_id'] })
    if (error) {
      console.error('Error saving profile:', error)
    } else {
      console.log('Profile saved successfully!', user.value)
    }
  } catch (err) {
    console.error('Unexpected error while saving profile:', err)
  }
}

const goBack = () => {
  router.push({ name: 'dashboard' })
}

const resetUserProfileToDefaults = () => {
  user.value = {
    displayName: '',
    email: '',
    profilePicture: '/images/profile.jpg',
    coverPhoto: '/images/cover.webp',
  }
  profileImage.value = user.value.profilePicture
  coverImage.value = user.value.coverPhoto
}

// Function to fetch favorite books of the user from the Supabase database
const fetchFavoriteBooks = async () => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()
    if (sessionError) {
      console.error('Error fetching session:', sessionError)
      return
    }

    const userId = sessionData?.session?.user?.id
    if (!userId) {
      console.error('User is not logged in.')
      return
    }

    const { data: favoritesData, error: favoritesError } = await supabase
      .from('favorites')
      .select('book_id, books (title, author, cover_image)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (favoritesError) {
      console.error('Error fetching favorite books:', favoritesError)
      return
    }

    // Format favorite books into a usable array
    favoriteBooks.value = favoritesData.map(fav => ({
      id: fav.book_id,
      title: fav.books.title,
      author: fav.books.author,
      coverImage: fav.books.cover_image,
    }))
  } catch (err) {
    console.error('Unexpected error while fetching favorite books:', err)
  }
}

onMounted(async () => {
  resetUserProfileToDefaults()

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()
    if (sessionError) {
      console.error('Error fetching session:', sessionError)
      return
    }

    const userId = sessionData?.session?.user?.id
    if (!userId) {
      console.error('User is not logged in.')
      return
    }

    const { data: userData, error: userFetchError } =
      await supabase.auth.getUser()
    if (userFetchError) {
      console.error('Error fetching user details:', userFetchError)
      return
    }

    if (userData?.user) {
      user.value.displayName =
        userData.user.user_metadata?.display_name || 'No Name'
      user.value.email = userData.user.email || ''
    } else {
      console.error('No user data found in session.')
      return
    }

    const { data, error: profileFetchError } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (profileFetchError) {
      console.error('Error fetching profile:', profileFetchError)
    } else if (data) {
      user.value.profilePicture = data.img || user.value.profilePicture
      user.value.coverPhoto = data.cover_img || user.value.coverPhoto

      profileImage.value = user.value.profilePicture
      coverImage.value = user.value.coverPhoto
      console.log('Profile fetched successfully!', data)
    }

    // Fetch the user's favorite books
    await fetchFavoriteBooks()

    // Start rotating quotes when the profile page is mounted
    startQuoteRotation()
  } catch (err) {
    console.error('Unexpected error while fetching profile:', err)
  }
})

// Clear the interval when the component is destroyed
onUnmounted(() => {
  stopQuoteRotation()
})
</script>

<template>
  <div class="profile-container">
    <div class="cover-photo-container">
      <img
        :src="coverImage"
        alt="Set Cover Photo"
        class="cover-photo text-center"
      />
      <label for="cover-upload" class="cover-change-icon">
        <i class="mdi mdi-pencil"></i>
      </label>
      <input
        type="file"
        id="cover-upload"
        @change="e => handleImageChange(e, 'cover')"
        class="image-input"
        accept="image/*"
      />
    </div>

    <div class="profile-picture-container">
      <img :src="profileImage" alt="Profile Picture" class="profile-picture" />
      <label for="image-upload" class="image-change-icon">
        <i class="mdi mdi-pencil"></i>
      </label>
      <input
        type="file"
        id="image-upload"
        @change="e => handleImageChange(e, 'profile')"
        class="image-input"
        accept="image/*"
      />
    </div>

    <div class="user-details">
      <h3>{{ user.displayName }}</h3>
    </div>

    <div class="button-container">
      <v-btn @click="goBack" class="bordered back-button" color="purple" dark>
        <v-icon dark left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-btn
        @click="saveProfile"
        class="bordered save-button"
        color="purple"
        dark
      >
        <v-icon dark left>mdi-content-save</v-icon> Save Profile
      </v-btn>
    </div>

    <!-- Divider Section -->
    <div class="divider">
      <span>Quote of the Moment</span>
    </div>

    <!-- Quotes Section -->
    <div class="quote-section">
      <div class="quote-container">
        <img
          :src="quotes[currentQuoteIndex].img"
          alt="Quote Author"
          class="quote-avatar"
        />
        <div class="quote-text">
          <p>{{ quotes[currentQuoteIndex].text }}</p>
          <p>
            <strong>― {{ quotes[currentQuoteIndex].author }}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Divider Section -->
    <div class="divider">
      <span>My Favorite Books</span>
    </div>

    <!-- Favorite Books Section -->
    <div class="favorite-books-section">
      <div v-if="favoriteBooks.length > 0" class="favorite-books-grid">
        <div v-for="book in favoriteBooks" :key="book.id" class="book-card">
          <v-card>
            <v-img :src="book.coverImage" height="200px"></v-img>
            <v-card-title>{{ book.title }}</v-card-title>
            <v-card-subtitle>{{ book.author }}</v-card-subtitle>
          </v-card>
        </div>
      </div>
      <p v-else class="no-favorites-text">
        You haven't added any favorite books yet.
      </p>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 20px;
}

.cover-photo-container {
  width: 100%;
  height: 300px;
  position: relative;
  margin-bottom: 5px;
}

.cover-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.cover-change-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.cover-change-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.profile-picture-container {
  margin-top: -40px;
  position: relative;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.image-change-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.image-change-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.image-input {
  display: none;
}

.user-details h3 {
  margin: 8px 0;
  color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.bordered {
  border-radius: 8px;
  padding: 8px;
  transition: box-shadow 0.3s ease-in-out;
}

.bordered:hover {
  box-shadow: 0 0 10px 8px rgba(186, 104, 200, 1);
}

/* Divider Style */
.divider {
  position: relative;
  text-align: center;
  width: 100%;
  margin: 40px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: linear-gradient(
    45deg,
    #000,
    plum,
    #262626,
    #b408a3cf,
    #64c0ce,
    #000
  );
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}
.divider-span {
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
/* Quotes Section Styles */
.quote-section {
  margin-top: 40px;
  text-align: center;
}

.quote-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.quote-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.quote-text {
  font-size: 1.2rem;
  color: #333;
  max-width: 400px;
}

/* Favorite Books Section Styles */
.favorite-books-section {
  margin-top: 40px;
  width: 100%;
  text-align: center;
}

.favorite-books-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.book-card {
  max-width: 200px;
}

.v-card-title{
  color: rgb(234, 8, 234);
  font-size: 1rem;
}

.no-favorites-text {
  color: #666;
  margin-top: 20px;
}
</style>
