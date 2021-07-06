<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ model.title }}
        </h1>

        <p class="subheading font-weight-regular">
          <a href="#">Sign up</a>, import your data, and take our demo for a
          spin!
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          {{ next.title }}
        </h2>

        <!-- <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row> -->
        <v-btn
          :href="action.route"
          :key="i"
          class="mx-3"
          color="primary"
          large
          v-for="(action, i) in next.actions"
        >
          {{ action.title }}
        </v-btn>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          {{ support.title }}
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in support.links"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import SignIn from "./auth/sign-in.vue";

export default Vue.extend({
  name: "WelcomeComponent",

  props: ["model"],

  created() {
    console.log("model: ", this.model.title);
  },

  watch: {
    model(val) {
      console.log("model: ", this.model.title);
      console.log("val: ", val);
    }
  },

  data: () => ({
    next: {
      title: "What's next?",
      actions: [{ title: "Sign-Up" }, { title: "Sign-In", route: "/sign-in" }]
    },
    support: {
      title: "Support",
      links: [
        {
          text: "Documentation",
          href: "https://vuetifyjs.com"
        },
        {
          text: "Community",
          href: "https://community.vuetifyjs.com"
        },
        {
          text: "Contact",
          href: "mailto:adam.cox@vorba.com"
        }
      ]
    }
  })
});
</script>
