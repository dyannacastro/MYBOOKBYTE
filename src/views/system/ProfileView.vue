<template>
    <v-container>
      <h1 class="text-center">Profile</h1>
      <v-card class="mx-auto" max-width="500">
        <v-avatar size="100" class="mx-auto mt-4">
          <v-img :src="user.profilePicture"></v-img>
        </v-avatar>
        <v-card-title class="text-center">{{ user.name }}</v-card-title>
        <v-card-subtitle class="text-center">{{ user.email }}</v-card-subtitle>
  
        <v-card-text>
          <v-text-field label="Name" v-model="user.name"></v-text-field>
          <v-text-field label="Email" v-model="user.email" readonly></v-text-field>
          <v-textarea label="About Me" v-model="user.about"></v-textarea>
        </v-card-text>
  
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="saveProfile">Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const user = ref({
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'profile-pic.jpg',
    about: 'I love reading books and learning new things!',
  })
  
  const saveProfile = () => {
    // Add logic to save the profile changes (e.g., call an API)
    console.log('Profile saved!', user.value)
  }
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  