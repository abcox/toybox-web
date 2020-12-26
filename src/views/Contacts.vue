<template>
  <v-container fluid>
    <h1>{{ title }}</h1>
    <contacts-component></contacts-component>
    <v-btn @click="goBack" color="primary darken-1" text>
      Back
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
//import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import ContactsComponent from "@/components/contacts-component.vue";

@Component({
  components: {
    //HelloWorld
    ContactsComponent
  },
  data: () => ({
    title: "Contacts"
  }),
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
})
export default class Contacts extends Vue {}
</script>
