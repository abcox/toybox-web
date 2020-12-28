import { MutationTree } from "vuex";
import { Contact, ContactState } from "../types";

export const mutations: MutationTree<ContactState> = {
  itemsResponse(state, payload: Contact[]) {
    state.error = false;
    state.items = payload;
  },
  itemsResponseError(state) {
    state.error = true;
    state.items = undefined;
  }
};
