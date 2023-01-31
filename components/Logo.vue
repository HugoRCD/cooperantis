<script setup lang="ts">
const applicationName = useAppConfig().appName;
defineProps({
  isText: {
    type: Boolean,
    default: false
  },
  isLogo: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div>
    <NuxtLink :to="{ name: 'Home' }" class="flex flex-shrink-0 items-center">
      <img v-if="isLogo"
        class="block h-6 w-auto lg:hidden"
        src="../assets/media/logo-cooperantis.svg"
        :alt="applicationName"
      />
      <img v-if="isLogo"
        class="hidden h-6 w-auto lg:block"
        src="../assets/media/logo-cooperantis.svg"
        :alt="applicationName"
      />
      <span class="text-md font-bold text-primary ml-2" v-if="isText">
        {{ applicationName }}
      </span>
    </NuxtLink>
  </div>
</template>