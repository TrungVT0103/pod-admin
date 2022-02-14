<template>
  <div class="ma-4">
    <v-row>
      <v-spacer></v-spacer>
      <v-row class="ma-0">
        <v-col class="text-end"><v-btn color="primary" @click="addColor">+ Add Option</v-btn></v-col>
      </v-row>
      <v-col cols="12">
        <v-card tile>
          <v-card-text class="pa-0">
            <v-data-table
              hide-default-footer
              :calculate-widths="true"
              :loading="loadingItems"
              :headers="headers"
              :items="getColor"
              :items-per-page="50"
            >
              <template widths="400" v-slot:[`item._source.name`]="{ item }">
                {{ item.title }}
              </template>
              <template widths="400" v-slot:[`item._source.color`]="{ item }">
                {{ changeColorName(item.values) }}
              </template>
              <template widths="400" v-slot:[`item._source.add`]="">
                <v-btn outlined color="primary">+ Add</v-btn>
              </template>
              <template widths="400" v-slot:[`item._source.option`]="{ item }">
                <v-btn class="mr-2" @click="editColor(item._id)" outlined color="primary"
                  ><v-icon>mdi-pencil mdi-18px</v-icon></v-btn
                >
                <v-btn outlined @click="openDeleteColor(item._id)" color="error"
                  ><v-icon>mdi mdi-delete mdi-18px</v-icon></v-btn
                >
              </template>
              <!-- xuất hiện ở footer -->
              <!-- <template v-slot:footer.prepend>
                <v-row class="ma-0">
                  <v-col><v-btn class="" color="primary" @click="addColor">+ Add Option</v-btn></v-col>
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
    <modal model="dialogDeleteVariant" title="Delete" :callback="deleteVariantColor">
      <template slot="content">
        <div>Do you want to delete this object ? This action cannot be reversed.</div>
      </template>
    </modal>
    <modal model="dialogDeleteTitle" title="Delete" :callback="deleteColor">
      <template slot="content">
        <div>Do you want to delete this object ? This action cannot be reversed.</div>
      </template>
    </modal>
    <v-dialog class="pa-5" width="700" v-model="turnOnEditColor">
      <v-card class="px-5 py-5" relative>
        <h2 class="pl-0 pt-0 mb-3 text-center">
          Color
        </h2>
        <div class="close-icon" @click="turnOnEditColor = false">
          <v-icon>mdi-close</v-icon>
        </div>
        <v-row>
          <v-col sm="12"
            ><label>Title</label><v-text-field hide-details="" dense outlined v-model="dataDialog.title"></v-text-field
          ></v-col>
          <v-col sm="12"><v-divider></v-divider></v-col>
        </v-row>
        <v-row
          ><v-col class="py-0 text-end btn" sm="12"
            ><v-btn class="btn" color="primary" @click="addVariantColor">+ Add</v-btn></v-col
          ></v-row
        >
        <v-row v-for="(item, ind1) in dataDialog.values" :key="ind1 + '1'" class="">
          <v-col sm="5">
            <label for="">Value</label>
            <v-text-field hide-details="" dense outlined v-model="item.value"></v-text-field>
          </v-col>
          <v-col sm="5">
            <label for="">Code</label>
            <v-text-field
              dense
              outlined
              :background-color="item.code"
              v-model="item.code"
              hide-details=""
            ></v-text-field>
          </v-col>
          <v-col sm="2" align-self="end" class="pb-4 text-end">
            <v-btn class="btn" style="width: 100%" outlined color="error" @click="openDeleteVariantColor(ind1)"
              ><v-icon>mdi mdi-delete mdi-18px</v-icon></v-btn
            >
          </v-col>
          <!-- <v-col sm="2" align-self="end" class="pb-4 text-end">
            <v-btn class="btn" style="width: 100%" outlined color="error" @click="curentVariantColor = ind1"
              >{{ curentVariantColor }}<v-icon>mdi mdi-pencil mdi-18px</v-icon>{{ ind1 }}</v-btn
            >
          </v-col>
          <div class="sketch-color">
            <sketch-picker v-model="document[curentColor].values[ind1].code" class="ma-auto" />
          </div>
          {{colorPick[ind1]}} -->
          <v-col sm="2" v-if="ind1 < dataDialog.values.length - 1"></v-col>
          <v-col sm="8" v-if="ind1 < dataDialog.values.length - 1"><v-divider></v-divider></v-col>
        </v-row>
        <v-divider class="mt-4"></v-divider>
        <v-card-actions class="px-0 mt-2">
          <v-spacer></v-spacer>
          <v-btn class="btn" color="error" @click="cancel">Cancel</v-btn>
          <v-btn class="btn" color="primary" @click="submit(dataDialog)">Save</v-btn>
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
      indexOfTitleDelete: 0, // index của title muốn xóa (index của dòng)
      dialogDeleteTitle: false, // xuất hiện khi xóa title ( cả dòng),
      variantDelete: 0, // index của color muốn xóa (trong 1 title)
      dialogDeleteVariant: false, // xuất hiện khi xóa variant color
      dataDialog: {},
      curentColor: 0,
      curentVariantColor: 0,
      colorPick: [], // lưu cái color đang sửa ra, để lưu lại vào data gửi lên api
      dataColor: formData.form,
      turnOnSketch: [{ display: true }],
      showDialog: false,
      search: '',
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      showFilter: true,
      document: [],
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
          text: 'Value',
          value: '_source.color',
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
      turnOnEditColor: false,
      indexOfEditColor: null,
      isEdit: null, // phân biệt là đang edit hay add
    }
  },
  // watch: {},
  created() {
    this.fetchColor()
    // console.log(this.getColor);
    // this.document = this.getColor
    // this.document.forEach(i => {
    //   i.values.forEach(y => { return y.code = {}})
    // })
    // console.log(this.document);
  },
  computed: {
    ...mapGetters(['getColor']),
  },
  methods: {
    addColor() {
      this.turnOnEditColor = true
      this.isEdit = false
      this.curentColor = 0
      this.dataDialog = {
        title: '',
        description: '',
        type: 'color',
        values: [{ code: '', value: '' }],
      }
    },
    openDeleteColor(ind) {
      this.dialogDeleteTitle = true
      this.indexOfTitleDelete = ind
    },
    deleteColor() {
      this.loadingItems = true
      this.$store
        .dispatch('deleteColor', this.indexOfTitleDelete)
        .then(() => {
          this.fetchColor()
          this.loadingItems = false
          this.dialogDeleteTitle = false
        })
        .catch(() => {
          console.log('error')
          this.loadingItems = false
        })
    },
    editColor(idd) {
      console.log(idd);
      this.isEdit = true
      let position = this.getColor.findIndex(i => i._id == idd)
      let convertData = Object.assign({}, this.getColor[position])
      console.log(convertData);
      convertData = {
        _id : convertData._id,
        title: convertData.title,
        values: convertData.values.map(it => {
          return {
            ...it,
          }
        }),
        // values: convertData.values.map(it => it),
      }
      this.dataDialog = Object.assign({}, convertData)
      this.colorPick = convertData.values.map(i => i)
      console.log(this.dataDialog);
      this.curentColor = position
      this.turnOnEditColor = true
    },
    cancel() {
      this.turnOnEditColor = false
    },
    // khi click vào btn xóa
    openDeleteVariantColor(ind) {
      this.dialogDeleteVariant = true
      this.variantDelete = ind
    },
    // khi ấn ok trong dialog hiện lên
    deleteVariantColor() {
      this.dataDialog.values.splice(this.variantDelete, 1)
      this.dialogDeleteVariant = false
    },
    addVariantColor() {
      this.turnOnEditColor = true
      this.dataDialog.values.push({
        code: '',
        value: '',
      })
    },
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
    fetchColor() {
      this.loadingItems = true
      this.$store
        .dispatch('getColor', { type: 'color', page: 0, limit: 20 })
        .then(() => (this.loadingItems = false))
        .catch(() => {
          console.log('error')
          this.loadingItems = false
        })
    },
    // sửa color
    submit(item) {
      if (this.isEdit == true) {
        let data = {
          option: { option: { title: item.title, values: item.values } },
          id: item._id,
        }
        this.$store
          .dispatch('setColor', data)
          .then(() => this.fetchColor())
          .catch(() => {
            console.log('error')
          })
      } else if (this.isEdit == false) {
        let data = { option: { option: { title: item.title, type: item.type, values: item.values } } }
        this.$store
          .dispatch('addColor', data)
          .then(() => this.fetchColor())
          .catch(() => {
            console.log('error')
          })
      }
      this.isEdit = null
      this.turnOnEditColor = false
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
  // watch: {
  //   document: {
  //     handler: function(){
  //       console.log(1111);
  //       this.colorPick[this.curentVariantColor].code = this.document[this.curentColor].values[this.curentVariantColor].code.hex
  //     },
  //     deep: true
  //   },
  // },
}
</script>

<style scoped>
.btn {
  width: 90px !important;
}
label {
  color: black;
}
.close-icon {
  position: absolute;
  top: 16px;
  right: 10px;
  cursor: pointer;
}
</style>
