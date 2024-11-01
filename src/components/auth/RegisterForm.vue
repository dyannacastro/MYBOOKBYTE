<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator
} from '@/utils/validators';
import { ref } from 'vue';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { supabase, formActionDefault } from '@/utils/supabase.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: ''
};
const formData = ref({
  ...formDataDefault
});
const formAction = ref({
  ...formActionDefault
});
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);
const refVForm = ref();

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  // Create display_name by combining first and last name
  const displayName = `${formData.value.firstname} ${formData.value.lastname}`;

  // Register the user using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        display_name: displayName, // Add display name here
      }
    }
  });

  if (error) {
    formAction.value.formErrorMessage = error.message;
    formAction.value.formProcess = false;
    return;
  }

  if (data?.user) {
    formAction.value.formSuccessMessage = 'Successfully Registered Account.';

    // Fetch the complete user information after registration
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user data after registration:', userError);
      } else {
        // Set the user data in the Pinia store, including metadata
        authStore.setUserData({
          ...userData.user,
          ...userData.user.user_metadata // This will include firstname, lastname, and display_name
        });
        console.log('User data set successfully after registration:', authStore.userData);
      }

    } catch (err) {
      console.error('Unexpected error while fetching user data:', err);
    }

    // Redirect user to the dashboard
    router.replace('/dashboard');
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
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form class="mt-5" ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field 
          v-model="formData.firstname"
          label="First Name" 
          :rules="[requiredValidator]"
          clearable
          class="purple-input"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field 
          v-model="formData.lastname"
          label="Last Name"
          :rules="[requiredValidator]"
          clearable
          class="purple-input"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field 
          v-model="formData.email"
          label="Email" 
          placeholder="@gmail.com"
          prepend-inner-icon="mdi-email-outline"
          :rules="[requiredValidator, emailValidator]"
          clearable
          class="purple-input"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off' "
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator, passwordValidator]"
          class="purple-input"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off' "
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          :rules="[
              requiredValidator,
              confirmedValidator(formData.password_confirmation, formData.password)
            ]"
          class="purple-input"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn
      class="mt-2"
      type="submit"
      color="purple"
      prepend-icon="mdi-account-plus"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      block
    >
      Sign up
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

.purple-input .v-input__control:focus {
  border-bottom: 2px solid purple;
}

.purple-input .v-input__control:hover {
  border-bottom: 2px solid purple;
}
</style>
