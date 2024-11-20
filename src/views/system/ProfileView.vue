<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
// import AppLayout from '@/components/layout/AppLayout.vue';
// import SideNavigation from '@/components/layout/SideNavigation.vue';
import { supabase } from '@/utils/supabase'; 

const router = useRouter();

const user = ref({
  displayName: '',
  email: '',
  profilePicture: '/images/profile.jpg', 
  coverPhoto: '/images/cover.webp', 
});

const profileImage = ref(user.value.profilePicture);
const coverImage = ref(user.value.coverPhoto);

const handleImageChange = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        profileImage.value = reader.result; 
      } else if (type === 'cover') {
        coverImage.value = reader.result; 
      }
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      return;
    }

    const userId = sessionData?.session?.user?.id;
    if (!userId) {
      console.error('User is not logged in.');
      return;
    }

    const updates = {
      user_id: userId,
      img: profileImage.value,
      cover_img: coverImage.value,
    };

    const { error } = await supabase.from('user_profile').upsert(updates, { onConflict: ['user_id'] });
    if (error) {
      console.error('Error saving profile:', error);
    } else {
      console.log('Profile saved successfully!', user.value);
    }
  } catch (err) {
    console.error('Unexpected error while saving profile:', err);
  }
};

const goBack = () => {
  router.push({ name: 'dashboard' });
};

const resetUserProfileToDefaults = () => {
  user.value = {
    displayName: '',
    email: '',
    profilePicture: '/images/profile.jpg',
    coverPhoto: '/images/cover.webp',
  };
  profileImage.value = user.value.profilePicture;
  coverImage.value = user.value.coverPhoto;
};

onMounted(async () => {
  resetUserProfileToDefaults();

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      return;
    }

    const userId = sessionData?.session?.user?.id;
    if (!userId) {
      console.error('User is not logged in.');
      return;
    }

    const { data: userData, error: userFetchError } = await supabase.auth.getUser();
    if (userFetchError) {
      console.error('Error fetching user details:', userFetchError);
      return;
    }

    if (userData?.user) {
      user.value.displayName = userData.user.user_metadata?.display_name || 'No Name';
      user.value.email = userData.user.email || '';
    } else {
      console.error('No user data found in session.');
      return;
    }

    const { data, error: profileFetchError } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileFetchError) {
      console.error('Error fetching profile:', profileFetchError);
    } else if (data) {
      user.value.profilePicture = data.img || user.value.profilePicture;
      user.value.coverPhoto = data.cover_img || user.value.coverPhoto;

      profileImage.value = user.value.profilePicture;
      coverImage.value = user.value.coverPhoto;
      console.log('Profile fetched successfully!', data);
    }
  } catch (err) {
    console.error('Unexpected error while fetching profile:', err);
  }
});
</script>

<!-- <template> -->
  <!-- <AppLayout :is-with-app-bar-nav-icon="true" @is-drawer-visible="isDrawerVisible = !isDrawerVisible">
    <template #navigation>
      <SideNavigation :is-drawer-visible="isDrawerVisible"></SideNavigation>
    </template> -->

    <template>
      <div class="profile-container">
        <div class="cover-photo-container">
          <img :src="coverImage" alt="Set Cover Photo" class="cover-photo text-center" />
          <label for="cover-upload" class="cover-change-icon">
            <i class="mdi mdi-pencil"></i>
          </label>
          <input type="file" id="cover-upload" @change="(e) => handleImageChange(e, 'cover')" class="image-input" accept="image/*" />
        </div>

        <div class="profile-picture-container">
          <img :src="profileImage" alt="Profile Picture" class="profile-picture" />
          <label for="image-upload" class="image-change-icon">
            <i class="mdi mdi-pencil"></i>
          </label>
          <input type="file" id="image-upload" @change="(e) => handleImageChange(e, 'profile')" class="image-input" accept="image/*" />
        </div>

        <div class="user-details">
          <h3>{{ user.displayName }}</h3>
        </div>

        <div class="button-container">
          <v-btn @click="goBack" class="bordered back-button" color="purple" dark>
            <v-icon dark left>mdi-arrow-left</v-icon>Back
          </v-btn>
          <v-btn @click="saveProfile" class="bordered save-button" color="purple" dark>
            <v-icon dark left>mdi-content-save </v-icon> Save Profile
          </v-btn>
        </div>
      </div>
    </template>
  <!-- </AppLayout> -->
<!-- </template> -->

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 20px;
}

.cover-photo-container {
  width: 100%;
  height: 300px;
  position: relative;
  margin-bottom: 5px;
}

.cover-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.cover-change-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.cover-change-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.profile-picture-container {
  margin-top: -40px;
  position: relative;
}

.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.image-change-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.image-change-icon:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.image-input {
  display: none;
}

.user-details h3 {
  margin: 8px 0;
  color: purple;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
}

.bordered {
  border-radius: 8px;
  padding: 8px;
  transition: box-shadow 0.3s ease-in-out;
}

.bordered:hover {
  box-shadow: 0 0 10px 8px rgba(186, 104, 200, 1);
}
</style>
