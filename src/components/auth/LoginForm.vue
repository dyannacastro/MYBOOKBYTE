<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formActionDefault, supabase } from '@/utils/supabase';
import { requiredValidator, emailValidator } from '@/utils/validators';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthUserStore } from '@/stores/authUser';

const router = useRouter();
const authUserStore = useAuthUserStore();

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: ''
};
const formData = ref({
  ...formDataDefault
});
const formAction = ref({
  ...formActionDefault
});
const isPasswordVisible = ref(false);
const refVForm = ref();

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  // Supabase login attempt
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password
  });

  if (data) {
    // Set user's email in localStorage
    localStorage.setItem('userEmail', data.user?.email || '');

    // Set logged-in flag for session persistence
    localStorage.setItem('loggedIn', 'true');

    // Store additional user data in the store
    authUserStore.setUserData({
      image_url: data.user?.user_metadata?.avatar_url || '',
      firstname: data.user?.user_metadata?.first_name || '',
      lastname: data.user?.user_metadata?.last_name || '',
      email: data.user?.email || '',
    });

    // Show success message and redirect to dashboard
    formAction.value.formSuccessMessage = 'Successfully Logged In!';
    router.replace('/dashboard'); // Redirect to dashboard after successful login
  }

  if (error) {
    // Handle login error
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = error.status;
  }

  refVForm.value?.reset();
  formAction.value.formProcess = false;
};

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit();
  });
};
</script>

<template>
  <AlertNotification 
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage">
  </AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row dense>
      <v-col cols="12">
        <v-text-field 
          v-model="formData.email" 
          label="Email" 
          prepend-inner-icon="mdi-email-outline"
          :rules="[requiredValidator, emailValidator]" 
          clearable 
          class="purple-input">
        </v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field 
          v-model="formData.password" 
          prepend-inner-icon="mdi-lock-outline" 
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible" 
          :rules="[requiredValidator]"
          class="purple-input">
        </v-text-field>
      </v-col>
    </v-row>

    <v-btn 
      class="mt-2" 
      type="submit" 
      color="purple" 
      prepend-icon="mdi-login" 
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess" 
      block>
      Login
    </v-btn>
  </v-form>
</template>

<style scoped>
.purple-input {
  color: #CE93D8;
}

.purple-input .v-input__control {
  border-bottom: 2px solid purple;
}

.purple-input .v-input__control:hover {
  border-bottom: 2px solid purple;
}
</style>
