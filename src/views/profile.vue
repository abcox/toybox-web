<template>
  <div>
    <div>
      <img :src="$auth.user.picture" />
      <h2>{{ $auth.user.name }}</h2>
      <p>{{ $auth.user.email }}</p>
    </div>
    <div>
      <pre>{{ JSON.stringify($auth.user, null, 2) }}</pre>
    </div>
    <v-btn @click="logout()" text v-if="$auth.isAuthenticated">
      Sign Out
    </v-btn>
  </div>
</template>

<script lang="ts">
import router from "vue-router";
//import store from "./store";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    // none
  }
})
export default class Profile extends Vue {
  logout() {
    console.log("logout!!");
    console.log("returnTo: ", window.location.origin);
    this.$auth.logout({
      returnTo: window.location.origin
    });
  }
}
</script>
