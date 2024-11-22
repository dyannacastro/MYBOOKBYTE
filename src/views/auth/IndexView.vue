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
      <v-app-bar app color="black" flat>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
              color="purple"
              class="bordered btn-link mx-2 mt-5"
              to="/register"
            >
              Get Started
            </v-btn>
            <v-btn color="purple" dark class="bordered mx-2 mt-5" to="/login">
              Login
            </v-btn>
          </v-row>
        </v-container>
      </v-app-bar>

      <v-container class="mt-16 text-center">
        <v-row align="center" justify="center">
          <v-col cols="12" md="12">
            <v-img
              src="/images/book-logo.png"
              class="circle-logo mb-4"
              max-width="280"
              :style="{ width: '100%', 'max-width': '270px' }"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>

      <!-- Features Section -->
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title"
                >Comprehensive Book Library</v-card-title
              >
              <v-card-text>
                BOOKBYTE offers a wide selection of books across various genres
                and topics. Users can explore categories such as fiction,
                non-fiction, self-help, education, science, history, and more.
                With the ability to search by category, or title. BOOKBYTE
                ensures an easy and seamless experience to help readers find the
                books they need.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title">
                "Add to Favorites" Feature</v-card-title
              >
              <v-card-text>
                Users can mark books as Favorites to create a personalized
                collection of their most loved or frequently used titles. This
                feature provides easy access to cherished novels, educational
                resources, or reference materials without the need to search
                repeatedly. The Favorites list is conveniently saved on the
                user's Favorites page, offering quick access to books they are
                currently reading or wish to revisit in the future.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title"
                >Ideal Resource for Everyone</v-card-title
              >
              <v-card-text>
                BOOKBYTE is a valuable resource for readers of all kinds. With
                its extensive collection of books and learning materials, users
                can explore a wide range of topics, from literature and science
                to technology and self-improvement. The platform's "Favorites"
                feature allows users to save their preferred books for quick
                access, making it easier to organize their reading list and
                revisit important content whenever needed.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="custom-title"
                >Search and Filter by Book Titles</v-card-title
              >
              <v-card-text>
                BOOKBYTE offers a user-friendly search and filter feature,
                allowing users to find books by specific titles genres, or
                topics of interest. Whether you're searching for a captivating
                novel, a self-help guide, or an academic textbook, the platform
                makes it easy to discover books tailored to your preferences and
                reading goals.
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
      <v-container class="mt-10">
        <v-row>
          <v-col cols="12">
            <v-card flat class="terms-card">
              <v-card-title class="term-n-use">Terms of Use</v-card-title>
              <v-card-text>
                By accessing and using this website, you agree to the following
                terms and conditions. The platform allows users to search for
                and read books online. All content available through the website
                may be protected by copyright laws, and users should be aware
                that the availability of books for reading may vary by region.
                <br /><br />
                The website is designed for use by human users only. Automated
                tools or bots that scrape or misuse the platform may be blocked
                from accessing the site. To ensure a smooth experience and
                maintain platform integrity, cookies and related technologies
                may be used.
                <br /><br />
                Users are permitted to search for and read books on the platform
                for personal, non-commercial use. Any redistribution of content
                or use beyond personal reading is prohibited without proper
                authorization from the copyright holder.
                <br /><br />
                By using this platform, you consent to the collection of data as
                outlined in our Privacy Policy, and you agree to comply with
                these Terms of Use. Violation of these terms may result in the
                suspension of access to the site.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Genre Menu Section -->
      <section class="genre-menu">
        <nav>
          <ul>
            <li style="--book-tag-accent-color: #008fd4">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/fantasy.svg"
                  alt="Fantasy"
                  title="Fantasy"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Fantasy
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #ff3d9d">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/romance.svg"
                  alt="Romance"
                  title="Romance"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Romance
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #ffc400">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/scifi.svg"
                  alt="Science Fiction"
                  title="Science Fiction"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Fiction
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #fdf5d0">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/bestsellers.svg"
                  alt="Bestsellers"
                  title="Bestsellers"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Bestsellers
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #972d93">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/thriller.svg"
                  alt="Thriller"
                  title="Thriller"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Mystery
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #00d5cb">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/movies.svg"
                  alt="Book to Screen"
                  title="Book to Screen"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Adventure
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #ff4081">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/lgbtq.svg"
                  alt="LGBTQIA+"
                  title="LGBTQIA+"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Psychology
                </figcaption>
              </figure>
            </li>
            <li style="--book-tag-accent-color: #ff8300">
              <figure>
                <img
                  src="https://simonteen.b-cdn.net/app/uploads/2023/05/nonfiction.svg"
                  alt="Nonfiction"
                  title="Nonfiction"
                />
                <figcaption style="color: var(--book-tag-accent-color)">
                  Education
                </figcaption>
              </figure>
            </li>
          </ul>
        </nav>
      </section>

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
          title: 'Julius Caesar',
          author: 'Philip Freeman',
          image: '/images/juliuss c.jpg',
          description:
            'Explore the remarkable life of Julius Caesar, a military genius and political innovator. This biography unveils his journey from a young noble to Rome’s most powerful leader.',
        },
        {
          id: 2,
          title: 'Ulysses',
          author: 'James Joyce',
          image: '/images/ulysses.jpg',
          description:
            'Follow Leopold Bloom’s day-long journey through the streets of Dublin. This modernist masterpiece intricately captures the thoughts, struggles, and emotions of its characters.',
        },
        {
          id: 3,
          title: 'Harry Potter',
          author: 'J.K Rowling',
          image: '/images/hp1.webp',
          description:
            'Join Harry Potter as he discovers his magical heritage and battles dark forces. The story is filled with friendship, bravery, and the triumph of good over evil.',
        },
        {
          id: 4,
          title: 'Cyber Security',
          author: 'Mary Manjikian',
          image: '/images/cybersec.webp',
          description:
            'Learn how to protect sensitive data and stay ahead of cyber threats. This guide delves into practical techniques and critical strategies for a safer digital future.',
        },
        {
          id: 5,
          title: 'A Tale Of Two Cities',
          author: 'Charles Dickens',
          image: '/images/a tale of 2 cities.jpg',
          description:
            'Set against the turmoil of the French Revolution, this tale weaves a story of love, sacrifice, and redemption. It captures the dramatic contrasts between London and Paris during this turbulent time.',
        },
        {
          id: 6,
          title: 'The Deerslayer',
          author: 'James Fenimore Cooper',
          image: '/images/deerslayer.jpg',
          description:
            'Embark on an adventure in the wilderness of early America. This classic tells the story of Natty Bumppo and his courageous exploits on the frontier.',
        },
      ],
    }
  },
}
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
  content: '';
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

h1,
p {
  color: white;
  padding-bottom: 10px;
}

.circle-logo {
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(216, 9, 202, 0.8);
  animation:
    breathe 3s ease-in-out infinite,
    gradient-animation 5s ease infinite;
  background: linear-gradient(#c096ff, #b909fe, #f749f1, #0ff);
  padding: 20px;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes gradient-animation {
  0% {
    background: linear-gradient(#c096ff, #b909fe, #f749f1, #0ff);
  }

  50% {
    background: linear-gradient(#0ff, #f749f1, #b909fe, #c096ff);
  }

  100% {
    background: linear-gradient(#c096ff, #b909fe, #f749f1, #0ff);
  }
}

.circle-logo:hover {
  transform: translateY(-5px) rotate(5deg);
  transition: transform 1ms ease-in-out;
}

@media (max-width: 480px) {
  .circle-logo {
    max-width: 180px !important;
    width: 100% !important;
  }
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

.term-n-use {
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

.genre-menu {
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #212121;
}

.genre-menu nav ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 10px;
  justify-content: center;
}

.genre-menu nav ul li {
  flex: 1 1 calc(25% - 20px);
  max-width: 120px;
  text-align: center;
  transition: transform 0.2s ease;
  animation: slideAnimation 3s linear infinite;
}

.genre-menu nav ul li:hover {
  transform: scale(1.1);
}

.genre-menu nav ul li figure {
  margin: 0;
}

.genre-menu nav ul li img {
  width: 100%;
  max-width: 100px;
  height: auto;
  display: block;
  margin: 0 auto 5px;
  transition: transform 0.5s ease;
}

.genre-menu nav ul li img:hover {
  transform: scale(1.1);
}

.genre-menu nav ul li figcaption {
  font-size: 14px;
  word-wrap: break-word;
  color: white;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .genre-menu nav ul li {
    flex: 1 1 calc(33.33% - 20px);
    max-width: 100px;
  }

  .genre-menu nav ul li figcaption {
    font-size: 12px;
  }
}

@media screen and (max-width: 480px) {
  .genre-menu nav ul li {
    flex: 1 1 calc(50% - 10px);
    max-width: 80px;
  }

  .genre-menu nav ul li img {
    max-width: 60px;
  }

  .genre-menu nav ul li figcaption {
    font-size: 10px;
  }

  .genre-menu nav ul li {
    animation: mobileSlideAnimation 3s linear infinite;
  }
}

@keyframes slideAnimation {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(50px);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes mobileSlideAnimation {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(10px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
