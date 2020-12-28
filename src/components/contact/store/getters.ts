import { GetterTree } from "vuex";
import { Contact, ContactState } from "../types";
import { RootState } from "@/store/types";
import { contact } from "..";

export const getters: GetterTree<ContactState, RootState> = {
  first(state): Contact | undefined {
    const { items } = state;
    const first = items && items[0];
    //const email = (contact && contact.email) || "";
    return first;
  },
  items(state): Contact[] | undefined {
    return state.items || undefined;
  }
};
