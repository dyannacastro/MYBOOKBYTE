<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay();  
</script>

<template>
  <v-container fluid class="full-height-container">
    <v-row no-gutters class="custom-flex-container">
      
      <v-col v-if="!smAndDown" cols="12" md="6" lg="6" class="bg-surface-dark text-center d-flex flex-column align-center justify-center left-col">
        <div class="content-wrapper">
          <h1 class="gradient-text">Welcome to BookByte</h1>
          <div class="desktop-social-section">
            <p class="quote-text">Continue to Sign Up?</p>
            <v-divider class="my-3" style="border-width: 1px; opacity: 0.5;">OR</v-divider>
            <div class="social-login">
              <v-btn icon large>
                <v-icon color="red darken-1">mdi-google</v-icon>
              </v-btn>
              <v-btn icon large>
                <v-icon color="blue darken-4">mdi-facebook</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6" lg="6" class="d-flex align-center justify-center right-col">
        <v-card class="mx-auto custom-card" elevation="0">
          
          <div v-if="smAndDown" class="mobile-welcome-section">
            <h1 class="gradient-text">Welcome to BookByte</h1>
          </div>

          <v-card-title class="text-center d-flex flex-column align-center justify-center">
            <v-img
              src="/images/book-logo.png"
              :height="smAndDown ? '120px' : '200px'"
              :width="smAndDown ? '120px' : '200px'"
              contain
              class="mx-auto"
            ></v-img>
            <h2 class="bookbyte font-weight-black">BOOKBYTE</h2>
            <h5>Registration</h5>
          </v-card-title>

          <v-card-text class="pt-4">
            <v-divider class="my-2"></v-divider>

            <RegisterForm></RegisterForm>

            <v-divider class="my-5"></v-divider>

            <h5 class="text-center font-weight-black">
              Already have an account?
              <RouterLink to="/" class="custom-link">
                Log in here
              </RouterLink>
            </h5>
          </v-card-text>

          <div v-if="smAndDown" class="mobile-social-section">
            <p class="quote-text">Continue to Sign Up?</p>
            <v-divider class="my-3" style="border-width: 1px; opacity: 0.5;">OR</v-divider>
            <div class="social-login">
              <v-btn icon large>
                <v-icon color="red darken-1">mdi-google</v-icon>
              </v-btn>
              <v-btn icon large>
                <v-icon color="blue darken-4">mdi-facebook</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.full-height-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto; 
}

.custom-flex-container {
  display: flex;
  flex-wrap: wrap; 
  height: 100vh; 
}

.left-col,
.right-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px; 
}

.content-wrapper {
  width: 100%;  
  max-width: 500px; 
}

.bookbyte {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
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

.gradient-text {
  background: linear-gradient(45deg, #64c0ce, #b909fe, #64c0ce);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
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

@media (max-width: 600px) {
  .gradient-text {
    font-size: 2rem;
  }
}

.quote-text {
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 600px) {
  .quote-text {
    font-size: 0.8rem;
  }
}

.custom-card {
  max-width: 600px; 
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px; 
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px; 
}

.custom-link {
  color: #b39ddb; 
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline; 
}

.custom-link:active, .custom-link:focus {
  color: #b39ddb;
}

.mobile-social-section {
  margin-top: 15px;
  padding-bottom: 10px;
  text-align: center;
}

.desktop-social-section {
  margin-top: 20px;
  text-align: center;
}

.mobile-welcome-section {
  text-align: center;
  margin-bottom: 10px;
}
</style>
