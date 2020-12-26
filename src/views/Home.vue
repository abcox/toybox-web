<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <WelcomeComponent :model="model" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WelcomeComponent from "@/components/welcome-component.vue"; // @ is an alias to /src

@Component({
  components: {
    WelcomeComponent
  }
})
export default class Home extends Vue {
  model = {
    title: "Cloud ERP for Manufacturing"
  };
}
</script>
