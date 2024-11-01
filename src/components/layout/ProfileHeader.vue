<script setup>
import { supabase, formActionDefault } from '@/utils/supabase';
import { getAvatarText } from '@/utils/helpers';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthUserStore } from '@/stores/authUser';

const router = useRouter();

const authStore = useAuthUserStore();

const formAction = ref({
  ...formActionDefault
});

const getDisplayName = () => {
  const firstname = authStore.userData?.firstname || '';
  const lastname = authStore.userData?.lastname || '';
  return `${firstname} ${lastname}`.trim() || 'Unknown User';
};

const onLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error during logout:', error);
    formAction.value.formProcess = false; 
    return;
  }

  authStore.clearUserData();

  formAction.value.formProcess = false;
  router.replace('/');
};

</script>

<template>
  <v-menu min-width="250px" rounded>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          v-if="authStore.userData && authStore.userData.image_url"
          :image="authStore.userData.image_url"
          color="deep-orange-lighten-1"
          size="large"
        />
        <v-avatar v-else color="deep-orange-lighten-1" size="large">
          <span class="text-h5">
            {{ getAvatarText(authStore.userData?.displayName || 'U') }}
          </span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="mt-1">
      <v-list nav dense>
        <v-list-item>
          <template #prepend>
            <v-avatar
              v-if="authStore.userData && authStore.userData.image_url"
              :image="authStore.userData.image_url"
              color="deep-orange-lighten-1"
              size="large"
            />
            <v-avatar v-else color="deep-orange-lighten-1" size="large">
              <span class="text-h5">
                {{ getAvatarText(authStore.userData?.displayName || 'U') }}
              </span>
            </v-avatar>
          </template>
          <template #title>
            <strong>{{ authStore.userData?.displayName || displayName }}</strong>
          </template>
          <template #subtitle>
            <span>{{ authStore.userData?.email || 'No Email Provided' }}</span>
          </template>
        </v-list-item>

        <v-divider class="my-3" />

        <v-list-item
          prepend-icon="mdi-wrench"
          to="/account/settings"
          class="nav-item"
        >
          <template #title>
            Account Settings
          </template>
        </v-list-item>

        <v-divider class="my-3" />

        <v-list-item
          prepend-icon="mdi-logout"
          @click="onLogout"
          :disabled="formAction.formProcess"
          class="nav-item"
        >
          <template #title>
            Logout
          </template>
          <template v-if="formAction.formProcess">
            <v-progress-circular
              indeterminate
              color="purple"
              size="24"
            />
          </template>
        </v-list-item>

      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
.nav-item {
  padding-left: 16px;
  padding-right: 16px;
}

.v-list-item strong {
  font-size: 1rem;
  color: black;
}

.v-divider {
  margin: 10px 0;
}

.profile-avatar {
  margin-bottom: 10px;
}
</style>
