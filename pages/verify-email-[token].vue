<script setup lang="ts">
definePageMeta({
  name: "VerifyUser",
  title: "Verify User",
});

const token = useRoute().params.token;

async function verifyEmail() {
  await useFetch("/api/auth/verifyUser", {
    method: "POST",
    body: {
      token,
    },
  });
  useRouter().push("/login");
};
</script>

<template>
  <div class="flex h-screen">
    <div class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <router-link to="/">
            <img class="h-12 w-auto mx-auto" src="../assets/media/logo-cooperantis.svg" alt="Your Company" />
          </router-link>
          <h2 class="text-center mt-6 text-3xl font-bold tracking-tight text-primary">Verify Email</h2>
          <p class="my-6 text-center text-sm text-muted">
            We sended you an email with a link to verify your account. Please check your inbox.
          </p>
        </div>
        <form class="space-y-6" @submit.prevent="verifyEmail">
          <button type="submit" class="btn-primary">Send</button>
        </form>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt=""
      />
    </div>
  </div>
</template>