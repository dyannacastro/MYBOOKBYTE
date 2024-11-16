<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const user = ref({
  name: 'Dyanna Castro',
  email: 'ddanna@gmail.com',
  profilePicture: '/images/profilleee.jpg', // Default profile picture
  coverPhoto: '/images/default-cover.jpg', // Default cover photo
  about: 'I love reading books and learning new things!',
});

const router = useRouter();

// To handle the profile and cover image updates
const profileImage = ref(user.value.profilePicture);
const coverImage = ref(user.value.coverPhoto);

// Function to handle the profile picture or cover photo change
const handleImageChange = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        profileImage.value = reader.result; // Update profile picture
      } else if (type === 'cover') {
        coverImage.value = reader.result; // Update cover photo
      }
    };
    reader.readAsDataURL(file);
  }
};

// Function to save the profile (to localStorage)
const saveProfile = () => {
  user.value.profilePicture = profileImage.value;
  user.value.coverPhoto = coverImage.value;
  localStorage.setItem('userProfile', JSON.stringify(user.value)); // Save to localStorage
  console.log('Profile saved!', user.value);
};

// Function to go back to the dashboard
const goBack = () => {
  router.push({ name: 'dashboard' });
};

// On component mount, load the profile from localStorage if it exists
onMounted(() => {
  const storedProfile = localStorage.getItem('userProfile');
  if (storedProfile) {
    user.value = JSON.parse(storedProfile);
    profileImage.value = user.value.profilePicture;
    coverImage.value = user.value.coverPhoto;
  }
});
</script>

<template>
  <div class="profile-container">
    <!-- Cover Photo Section -->
    <div class="cover-photo-container">
      <img :src="coverImage" alt="Set Cover Photo" class="cover-photo text-center" />
      <label for="cover-upload" class="cover-change-icon">
        <i class="mdi mdi-pencil"></i>
      </label>
      <input type="file" id="cover-upload" @change="(e) => handleImageChange(e, 'cover')" class="image-input"
        accept="image/*" />
    </div>

    <div class="profile-picture-container">
      <img :src="profileImage" alt="Profile Picture" class="profile-picture" />
      <label for="image-upload" class="image-change-icon">
        <i class="mdi mdi-pencil"></i>
      </label>
      <input type="file" id="image-upload" @change="(e) => handleImageChange(e, 'profile')" class="image-input"
        accept="image/*" />
    </div>

    <div class="user-details">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>{{ user.about }}</p>
    </div>

    <div class="button-container">
      <button @click="goBack" class="edit-button"><v-icon dark left>
          mdi-arrow-left
        </v-icon>Back</button>
      <button @click="saveProfile" class="save-button">Save Profile</button>

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

.user-details h2 {
  margin: 8px 0;
  color: #3f51b5;
}

.user-details p {
  margin: 4px 0;
  color: #666;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
}

.save-button,
.edit-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.save-button {
  background-color: purple;
}

.save-button:hover {
  background-color: rgb(76, 11, 76);
}

.edit-button {
  background-color: mediumturquoise;
}

.edit-button:hover {
  background-color: rgb(17, 87, 84);
}
</style>