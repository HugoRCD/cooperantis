import en from "./locales/en.json";
import fr from "./locales/fr.json";

export default defineNuxtConfig({
  app: {
    layoutTransition: {
      name: "fade",
      mode: "out-in",
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  css: ["~/assets/style/main.scss"],

  build: {
    transpile: ["@heroicons/vue"],
  },

  modules: [
    "nuxt-icon",
    "@nuxt/image-edge",
    "nuxt-headlessui",
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-mailer",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
  ],

  imports: {
    dirs: ["store"],
  },

  runtimeConfig: {
    mailerUser: process.env.MAILER_USER,
    mailerPass: process.env.MAILER_PASSWORD,
    private: {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      authSecret: process.env.AUTH_TOKEN_SECRET,
      linearApiKey: process.env.LINEAR_API_KEY,
      openAIKey: process.env.OPENAI_API_KEY,
    },
    public: {
      appDomain: process.env.FRONTEND_URL,
      appEnv: process.env.APP_ENV,
      apiUrl: process.env.API_URL,
    },
  },

  i18n: {
    vueI18n: {
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
      availableLocales: ["en", "fr"],
      messages: {
        en,
        fr,
      },
    },
  },

  image: {
    alias: {
      supabase: "https://fbxtfrvztprjgwvahavn.supabase.co/storage/v1/object/public",
    },
    domains: ["fbxtfrvztprjgwvahavn.supabase.co"],
    dir: "assets/media",
  },
});
