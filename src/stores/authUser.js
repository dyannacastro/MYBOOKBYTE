import { defineStore } from 'pinia';

export const useAuthUserStore = defineStore('authUser', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('userData')) || {
      image_url: '',
      firstname: '',
      lastname: '',
      email: '',
    }
  }),
  actions: {
    setUserData(data) {
      this.userData = data;
      localStorage.setItem('userData', JSON.stringify(data));
    },
    clearUserData() {
      this.userData = {
        image_url: '',
        firstname: '',
        lastname: '',
        email: '',
      };
      localStorage.removeItem('userData');
    }
  }
});
