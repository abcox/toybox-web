import Vue from "vue";
import { VueAuth } from "./auth";

declare module "vue/types/vue" {
  interface Vue {
    $auth: VueAuth;
  }
}
