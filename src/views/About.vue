<template>
  <v-container fluid>
    <h1>{{ title }}</h1>
    <v-btn @click="goBack" color="primary darken-1" text>
      Back
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    // none
  }
})
export default class About extends Vue {
  title = "About";

  goBack() {
    window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
  }
}
</script>
