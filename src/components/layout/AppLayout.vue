<script setup>
import { isAuthenticated } from '@/utils/supabase'
import SideNavigation from './SideNavigation.vue'
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'

const teams = ref({
  systemAnalyst: [
    {
      name: 'Christine Pearl Aboc',
      image: '/images/cp.jpg',
      facebook: 'https://web.facebook.com/christinepearl.aboc.5',
      github: 'https://github.com/christine'
    },
  ],
  developers: [
    {
      name: 'Dyanna Joy Castro',
      image: '/images/dj.jpg',
      facebook: 'https://web.facebook.com/ddannaaaa',
      github: 'https://github.com/dyannacastro'
    },
    {
      name: 'Pearl Janette Cacayan',
      image: '/images/pj.jpg',
      facebook: 'https://web.facebook.com/pearlyangssss/',
      github: 'https://github.com/pearljanettecacayan'
    },
  ]
});

const props = defineProps(['isWithAppBarNavIcon'])
const { mobile } = useDisplay()
const isDrawerVisible = ref(false)
const isLoggedIn = ref(false)
const showDialog = ref(false)

// Function to toggle the drawer visibility
const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

// Function to check the logged-in status
const getLoggedStatus = async () => {
  isLoggedIn.value = await isAuthenticated()
}

// Function to open the dialog with all team members
const showAllMembers = () => {
  showDialog.value = true
}

// Fetch logged-in status on component mount
onMounted(() => {
  getLoggedStatus()
})
</script>

<template>
  <v-responsive>
    <v-app :class="{ 'blur-background': showDialog }">

      <v-app-bar class="px-3" border>
        <v-app-bar-nav-icon v-if="props.isWithAppBarNavIcon" icon="mdi-menu" class="white-icon" @click="toggleDrawer" />
        <v-list-item>
          <template #title>
            <span class="welcome-text">Welcome to BookByte</span>
          </template>
        </v-list-item>
        <v-spacer></v-spacer>
      </v-app-bar>


      <SideNavigation v-model:isDrawerVisible="isDrawerVisible" />

      <v-main>
        <slot name="navigation" />
        <slot name="content" />
      </v-main>

      <v-footer class="footer font-weight-bold d-flex justify-center align-center" :class="mobile ? 'text-caption' : ''"
        color="black" app>
        <div :class="mobile ? 'w-100 text-center' : 'd-flex align-center text-center'">
          <img src="/images/book-logo.png" alt="BookByte Logo" class="footer-logo" />

          <p class="font-italic ml-2">
            © 2024 <span class="font-weight-thin">BookByte | All Rights Reserved</span>
            <span @click="showAllMembers" class="teams-link" style="color: aqua; padding: 5px;">Teams</span>
          </p>
        </div>
      </v-footer>



      <!-- Team Members -->
      <v-dialog v-model="showDialog" max-width="600px">
        <div class="card-background">
          <v-card elevation="8" class="pa-4" style="background-color: black;">
            <v-card-title class="font-weight-bold mb-8 text-center" style="color: plum;">Bookbyte Team</v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="(members, team) in teams" :key="team" cols="12">
                  <h3 class="mt-4" :class="team === 'systemAnalysts' ? 'system-analysts' : 'developers'">
                    {{ team.charAt(0).toUpperCase() + team.slice(1).replace(/([A-Z])/g, ' $1') }}
                  </h3>
                  <v-row>
                    <v-col v-for="member in members" :key="member.name" cols="6" class="d-flex align-center mb-2">
                      <v-img :src="member.image" width="50" height="50" class="mr-2 circular-image" />
                      <div>
                        <span>{{ member.name }}</span>
                        <br />
                        <div class="social-links">
                          <a v-if="member.facebook" :href="member.facebook" target="_blank" class="facebook">
                            <v-icon small>mdi-facebook</v-icon>
                          </a>
                          <a v-if="member.github" :href="member.github" target="_blank" class="github">
                            <v-icon small>mdi-github</v-icon>
                          </a>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="showDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-dialog>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.white-icon {
  color: white !important;
  border: 2px solid plum;
  border-radius: 50%;
  padding: 5px;
}

.font-weight-thin {
  color: blueviolet;
}

.teams-link {
  text-decoration: underline;
  cursor: pointer;
  color: white;
}

.card-background {
  background-color: rgba(255, 0, 255, 0.5);
  padding: 3px;
  border-radius: 10px;
  margin: 10px;
}

.blur-background {
  filter: blur(5px);
  transition: filter 0.3s ease;
}

.system-analysts {
  color: plum;
}

.developers {
  color: plum;
}

.social-links {
  display: flex;
  align-items: center;
}

.facebook {
  color: blue;
  text-decoration: none;
  margin-right: 5px;
}

.github {
  color: white;
  text-decoration: none;
}

.welcome-text {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #000, #000, #000, #000, plum, #b408a3cf, #64c0ce, #000);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-animation 5s ease infinite;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}

.footer-logo {
  max-width: 45px;
  height: auto;
}

.v-footer .d-flex {
  align-items: center;
}

.v-footer p {
  margin-left: 10px;
}

.v-app-bar {
  background: black
}
</style>