import { ActionTree } from "Vuex";
import { Contact, ContactState } from "../types";
import { RootState } from "@/store/types";
import { ContactApi } from "toybox-backend";
import { config as apiConfig } from "@/api/config";

const api = new ContactApi(apiConfig);

export const actions: ActionTree<ContactState, RootState> = {
  searchItems({ commit }, request): any {
    console.log("searchItems request: ", request);
    api
      //.getContacts()
      .searchContacts(
        request.search,
        request.options.itemsPerPage,
        request.options.page
      ) // returns 500 -- TODO: figure out why..
      .then(response => {
        commit("searchItemsSuccess", response);
      })
      .catch(err => {
        commit("searchItemsFailure", { err });
      });
  },
  fetchItems({ commit }, request): any {
    api
      .getContactList()
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
