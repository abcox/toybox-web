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

        <p v-if="!$auth.isAuthenticated" class="subheading font-weight-regular">
          <a href="#" @click="login()">Sign in</a> or
          <a href="#" @click="register()">sign up</a> and take our demo for a
          spin!
        </p>
        <p v-if="$auth.isAuthenticated" class="subheading font-weight-regular">
          Step 1: <a href="#">import your data</a>
        </p>
      </v-col>

      <v-col v-if="!this.$auth.isAuthenticated" class="mb-5" cols="12">
        <v-btn class="mx-3" color="primary" large @click="login()">
          Sign-In
        </v-btn>
        <v-btn class="mx-3" color="primary" large @click="register()">
          Sign-Up
        </v-btn>
      </v-col>
      <v-col v-if="this.$auth.isAuthenticated" class="mb-5" cols="12">
        <v-btn class="mx-3" color="primary" large @click="logoff()">
          Sign-Out
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
import { Component, Vue, Watch } from "vue-property-decorator";
import SignIn from "./auth/sign-in.vue";

@Component({
  components: {
    //HelloWorld
  }
})
export default class App extends Vue {
  name = "WelcomeComponent";

  //props: ["model"];

  created() {
    console.log(`${this.$options.name} created!`);
  }

  @Watch("model")
  modelChanged(val: any) {
    console.log("model: ", val);
  }

  login() {
    this.$auth.loginWithPopup({});
  }

  logoff() {
    this.$auth.logout({
      returnTo: window.location.origin
    });
  }

  register() {
    alert("feature not implemented!");
  }

  model = {};
  support = {
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
  };
}
</script>
