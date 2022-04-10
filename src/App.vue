<template>
  <v-app>
    <v-navigation-drawer app permanent expand-on-hover>
      <v-list>
        <router-link to="/">
          <v-list-item class="px-2">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-light.png"
              transition="scale-transition"
              width="40"
            />
            <v-img
              alt="Vuetify Name"
              class="shrink mt-1 hidden-sm-and-down"
              contain
              min-width="100"
              src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-light.png"
              width="100"
            />
          </v-list-item>
        </router-link>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense v-if="$auth.isAuthenticated">
        <v-list-item
          :key="index"
          :to="item.route"
          link
          v-for="(item, index) in menu.items"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
        <!-- <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Files</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Shared with me</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Starred</v-list-item-title>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        /> -->

        <router-link to="/">
          <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
            width="100"
          />
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/abcox/toybox-web" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn @click="login()" text v-if="!$auth.isAuthenticated"
        ><!-- isAuthenticUser -->
        Sign In
      </v-btn>

      <router-link to="/profile" v-if="$auth.isAuthenticated && $auth.user">
        <v-avatar>
          <img link :src="$auth.user.picture" />
        </v-avatar>
      </router-link>

      <v-progress-linear
        :v-if="$store.state.loading"
        :active="$store.state.loading"
        indeterminate
        absolute
        bottom
        color="secondary primary-8"
      ></v-progress-linear>
    </v-app-bar>
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import router from "vue-router";
import store from "./store";
import { Component, Vue } from "vue-property-decorator";
//import HelloWorld from "./components/HelloWorld.vue";

@Component({
  components: {
    //HelloWorld
  }
})
export default class App extends Vue {
  //router;

  $auth;

  setup() {
    this.$auth = Vue.prototype.$auth;
  }

  login() {
    console.log("login!!");
    //this.$auth.loginWithRedirect({})  // does not update the menu
    this.$auth.loginWithPopup({});
    if (this.$auth.isAuthenticated) {
      JSON.stringify(this.$auth.user, null, 2);
    }
  }

  logout() {
    this.$auth.logout({
      returnTo: window.location.origin
    });
  }

  created() {
    console.log(`${this.$options.name} created!!`);
    console.log("auth: ", this.$auth);
  }

  name = "App";

  menu = {
    items: [
      { title: "Contacts", icon: "mdi-account-multiple", route: "/contacts" }
      /* { title: "Suppliers", icon: "mdi-folder", route: "/about" },
      { title: "Materials", icon: "mdi-folder", route: "/materials" },
      { title: "Assemblies", icon: "mdi-folder", route: "/assemblies" } */
    ]
  };
}
</script>
