import { MutationTree } from "vuex";
import { Contact, ContactState } from "../types";

export const mutations: MutationTree<ContactState> = {
  fetchItemsSuccess(state, payload: Contact[]) {
    state.error = false;
    state.items = payload;
  },
  fetchItemsFailure(state) {
    state.error = true;
    state.items = undefined;
  },
  deleteItemSuccess(state, { id }) {
    state.error = false;
    state.items = !state.items
      ? undefined
      : state.items?.filter(item => item.id !== id);
  },
  deleteItemFailure(state) {
    state.error = true;
    state.items = undefined;
  }
};
