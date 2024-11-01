<script setup>
const props = defineProps(['formSuccessMessage', 'formErrorMessage'])
</script>

<template>
 <v-alert
      shaped
      outlined
      type="success"
      v-if="props.formSuccessMessage"
      :text="props.formSuccessMessage"
      title="Success!"
      variant="tonal"
      density="compact"
      border="start"
      closable
    > 
    </v-alert>
    <v-alert
      shaped
      outlined
      type="error"
      v-if="props.formErrorMessage"
      :text="props.formErrorMessage"
      title="Ooops!"
      variant="tonal"
      density="compact"
      border="start"
      closable
    > 
    </v-alert>
</template>