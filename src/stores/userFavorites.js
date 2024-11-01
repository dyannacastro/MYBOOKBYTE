import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteBooks = ref([]);

  const addFavorite = (book) => {
    if (!favoriteBooks.value.find((b) => b.title === book.title)) {
      favoriteBooks.value.push(book);
    }
  };

  const removeFavorite = (bookId) => {
    favoriteBooks.value = favoriteBooks.value.filter((book) => book.id !== bookId);
  };

  return { favoriteBooks, addFavorite, removeFavorite };
});
