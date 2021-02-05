<template>
  <v-container fluid>
    <v-data-table
      :headers="computedHeaders"
      :items="items"
      :multi-sort="true"
      :options.sync="options"
      :server-items-length="totalItems"
      class="elevation-1"
      ><!--  TODO: place this above and finish implement of searchItems
      :server-items-length="totalItems" -->
      <template v-slot:top>
        <v-toolbar flat>
          <!-- <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="Phone"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="confirmItemDeletion"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="selectItemForDeletion(item)"> mdi-delete </v-icon>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template> -->
    </v-data-table>
    <v-snackbar
      top
      right
      :color="status.color"
      v-model="status.show"
      elevation="24"
      >{{ status.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="#ffffff" text v-bind="attrs" @click="status.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, Getter, State } from "vuex-class";
import { Contact, ContactState } from "./types";
import axios from "axios";
import { Status } from "../../store/types";
import {
  BehaviorSubject,
  /* fromEvent,
  interval, */
  Subject,
  pipe,
  Observable
} from "rxjs";
import { debounce, debounceTime, switchMap } from "rxjs/operators";

const namespace = "contact";

@Component({
  components: {
    //
  }
})
export default class Home extends Vue {
  // ref: https://github.com/ktsn/vuex-class
  @State("contact") contact!: ContactState;
  @Action("searchItems", { namespace }) searchItems!: (options: any) => any;
  @Action("fetchItems", { namespace }) fetchItems: any;
  @Action("deleteItem", { namespace }) deleteItem!: (payload: any) => void;
  @Action("updateItem", { namespace }) updateItem!: (payload: any) => void;
  @Action("createItem", { namespace }) createItem!: (payload: any) => void;
  //@Getter('fullName', { namespace }) fullName: string;  // todo
  @Getter("items", { namespace }) items!: Contact[];
  @Getter("status", { namespace }) status!: Status;
  @Getter("totalItems", { namespace }) totalItems!: number;

  constructor() {
    super();
    //this.contact = { error: false };
    //this.items = [];
  }

  baseUrl = "http://localhost:3000/contact";

  name = "contacts-component";
  title = "Contacts Component";
  options = {};
  dialog = false;
  dialogDelete = false;
  headers = [
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Phone", value: "phone" },
    { text: "Actions", value: "actions", sortable: false },
    { text: "Id", value: "id", visible: false }
  ];
  editedIndex = -1;
  editedItem: Contact = {
    id: "",
    name: "",
    email: "",
    phone: ""
  };
  defaultItem: Contact = {
    id: "",
    name: "",
    email: "",
    phone: ""
  };
  search = "";
  search$ = new BehaviorSubject<string>("");

  get formTitle() {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }

  @Watch("options", { immediate: true, deep: true })
  optionsChanged(options: any) {
    this.searchItems({ search: this.search, options: this.options });
  }

  @Watch("dialog")
  dialogChanged(val: boolean) {
    val || this.close();
  }

  @Watch("dialogDelete")
  dialogDeleteChanged(val: boolean) {
    val || this.closeDelete();
  }

  @Watch("search")
  searchChanged(val: string) {
    this.search$.next(val);
  }

  created() {
    console.log("created!");
    this.search$.pipe(debounceTime(500)).subscribe(search => {
      this.searchItems({ search: this.search, options: this.options });
    });
  }

  mounted() {
    console.log("mounted!");
    this.fetchItems(this.options);
  }

  editItem(item: Contact) {
    this.editedIndex = this.items.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  selectItemForDeletion(item: Contact) {
    this.editedIndex = this.items.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialogDelete = true;
  }

  confirmItemDeletion() {
    this.$store.commit("showLoading"); // todo: move to state
    this.deleteItem({ ...this.editedItem });
    this.closeDelete();
    this.$store.commit("clearLoading");
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  closeDelete() {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  get computedHeaders() {
    return this.headers.filter(function(item) {
      if (item.visible === false) return;
      return item;
    });
  }

  save() {
    const targetItem = this.editedItem;
    console.log("item: ", targetItem);
    this.$store.commit("showLoading");
    if (this.editedIndex > -1) {
      /* axios
        .patch(`${this.baseUrl}/${targetItem.id}`, { ...targetItem })
        .then(response => {
          console.log("response: ", response);
          this.items = this.items.map(item =>
            item.id !== targetItem.id ? item : targetItem
          );
        })
        .catch(err => {
          console.log(err);
        }); */
      this.updateItem({ item: this.editedItem });
    } else {
      /* axios
        .post(`${this.baseUrl}`, { ...targetItem })
        .then(response => {
          console.log("response: ", response);
          this.items.push(
            response.data
          );
        })
        .catch(err => {
          console.log(err);
        }); */
      this.createItem({ item: this.editedItem });
    }
    this.close();
    this.$store.commit("clearLoading");
  }

  /* snackbar: { show: boolean; text: string; color: string } = {
    show: false,
    text: "",
    color: "success"
  }; */
}
</script>
