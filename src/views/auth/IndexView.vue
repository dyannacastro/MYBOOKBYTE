<script setup>
import { ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const isLoading = ref(true) 

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false 
  }, 3000) 
})
</script>

<template>
  <v-app>
    <div v-if="isLoading" class="preloader">
      <div class="atom">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
        <div class="line line-3"></div>
      </div>
    </div>

    <div v-else>
      <!-- Navbar Section -->
      <v-app-bar app color="black" flat>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="purple" class="bordered btn-link mx-2 mt-5" to="/register">
              Get Started
            </v-btn>           
            <v-btn color="purple" dark class="bordered mx-2 mt-5" to="/login">
              Login
            </v-btn>
          </v-row>
        </v-container>
      </v-app-bar>

      <!-- Hero Section -->
      <v-container class="mt-16 text-center">
        <v-row align="center" justify="center">
          <v-col cols="12" md="12">
            <v-img
              src="/images/book-logo.png"
              class="circle-logo mb-4"
              max-width="300"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>

      <!-- Features Section -->
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title">Comprehensive Technology Book Library</v-card-title>
              <v-card-text>
                BOOKBYTE offers a wide selection of books focused on technology topics like programming languages (Python, JavaScript, etc.), web development, software engineering, data science, and more. Users can search for books based on categories, titles, authors, or specific tech topics, ensuring they can easily find the resources they need.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title"> "Add to Favorites" Feature</v-card-title>
              <v-card-text>
                Users can mark books as Favorites to create a personalized collection of their most preferred or frequently used books. This feature allows easy access to their favorite programming guides, tech tutorials, or reference materials without needing to search for them again. The Favorites list is saved in the user's favorite page, giving them quick access to the books they are currently reading or want to revisit in the future.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title">Ideal Resource for Students</v-card-title>
              <v-card-text>
                BOOKBYTE is particularly beneficial for students studying technology-related fields. With its wide range of up-to-date books and learning materials, students can easily find textbooks, tutorials, and reference guides on programming, software development, data science, and more. The platform's "Favorites" feature also allows students to save essential resources for quick access, making it easier for them to organize their study materials and revisit important content during exams or project work.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title">Search and Filter by Technology Topics</v-card-title>
              <v-card-text>
                BOOKBYTE offers a user-friendly search and filter feature that allows users to search for books by specific programming languages, tech frameworks, or topics like cloud computing, cybersecurity, or AI. This helps users find the most relevant books based on their area of interest or learning goals.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Book Gallery Section -->
      <v-container class="mt-16">
        <v-row>
          <v-col v-for="book in books" :key="book.id" cols="12" sm="4" md="4">
            <v-card class="book-card">
              <v-img :src="book.image" class="book-image" contain></v-img>
              <v-card-title class="book-title">{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.author }}</v-card-subtitle>
              <v-card-text>{{ book.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Terms of Use Section -->
      <v-container class="mt-16">
        <v-row>
          <v-col cols="12">
            <v-card flat class="terms-card">
              <v-card-title class="term-n-use">Terms of Use</v-card-title>
              <v-card-text>
                By accessing and using this website, you agree to the following terms and conditions. The platform allows users to search for and read books online. All content available through the website may be protected by copyright laws, and users should be aware that the availability of books for reading may vary by region.
                <br/><br/>
                The website is designed for use by human users only. Automated tools or bots that scrape or misuse the platform may be blocked from accessing the site. To ensure a smooth experience and maintain platform integrity, cookies and related technologies may be used.
                <br/><br/>
                Users are permitted to search for and read books on the platform for personal, non-commercial use. Any redistribution of content or use beyond personal reading is prohibited without proper authorization from the copyright holder.
                <br/><br/>
                By using this platform, you consent to the collection of data as outlined in our Privacy Policy, and you agree to comply with these Terms of Use. Violation of these terms may result in the suspension of access to the site.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Social Media Section -->
        <v-row justify="center" class="mt-4">
          <v-btn icon class="mx-4 social-btn rotate-on-hover">
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon class="mx-4 social-btn rotate-on-hover">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn icon class="mx-4 social-btn rotate-on-hover">
            <v-icon>mdi-email</v-icon>
          </v-btn>
          <v-btn icon class="mx-4 social-btn rotate-on-hover">
            <v-icon>mdi-whatsapp</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </div> 
  </v-app>
</template>

  
  
<script>
export default {
  data() {
    return {
      books: [
        {
          id: 1,
          title: "Introduction to Python",
          author: "Ethem Mining",
          image: "/images/python.webp",
          description: "Learn the basics of Python programming with this comprehensive guide.",
        },
        {
          id: 2,
          title: "Programming",
          author: "Alexander Bell",
          image: "/images/programming.jpg",
          description: "Deep dive into Programming language features and techniques.",
        },
        {
          id: 3,
          title: "Data Analysis",
          author: "Ali Abdulhussein",
          image: "/images/dataanalytic.png",
          description: "Explore the world of data analysis, machine learning, and statistics.",
        },
        {
          id: 4,
          title: "Cyber Security",
          author: "Mary Manjikian",
          image: "/images/cybersec.webp",
          description: "A comprehensive guide to protecting digital information and defending against cyber threats in today’s interconnected world.",
        },
        {
          id: 5,
          title: "Development",
          author: "Radu Nicoara",
          image: "/images/webdev.jpg",
          description: "Learn the essentials of web development, from foundational coding to advanced frameworks, to create dynamic and modern web applications",
        },
        {
          id: 6,
          title: "Business",
          author: "S. Christian Albright / Wayne L. Winston",
          image: "/images/business.jpg",
          description: "An insightful guide to data-driven decision-making, helping you navigate the complexities of modern business strategies and analytics.",
        },
      ],
    };
  },
};
</script>
  
<style>
.bordered {
  border: 5px solid rgb(11);
  transition: box-shadow 0.3s ease-in-out;
}

.bordered:hover {
  box-shadow: 0 0 15px purple;
}

body {
  background-color: black; 
  color: white; 
}

.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; 
}

.atom {
  position: relative;
  display: flex;
  width: 300px;
  height: 300px;
  align-items: center;
  justify-content: center;
}

.atom::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background: transparent;
  box-shadow: inset 0 0 10px #fff;
  border-radius: 50%;
}

.line {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.7;
}

.line-1 {
  --color: #f749f1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-bottom: 10px solid var(--color);
  border-top: 10px solid var(--color);
  animation: line1 2s linear infinite;
  filter: drop-shadow(0 0 10px var(--color));
}

@keyframes line1 {
  0% {
    transform: rotateY(70deg) rotateZ(0deg);
  }
  100% {
    transform: rotateY(70deg) rotateZ(360deg);
  }
}

.line-2 {
  --color: #0ff;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-right: 10px solid var(--color);
  border-left: 10px solid var(--color);
  animation: line2 3s linear infinite;
  filter: drop-shadow(0 0 10px var(--color));
}

@keyframes line2 {
  0% {
    transform: rotateX(80deg) rotateY(25deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(80deg) rotateY(25deg) rotateZ(360deg);
  }
}

.line-3 {
  --color: #b909fe;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-right: 10px solid var(--color);
  border-left: 10px solid var(--color);
  animation: line3 3s linear infinite;
  filter: drop-shadow(0 0 10px var(--color));
}

@keyframes line3 {
  0% {
    transform: rotateX(-80deg) rotateY(25deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(-80deg) rotateY(25deg) rotateZ(360deg);
  }
}
  
h1, p {
  color: white;
  padding-bottom: 10px;
}

.circle-logo {
  border-radius: 50%; 
  box-shadow: 0 0 15px rgba(216, 9, 202, 0.8); 
  animation: breathe 3s ease-in-out infinite, gradient-animation 5s ease infinite; /* Add gradient animation */
  background: linear-gradient(#c096ff,#b909fe, #f749f1, #0ff); /* Initial gradient */
  padding: 20px; /* Keep this for padding */
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1); 
  }
  50% {
    transform: scale(1.05); 
  }
}

@keyframes gradient-animation {
  0% {
    background: linear-gradient(#c096ff,#b909fe, #f749f1, #0ff);
  }
  50% {
    background: linear-gradient(#0ff, #f749f1, #b909fe, #c096ff); /* Change order for animation */
  }
  100% {
    background: linear-gradient(#c096ff,#b909fe, #f749f1, #0ff);
  }
}

.circle-logo:hover {
  transform: translateY(-5px) rotate(5deg); 
  transition: transform 1ms ease-in-out; 
}


.v-application {
  background-color: black !important; 
}

.v-card {
  background-color: black;
  color: white;
}

.custom-title {
  font-size: 25px; 
  color: plum; 
  font-weight: bold;
}

.term-n-use{
  font-size: 25px; 
  color: plum; 
  font-weight: bold;
}

.book-title {
  color: plum;
}

.book-image {
  width: 50%;  
  height: 50%; 
  object-fit: cover; 
}

.term-n-use {
  font-size: 1.5rem;
}

.terms-card {
  color: white;
  font-weight: 200;
}

.v-card-text a {
  color: #90caf9;
  text-decoration: underline;
}

.social-btn .v-icon {
  transition: color 0.3s ease;
}

.social-btn:hover .v-icon {
  color: plum; 
}

.social-btn:active .v-icon {
  color: purple; 
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotate-on-hover:hover {
  animation: rotate 0.5s linear;
}
</style> 