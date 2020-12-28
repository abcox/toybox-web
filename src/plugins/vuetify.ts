import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    //dark: true,
    themes: {
      light: {
        primary: "#2196f3", //',
        secondary: "#3f51b5",
        accent: "#9c27b0",
        error: "#f44336",
        warning: "#ff9800",
        info: "#607d8b",
        success: "#4caf50"
      },
      dark: {
        primary: "#2196f3", //',
        secondary: "#3f51b5",
        accent: "#9c27b0",
        error: "#f44336",
        warning: "#ff9800",
        info: "#607d8b",
        success: "#4caf50"
      }
    }
  }
});
