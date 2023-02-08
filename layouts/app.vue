<script setup lang="ts">
import Sidebar from "~/components/layout/Sidebar.vue";
import CommandConsole from "~/components/layout/CommandConsole.vue";
</script>

<template>
  <div class="h-screen flex">
    <CommandConsole />
    <Sidebar />
    <slot />
  </div>
</template>
