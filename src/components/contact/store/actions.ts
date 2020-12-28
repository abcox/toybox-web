import { ActionTree } from "vuex";
import axios from "axios";
import { Contact, ContactState } from "../types";
import { RootState } from "@/store/types";

const baseUrl = "http://localhost:3000/contact";

export const actions: ActionTree<ContactState, RootState> = {
  fetchItems({ commit }): any {
    axios
      .get<Contact[]>(`${baseUrl}/list`, {
        // no data
      })
      .then(response => {
        console.log("response: ", response);
        const payload: Contact[] = response?.data;
        commit("fetchItemsSuccess", payload);
      })
      .catch(err => {
        console.log(err);
        commit("fetchItemsFailure");
      });
  },
  deleteItem({ commit }, { id }): any {
    console.log("deleteItem id: ", id);
    axios
      .delete(
        `${baseUrl}/${id}` /* , null, {
        headers: { 'x-csrf-token': this.xsrfToken }
        } */
      )
      .then(response => {
        console.log("response: ", response);
        commit("deleteItemSuccess", { id });
      })
      .catch(
        err => {
          console.log("ERROR: ", err);
          commit("deleteItemFailure");
        } /* ).finally(() => {
      this.$store.commit('clearLoading')
    } */
      );
  },
  updateItem({ commit }, { item }): any {
    console.log("item: ", item);
    const targetItem = item;
    console.log("targetItem: ", targetItem);
    axios
      .patch(`${baseUrl}/${targetItem.id}`, { ...targetItem })
      .then(response => {
        console.log("response: ", response);
        commit("updateItemSuccess", { item: response?.data });
      })
      .catch(err => {
        console.log("response: ", err);
        commit("updateItemFailure");
      });
  },
  createItem({ commit }, { item }): any {
    console.log("item: ", item);
    const newItem = item;
    console.log("newItem: ", newItem);
    axios
      .post(`${baseUrl}`, { ...newItem })
      .then(response => {
        commit("createItemSuccess", { item: response?.data });
      })
      .catch(err => {
        commit("createItemFailure", { err });
      });
  }
};
