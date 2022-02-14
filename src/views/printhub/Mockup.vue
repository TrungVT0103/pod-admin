<template>
  <div class="ma-4">
    <v-row>
      <v-spacer></v-spacer>
      <v-row class="ma-0 text-end">
        <v-col><v-btn class="" color="primary" @click="addMockup">+ Add Option</v-btn></v-col>
      </v-row>
      <v-col cols="12">
        <v-card tile>
          <!-- <v-card v-show="showFilter" flat class="grey lighten-4">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text>Reset</v-btn>
              <v-btn tile color="primary">Apply</v-btn>
            </v-card-actions>
          </v-card> -->
          <v-card-text class="pa-0">
            <v-data-table
              hide-default-footer
              :calculate-widths="true"
              :loading="loadingItems"
              :headers="headers"
              :items="getMockup"
              :items-per-page="50"
            >
              <template widths="400" v-slot:[`item._source.name`]="{ item }">
                {{ item.name }}
              </template>
              <template widths="400" v-slot:[`item._source.description`]="{ item }">
                {{ item.description }}
              </template>
              <template widths="400" v-slot:[`item._source.option`]="{ item }">
                <v-btn class="mr-2" @click="editMockup(item._id)" outlined color="primary"
                  ><v-icon>mdi-pencil mdi-18px</v-icon></v-btn
                >
                <v-btn outlined @click="openDeleteMockup(item._id)" color="error"
                  ><v-icon>mdi mdi-delete mdi-18px</v-icon></v-btn
                >
              </template>
              <!-- xuất hiện ở footer -->
              <!-- <template v-slot:footer.prepend>
                <v-row class="ma-0">
                  <v-col><v-btn class="" color="primary" @click="addMockup">+ Add Option</v-btn></v-col>
                </v-row>
              </template> -->
              <!-- xuất hiện ở cuối tbody -->
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <div class="sketch-color">
      <sketch-picker v-model="colors" class="ma-auto" />
    </div> -->
    <modal model="dialogDeleteMockup" title="Delete" :callback="deleteMockup">
      <template slot="content">
        <div>Do you want to delete this object ? This action cannot be reversed.</div>
      </template>
    </modal>
    <v-dialog class="pa-5" width="700" v-model="turnOneditMockup">
      <v-card class="px-5 py-5" relative>
        <h3 class="pl-0 pt-0 text-center">
          Mockup Types
        </h3>
        <div class="close-icon" @click="turnOneditMockup = false">
          <v-icon>mdi-close</v-icon>
        </div>
        <v-row class="mt-5">
          <v-col sm="12">
            <label for="">Title</label>
            <v-text-field
              hide-details=""
              dense
              outlined
              v-model="dataDialgo.name"
            ></v-text-field>
          </v-col>
          <v-col sm="12">
            <label for="">Description</label>
            <v-text-field
              dense
              outlined
              v-model="dataDialgo.description"
              hide-details=""
            ></v-text-field>
          </v-col>
          <!-- <v-col sm="2" align-self="end" class="pb-4">
            <div>
              <v-btn outlined color="primary" @click="deleteVariantMockup(ind1)"
                ><v-icon>mdi mdi-delete mdi-18px</v-icon></v-btn
              >
            </div>
          </v-col> -->
          <!-- <div class="sketch-color">
            <sketch-picker v-model="item.code" class="ma-auto" />
          </div> -->
          <v-col sm="12"><v-divider></v-divider></v-col>
        </v-row>

        <v-card-actions class="px-0">
          <!-- <v-btn color="primary" @click="addVariantMockup()">+ Add</v-btn> -->
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancel">Cancel</v-btn>
          <v-btn color="primary" @click="submit(dataDialgo)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import formData from './data'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialogDeleteMockup: false,
      indexOfMockupDelete: 0,
      dataDialgo: {},
      curentSize: 0,
      dataColor: formData.form,
      turnOnSketch: [{ display: true }],
      showDialog: false,
      search: '',
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      showFilter: true,
      document: [
        {
          name: 'Color1',
          values: [
            {
              colors: '#A52A2A',
              value: 'Brown',
            },
            {
              colors: '#FFFF00',
              value: 'Yellow',
            },
          ],
          _id: 1,
        },
      ],
      filter: {
        page: 1,
        search: null,
        store_id: null,
        is_active: 1,
      },
      footerProps: {
        itemsPerPageOptions: [20, 50, 100],
      },
      headers: [
        {
          text: 'Title',
          value: '_source.name',
          width: '20%',
          sortable: false,
        },
        {
          text: 'Description',
          value: '_source.description',
          width: '25%',
          sortable: false,
        },
        // {
        //   text: 'Code',
        //   value: '_source.code',
        //   width: '25%',
        //   sortable: false,
        // },
        {
          text: 'Action',
          value: '_source.option',
          width: '30%',
          sortable: false,
        },
        // {
        //   text: 'Delete',
        //   value: '_source.delete',
        //   width: '15%',
        // },
      ],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
      names: [{}], // lưu tên màu ứng với từng mã màu
      productName: '', // tên sản phẩm gửi lên api
      productValue: [], // mảng values gửi lên api
      turnOneditMockup: false,
      indexOfeditMockup: null,
      isEdit: null, // phân biệt là đang edit hay add
    }
  },
  // watch: {},
  created() {
    this.fetchMockup()
  },
  computed: {
    ...mapGetters(['getMockup']),
  },
  methods: {
    addMockup() {
      this.turnOneditMockup = true
      this.isEdit = false
      this.curentSize = 0
      this.dataDialgo = {
        name: '',
        description: '',
      }
    },
    openDeleteMockup(ind) {
      this.dialogDeleteMockup = true
      this.indexOfMockupDelete = ind
    },
    deleteMockup() {
      this.loadingItems = true;
      this.dialogDeleteMockup = false
      this.$store
        .dispatch('deleteMockup', this.indexOfMockupDelete)
        .then(() => {
          this.fetchMockup();
          this.loadingItems = false;
        })
        .catch(() => {
          console.log('error')
          this.loadingItems = false;
        })
    },
    editMockup(idd) {
      this.isEdit = true
      let position = this.getMockup.findIndex(i => i._id == idd)
      console.log(position)
      this.dataDialgo = Object.assign({},this.getMockup[position])
      console.log(this.getMockup[position])
      this.curentSize = position
      this.turnOneditMockup = true
    },
    cancel() {
      this.turnOneditMockup = false
    },
    deleteVariantMockup(ind) {
      this.dataDialgo.splice(ind, 1)
    },
    // addVariantMockup() {
    //   this.turnOneditMockup = true
    //   this.dataDialgo.values.push({
    //     colors: '',
    //     value: '',
    //   })
    // },
    changeColorName(a) {
      let result = []
      a.filter(i => {
        if (i.value) {
          result.push(i.value)
        }
      })
      return result.join(', ')
    },
    changeColorCode(a) {
      let result = []
      a.filter(i => {
        if (i.code) {
          result.push(i.code)
        }
      })
      return result.join(', ')
    },
    // lấy color về
    fetchMockup() {
      this.loadingItems = true
      this.$store
        .dispatch('getMockup')
        .then(() => this.loadingItems = false)
        .catch(() => {
          console.log('error')
          this.loadingItems = false
        })
    },
    // sửa color
    submit(item) {
      if (this.isEdit == true) {
        let data = {
          option: { mockupType: { name: item.name, description: item.description, sort: 1 } },
          id: item._id,
        }
        this.$store
          .dispatch('setMockup', data)
          .then(() => this.fetchMockup())
          .catch(() => {
            console.log('error')
          })
      } else if (this.isEdit == false) {
        let data = { option: { mockupType: { name: item.name, description: item.description, sort: 1 }} }
        this.$store
          .dispatch('addMockup', data)
          .then(() => this.fetchMockup())
          .catch(() => {
            console.log('error')
          })
      }
      this.isEdit = null
      this.turnOneditMockup = false
    },
    createUser() {
      this.$store.dispatch('createColor', {
        name: this.productName,
        values: this.productValue,
      })
      console.log({
        name: this.productName,
        values: this.productValue,
      })
    },
  },
}
</script>

<style>
.close-icon {
  position: absolute;
  top: 16px;
  right: 10px;
  cursor: pointer;
}
</style>
