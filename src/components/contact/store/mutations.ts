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
    state.status = {
      show: true,
      text: "Failed to fetch item",
      color: "error"
    };
  },
  deleteItemSuccess(state, { id }) {
    state.error = false;
    state.items = !state.items
      ? undefined
      : state.items?.filter(item => item.id !== id);
    state.status = {
      show: true,
      text: "Item deleted",
      color: "success"
    };
  },
  deleteItemFailure(state) {
    state.error = true;
    state.status = {
      show: true,
      text: "Failed to delete item",
      color: "error"
    };
  },
  updateItemSuccess(state, { item }) {
    const updatedItem = item;
    state.error = false;
    state.items = !state.items
      ? undefined
      : state.items?.map(item =>
          updatedItem.id === item.id ? updatedItem : item
        );
    state.status = {
      show: true,
      text: "Item updated",
      color: "success"
    };
  },
  updateItemFailure(state) {
    state.error = true;
    state.status = {
      show: true,
      text: "Failed to updated item",
      color: "error"
    };
  },
  createItemSuccess(state, { item }) {
    console.log("item: ", item);
    state.error = false;
    if (state.items) {
      state.items?.push(item);
    }
    state.status = { show: true, text: "Item create", color: "success" };
  },
  createItemFailure(state, { err }) {
    console.log("ERROR: ", err);
    state.error = true;
    state.status = {
      show: true,
      text: "Failed to create item",
      color: "error"
    };
  }
};
