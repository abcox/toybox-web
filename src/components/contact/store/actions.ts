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
        //this.items = response.data;
        const payload: Contact[] = response?.data;
        commit("fetchItemsSuccess", payload);
      })
      .catch(err => {
        console.log(err);
        /* this.snackbar = {
            show: true,
            text: "Failed to get item list",
            color: "error"
            }; */
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
        const payload: Contact[] = response?.data;
        //this.items = this.items.filter(item => item.id !== id);
        //this.snackbar = { show: true, text: "Item deleted", color: "success" };
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
  }
};
