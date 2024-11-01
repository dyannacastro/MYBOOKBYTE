<script setup>
import { ref } from 'vue';

const user = ref({
  name: 'Dyanna Castro',
  email: 'ddanna@gmail.com',
  profilePicture: '/images/book-logo.png',
  about: 'I love reading books and learning new things!',
});

const saveProfile = () => {
  console.log('Profile saved!', user.value);
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-picture-container">
      <img :src="user.profilePicture" alt="Profile Picture" class="profile-picture" />
    </div>

    <div class="user-details">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>{{ user.about }}</p>
    </div>

    <button @click="saveProfile" class="save-button">Save Profile</button>
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

.profile-picture-container {
  margin-bottom: 16px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.user-details h2 {
  margin: 8px 0;
  color: #3f51b5;
}

.user-details p {
  margin: 4px 0;
  color: #666;
}

.save-button {
  margin-top: 16px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #673ab7;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.save-button:hover {
  background-color: #5e35b1;
}
</style>
