<template>
  <v-container fluid>
    <h1>{{ model.title }}</h1>
    <v-text-field label="Email"> </v-text-field>
    <v-text-field label="Password" type="password"> </v-text-field>
    <v-btn @click="login">Sign-In </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class SignIn extends Vue {
  model = {
    title: "Sign In"
  };
  login() {
    console.log("login!");
  }
}
</script>
