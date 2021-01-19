import { ActionTree } from "vuex";
import axios from "axios";
import { Contact, ContactState } from "../types";
import { RootState } from "@/store/types";

const baseUrl = "http://localhost:3000/contact";

export const actions: ActionTree<ContactState, RootState> = {
  searchItems({ commit }, request): any {
    console.log("search request: ", request);
    axios
      .get(`${baseUrl}/search`, {
        params: { ...request }
      })
      .then(response => {
        console.log("search response: ", response);
        //const payload: Contact[] = response?.data;
        commit("searchItemsSuccess", { ...response?.data });
      })
      .catch(err => {
        commit("fetchItemsFailure", { err });
      });
  },
  fetchItems({ commit }, request): any {
    axios
      .get(`${baseUrl}/list?${{ ...request }}`, {
        // no data
      })
      .then(response => {
        console.log("fetch response: ", response);
        const payload: Contact[] = response?.data;
        commit("fetchItemsSuccess", payload);
      })
      .catch(err => {
        commit("fetchItemsFailure", { err });
      });
  },
  deleteItem({ commit }, { id }): any {
    axios
      .delete(
        `${baseUrl}/${id}` /* , null, {
        headers: { 'x-csrf-token': this.xsrfToken }
        } */
      )
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
    const targetItem = item;
    axios
      .patch(`${baseUrl}/${targetItem.id}`, { ...targetItem })
      .then(response => {
        commit("updateItemSuccess", { item: response?.data });
      })
      .catch(err => {
        commit("updateItemFailure", { err });
      });
  },
  createItem({ commit }, { item }): any {
    const newItem = item;
    axios
      .post(`${baseUrl}`, { ...newItem })
      .then(response => {
        commit("createItemSuccess", { payload: response?.data });
      })
      .catch(err => {
        commit("createItemFailure", { err });
      });
  }
};
