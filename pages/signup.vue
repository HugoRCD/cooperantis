<script setup lang="ts">
import { Professions } from "~/types/User";

definePageMeta({
  name: "Signup",
  title: "Signup",
});

const username = ref("");
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const passwordConfirm = ref("");

const profession = ref("");

const address = ref("");
const city = ref("");
const country = ref("");
const postalCode = ref("");

const disabled = computed(() => {
  return password.value.length < 8 || password.value !== passwordConfirm.value;
});

const loading = ref(false);
const signup = async () => {
  loading.value = true;
  await useSignup({
    username: username.value,
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
    profession: profession.value,
    address: address.value,
    city: city.value,
    country: country.value,
    postalCode: postalCode.value,
  });
  loading.value = false;
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <Logo :isText="false" class="flex justify-center" size="12" />
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-primary">Sign up for your account</h2>
    </div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md mt-12">
      <form class="space-y-6" @submit.prevent="signup">
        <input
          id="username"
          name="username"
          autocomplete="username"
          required
          placeholder="Username"
          class="input"
          v-model="username"
        />
        <div class="flex flex-row gap-2">
          <input
            id="firstname"
            name="firstname"
            autocomplete="firstname"
            required
            placeholder="Firstname"
            class="input"
            v-model="firstname"
          />
          <input
            id="lastname"
            name="lastname"
            autocomplete="lastname"
            required
            placeholder="Lastname"
            class="input"
            v-model="lastname"
          />
        </div>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          placeholder="Email"
          class="input"
          v-model="email"
        />
        <input
          id="phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          required
          placeholder="Phone"
          class="input"
          v-model="phone"
        />
        <select id="profession" name="profession" autocomplete="profession" required class="input" v-model="profession">
          <option value="" disabled selected>Profession</option>
          <option v-for="profession in Professions" :key="profession" :value="profession">
            {{ profession }}
          </option>
        </select>
        <input
          id="address"
          name="address"
          autocomplete="address"
          required
          placeholder="Address"
          class="input"
          v-model="address"
        />
        <div class="flex flex-row gap-2">
          <input id="city" name="city" autocomplete="city" required placeholder="City" class="input" v-model="city" />
          <input
            id="postal-code"
            name="postal-code"
            autocomplete="postal-code"
            required
            placeholder="Postal Code"
            class="input"
            v-model="postalCode"
          />
        </div>
        <input
          id="country"
          name="country"
          autocomplete="country"
          required
          placeholder="Country"
          class="input"
          v-model="country"
        />
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Password"
          class="input"
          v-model="password"
        />
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Confirm Password"
          class="input"
          v-model="passwordConfirm"
        />
        <ButtonPrimary
          :full-width="true"
          :pending="loading"
          type="submit"
          :disabled="disabled"
          :class="disabled ? 'opacity-50 cursor-not-allowed' : ''"
        />
      </form>
      <NuxtLink :to="{ name: 'Login' }" class="btn-secondary mt-6"> Already have an account ? Login here </NuxtLink>
    </div>
  </div>
</template>
