<style lang="scss" scoped>
::v-deep .v-toolbar__content,
.v-toolbar__extension {
  padding: 0;
}
::v-deep .mdi-chevron-down::before {
  content: none;
}
::v-deep .filter-icon {
  align-self: flex-end;
  margin-bottom: 10px;
  text-align: center;
}
::v-deep .test {
  align-self: flex-end;
  text-align: right !important;
}
</style>

<template>
  <v-container fluid>
    <v-data-table
      :headers="computedHeaders"
      :items="items"
      :multi-sort="true"
      :options.sync="tableOptions"
      :server-items-length="totalItems"
      class="elevation-1"
      show-select
      v-model="selected"
      ><!--  TODO: place this above and finish implement of searchItems
      :server-items-length="totalItems" -->
      <template v-slot:top>
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <!--<v-toolbar flat>-->
              <v-row>
                <v-col cols="12" sm="11" md="5">
                  <!-- <v-toolbar-title>My CRUD</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider> -->
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    @click.stop=""
                  ></v-text-field>
                </v-col>
                <v-col
                  align-self="end"
                  class="text-center"
                  cols="12"
                  sm="1"
                  md="1"
                >
                  <v-icon
                    :color="hasFilter ? 'primary' : ''"
                    small
                    class="filter-icon"
                  >
                    mdi-filter
                  </v-icon>
                  <v-icon
                    @click.stop="onClearFilter"
                    small
                    class="filter-icon"
                    v-if="hasFilter"
                  >
                    mdi-close
                  </v-icon>
                </v-col>
                <!-- <v-spacer></v-spacer> -->
                <v-col cols="12" sm="6" md="3">
                  <v-select
                    @click.stop=""
                    :items="actionItems"
                    hide-details="true"
                  >
                  </v-select>
                  <!-- <v-spacer></v-spacer> -->
                </v-col>
                <v-col
                  align-self="end"
                  class="text-right"
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" dark v-bind="attrs" v-on="on">
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
                        <v-btn color="blue darken-1" text @click="save">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="400px">
                    <v-card>
                      <v-card-title class="headline">
                        Delete
                        {{
                          selectedItemCount > 1 ? "these items" : "this item"
                        }}?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="confirmItemDeletion"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <!-- </v-toolbar> -->
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="3">
                  <v-menu
                    ref="filterRangeFromDateRef"
                    v-model="filterRangeFromDateShow"
                    :close-on-content-click="false"
                    :return-value.sync="filterRangeFromDate"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterRangeFromDate"
                        label="From"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="primary"
                      no-title
                      scrollable
                      v-model="filterRangeFromDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="filterRangeFromDateShow = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          $refs.filterRangeFromDateRef.save(filterRangeFromDate)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <v-menu
                    ref="filterRangeToDateRef"
                    v-model="filterRangeToDateShow"
                    :close-on-content-click="false"
                    :return-value.sync="filterRangeToDate"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterRangeToDate"
                        label="To"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="primary"
                      :min="filterRangeFromDate"
                      :max="filterRangeToDateMax"
                      no-title
                      scrollable
                      v-model="filterRangeToDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="filterRangeToDateShow = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="
                          $refs.filterRangeToDateRef.save(filterRangeToDate)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="4">
                  <v-checkbox label="Archived" v-model="checkbox"> </v-checkbox>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
import moment from "moment";

const namespace = "contact";

@Component({
  components: {
    //
  }
})
export default class ContactListComponent extends Vue {
  // ref: https://github.com/ktsn/vuex-class
  @State("contact") contact!: ContactState;
  @Action("searchItems", { namespace }) searchItems!: (options: any) => any;
  //@Action("fetchItems", { namespace }) fetchItems: any;
  @Action("deleteItem", { namespace }) deleteItem!: (payload: any) => void;
  @Action("deleteItems", { namespace }) deleteItems!: (payload: any) => void;
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
  tableOptions = { page: 1 };
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
  hasFilter = false;
  checkbox = false;
  filterRangeFromDate = new Date().toISOString().substring(0, 10);
  filterRangeFromDateShow = false;
  filterRangeToDate = new Date(
    new Date(this.filterRangeFromDate).setDate(
      new Date(this.filterRangeFromDate).getDate() + 1
    )
  )
    .toISOString()
    .substring(0, 10);
  filterRangeToDateShow = false;
  actionItems: string[] = ["Delete", "Edit"];
  selected: Contact[] = [];

  get formTitle() {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }

  // todo: set min & max based on meta from api call
  get filterRangeToDateMax(): string {
    return moment()
      .add(1, "year")
      .toISOString()
      .substring(0, 10);
  }

  get selectedItemCount(): number {
    return this.selected.length;
  }

  @Watch("tableOptions", { immediate: true, deep: true })
  tableOptionsChanged(tableOptions: any) {
    this.searchItems({ search: this.search, options: tableOptions });
  }

  @Watch("filterRangeFromDate")
  filterRangeFromDateChanged(newVal: any, oldVal: any) {
    console.log(
      "filterRangeFromDateChanged filterRangeToDate: ",
      this.filterRangeToDate
    );
    console.log("filterRangeFromDateChanged oldVal: ", oldVal);
    /* const rangeDays = Math.abs(new Date(this.filterRangeToDate).getDate() - new Date(oldVal).getDate());
      const rangeDays2 = moment(this.filterRangeToDate).diff(moment(oldVal), "days");
      console.log("filterRangeFromDateChanged rangeDays: ", rangeDays);
      this.filterRangeToDate = new Date(new Date(this.filterRangeFromDate).setDate(new Date(this.filterRangeFromDate).getDate() + rangeDays)).toISOString().substring(0, 10);
     */
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

  @Watch("checkbox")
  checkboxChanged(val: string) {
    this.hasFilter = true;
  }

  created() {
    console.log(`${this.$options.name} created!`);
  }

  mounted() {
    console.log(`${this.$options.name} mounted!`);
    // debounce user search input
    this.search$.pipe(debounceTime(500)).subscribe(search => {
      // prevent being on an empty page on new search by starting with first page
      //if (this.$store.state.loading) return;
      this.tableOptions.page = 1;
      console.log("search (debounced) tableOptions: ", this.tableOptions);
      this.searchItems({ search, options: this.tableOptions });
    });
  }

  beforeUpdated() {
    console.log(`${this.$options.name} beforeUpdated!`);
  }

  updated() {
    console.log(`${this.$options.name} updated!`);
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
    //this.deleteItem({ ...this.editedItem });
    const idList =
      this.selected.length === 0
        ? [this.editedItem.id]
        : this.selected.map(item => item.id);
    console.log("idList: ", idList);
    this.deleteItems(idList);
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
      this.updateItem({ item: this.editedItem });
    } else {
      this.createItem({ item: this.editedItem });
    }
    this.close();
    this.$store.commit("clearLoading");
  }

  onClearFilter() {
    this.checkbox = false;
    this.$nextTick(() => {
      this.hasFilter = false;
    });
  }
}
</script>
