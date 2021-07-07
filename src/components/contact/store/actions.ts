import { ActionTree } from "Vuex";
import { Contact, ContactState } from "../types";
import { RootState } from "@/store/types";
import { Configuration as ApiConfig, ContactApi } from "toybox-api-client";

const hostUrl = "http://localhost:3000";
const basePath = `${hostUrl}/contact`;
const apiConfig = new ApiConfig({ basePath: hostUrl });
const api = new ContactApi(apiConfig);

export const actions: ActionTree<ContactState, RootState> = {
  searchItems({ commit }, request): any {
    api
      .getContacts()
      .then(response => {
        commit("fetchItemsSuccess", response?.data);
      })
      .catch(err => {
        commit("fetchItemsFailure", { err });
      });
  },
  fetchItems({ commit }, request): any {
    api
      .getContacts()
      .then(response => {
        commit("fetchItemsSuccess", response?.data); // todo: review response type, and change to Contact[] ?
      })
      .catch(err => {
        commit("fetchItemsFailure", { err });
      });
  },
  deleteItem({ commit }, { id }): any {
    api
      .deleteContact(id)
      .then(response => {
        commit("deleteItemSuccess", { payload: response?.data });
      })
      .catch(
        err => {
          commit("deleteItemFailure", { err });
        } /* ).finally(() => {
      this.$store.commit('clearLoading')
    } */
      );
  },
  updateItem({ commit }, { item }): any {
    api
      .updateContact(item.id, { ...item })
      .then(response => {
        commit("updateItemSuccess", { item: response?.data });
      })
      .catch(err => {
        commit("updateItemFailure", { err });
      });
  },
  createItem({ commit }, { item }): any {
    api
      .createContact({ ...item })
      .then(response => {
        commit("createItemSuccess", { payload: response?.data });
      })
      .catch(err => {
        commit("createItemFailure", { err });
      });
  }
};
