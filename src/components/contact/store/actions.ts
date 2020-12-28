import { ActionTree } from "vuex";
import axios from "axios";
import { Contact, ContactState } from "../types";
import { RootState } from "@/store/types";

const baseUrl = "http://localhost:3000/contact";

export const actions: ActionTree<ContactState, RootState> = {
  fetchData({ commit }): any {
    axios
      .get<Contact[]>(`${baseUrl}/list`, {
        // no data
      })
      .then(response => {
        console.log("response: ", response);
        //this.items = response.data;
        const payload: Contact[] = response?.data;
        commit("itemsResponse", payload);
      })
      .catch(err => {
        console.log(err);
        /* this.snackbar = {
            show: true,
            text: "Failed to get item list",
            color: "error"
            }; */
        commit("itemsResponseError");
      });
  }
};
