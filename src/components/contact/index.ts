// ref: https://codeburst.io/vuex-and-typescript-3427ba78cfa8

import { Module } from "vuex";
import { getters } from "./store/getters";
import { actions } from "./store/actions";
import { mutations } from "./store/mutations";
import { ContactState } from "./types";
import { RootState } from "../../store/types";

export const state: ContactState = {
  items: undefined,
  error: false
};

const namespaced = true;

export const contact: Module<ContactState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
