<template>
  <v-container fluid>
    <v-data-table
      :headers="computedHeaders"
      :items="items"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <!-- <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider> -->
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
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
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
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <v-snackbar
      top
      right
      :color="snackbar.color"
      v-model="snackbar.show"
      elevation="24"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="#ffffff"
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Contact from "./contact";
import axios from "axios";

@Component({
  components: {
    //
  }
})
export default class Home extends Vue {
  baseUrl = "http://localhost:3000/contact";

  name = "contacts-component";
  title = "Contacts Component";
  dialog = false;
  dialogDelete = false;
  headers = [
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Phone", value: "phone" },
    { text: "Actions", value: "actions", sortable: false },
    { text: "Id", value: "id", visible: false }
  ];
  items: Contact[] = [];
  editedIndex = -1;
  editedItem = {
    id: "",
    name: "",
    email: "",
    phone: ""
  };
  defaultItem = {
    id: "",
    name: "",
    email: "",
    phone: ""
  };

  get formTitle() {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }

  @Watch("dialog")
  dialogChanged(val: boolean) {
    val || this.close();
  }

  @Watch("dialogDelete")
  dialogDeleteChanged(val: boolean) {
    val || this.closeDelete();
  }

  created() {
    this.initialize();
  }

  initialize() {
    this.getItems();
  }

  getItems() {
    axios
      .get<Contact[]>(`${this.baseUrl}/list`, {
        // no data
      })
      .then(response => {
        console.log("response: ", response);
        this.items = response.data;
      })
      .catch(err => {
        console.log(err);
        this.snackbar = {
          show: true,
          text: "Failed to get item list",
          color: "error"
        };
      });
  }

  editItem(item: Contact) {
    this.editedIndex = this.items.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  deleteItem(item: Contact) {
    this.editedIndex = this.items.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialogDelete = true;
  }

  deleteItemConfirm() {
    this.$store.commit("showLoading");
    const id = this.editedItem.id;
    axios
      .delete(
        `${this.baseUrl}/${id}` /* , null, {
        headers: { 'x-csrf-token': this.xsrfToken }
        } */
      )
      .then(response => {
        console.log("response: ", response);
        //this.items.splice(this.editedIndex, 1);
        this.items = this.items.filter(item => item.id !== id);
        this.snackbar = { show: true, text: "Item deleted", color: "success" };
      })
      .catch(
        err => {
          console.log("ERROR: ", err);
        } /* ).finally(() => {
      this.$store.commit('clearLoading')
    } */
      );
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
      axios
        .patch(`${this.baseUrl}/${targetItem.id}`, { ...targetItem })
        .then(response => {
          console.log("response: ", response);
          //Object.assign(this.items[this.editedIndex], response.data);
          this.items = this.items.map(item =>
            item.id !== targetItem.id ? item : targetItem
          );
          this.snackbar = {
            show: true,
            text: "Item updated",
            color: "success"
          };
        })
        .catch(err => {
          console.log(err);
          this.snackbar = {
            show: true,
            text: "Failed to update item",
            color: "error"
          };
        });
    } else {
      axios
        .post(`${this.baseUrl}`, { ...targetItem })
        .then(response => {
          console.log("response: ", response);
          /*           this.items = this.items.map(item =>
            item.id !== targetItem.id ? item : targetItem
          );
 */ this.items.push(
            response.data
          );
          this.snackbar = {
            show: true,
            text: "Item created",
            color: "success"
          };
        })
        .catch(err => {
          console.log(err);
          this.snackbar = {
            show: true,
            text: "Failed to create item",
            color: "error"
          };
        });
    }
    this.close();
    this.$store.commit("clearLoading");
  }

  snackbar: { show: boolean; text: string; color: string } = {
    show: false,
    text: "",
    color: "success"
  };
}
</script>
