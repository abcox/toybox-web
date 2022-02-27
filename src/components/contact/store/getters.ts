import { GetterTree } from "Vuex";
import { Contact, ContactState } from "../types";
import { RootState, Status } from "@/store/types";

export const getters: GetterTree<ContactState, RootState> = {
  first(state): Contact | undefined {
    const { items } = state;
    const first = items && items[0];
    //const email = (contact && contact.email) || "";
    return first;
  },
  items(state): Contact[] | undefined {
    return state.items || undefined;
  },
  status(state): Status {
    return state.status;
  },
  totalItems(state): number {
    return state.totalItems || 1;
  }
};
