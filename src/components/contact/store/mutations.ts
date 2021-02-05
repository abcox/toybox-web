import { MutationTree } from "Vuex";
import { Contact, ContactListResponse, ContactState } from "../types";

export const mutations: MutationTree<ContactState> = {
  searchItemsSuccess(state, payload: ContactListResponse) {
    console.log("searchItemsSuccess payload: ", payload);
    state.error = false;
    state.items = payload.items;
    state.totalItems = payload.totalItems;
  },
  fetchItemsSuccess(state, payload: Contact[]) {
    console.log("fetchItemsSuccess payload: ", payload);
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
  deleteItemSuccess(state, { payload }) {
    const { id, meta } = payload;
    state.error = false;
    state.items = !state.items
      ? undefined
      : state.items?.filter(item => item.id !== id);
    state.status = {
      show: true,
      text: meta.status.message,
      color: meta.status.color
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
    const { item, meta } = payload;
    state.error = false;
    if (state.items) {
      state.items?.push(item);
    }
    state.status = {
      show: true,
      text: meta.status.message,
      color: meta.status.color
    };
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
