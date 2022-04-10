import { VueAuth } from "./auth/VueAuth";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $auth: typeof VueAuth;
  }
}
