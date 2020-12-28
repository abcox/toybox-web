import { MutationTree } from "vuex";
import { Contact, ContactState } from "../types";

export const mutations: MutationTree<ContactState> = {
  fetchItemsSuccess(state, payload: Contact[]) {
    state.error = false;
    state.items = payload;
  },
  fetchItemsFailure(state, { err }) {
    console.error(err);
    state.error = true;
    state.items = undefined;
    state.status = {
      show: true,
      text: "Failed to fetch items",
      color: "error"
    };
  },
  deleteItemSuccess(state, { response }) {
    const { id, message } = response?.data;
    state.error = false;
    state.items = !state.items
      ? undefined
      : state.items?.filter(item => item.id !== id);
    state.status = {
      show: true,
      text: message, // "Item deleted",
      color: "success"
    };
  },
  deleteItemFailure(state, { err }) {
    console.error(err);
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
  updateItemFailure(state, { err }) {
    console.error(err);
    state.error = true;
    state.status = {
      show: true,
      text: "Failed to updated item",
      color: "error"
    };
  },
  createItemSuccess(state, { payload }) {
    console.log("payload: ", payload);
    state.error = false;
    if (state.items) {
      state.items?.push(payload.item);
    }
    state.status = { show: true, text: payload.message, color: "success" };
  },
  createItemFailure(state, { err }) {
    console.error(err);
    state.error = true;
    state.status = {
      show: true,
      text: "Failed to create item",
      color: "error"
    };
  }
};
