<template>
  <div class="ma-4">
    <v-row>
      <v-spacer></v-spacer>
      <v-row class="ma-0">
        <v-col class="text-end"><v-btn class="" color="primary" @click="addSize">+ Add Option</v-btn></v-col>
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
              :items="getSize"
              :items-per-page="50"
            >
              <template widths="400" v-slot:[`item._source.name`]="{ item }">
                {{ item.title }}
              </template>
              <template widths="400" v-slot:[`item._source.size`]="{ item }">
                {{ changeColorName(item.values) }}
              </template>
              <template widths="400" v-slot:[`item._source.code`]="{ item }">
                {{ changeColorCode(item.values) }}
              </template>
              <template widths="400" v-slot:[`item._source.add`]="">
                <v-btn outlined color="primary">+ Add</v-btn>
              </template>
              <template widths="400" v-slot:[`item._source.option`]="{ item }">
                <v-btn class="mr-2" @click="editSize(item._id)" outlined color="primary"
                  ><v-icon>mdi-pencil mdi-18px</v-icon></v-btn
                >
                <v-btn outlined @click="openDeleteSize(item._id)" color="error"
                  ><v-icon>mdi mdi-delete mdi-18px</v-icon></v-btn
                >
              </template>
              <!-- xuất hiện ở footer -->
              <!-- <template v-slot:footer.prepend>
                <v-row class="ma-0">
                  <v-col><v-btn class="" color="primary" @click="addSize">+ Add Option</v-btn></v-col>
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
    <modal model="dialogDeleteVariant" title="Delete" :callback="deleteVariantSize">
      <template slot="content">
        <div>Do you want to delete this object ? This action cannot be reversed.</div>
      </template>
    </modal>
    <modal model="dialogDeleteTitle" title="Delete" :callback="deleteSize">
      <template slot="content">
        <div>Do you want to delete this object ? This action cannot be reversed.</div>
      </template>
    </modal>
    <v-dialog class="pa-5" width="1000" v-model="turnOnEditSize">
      <v-card class="px-5 py-5" relative>
        <h2 class="pl-0 pt-0 mb-3 text-center">Size</h2>
        <div class="close-icon" @click="turnOnEditSize = false">
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
            ><v-btn class="btn" color="primary" @click="addVariantSize">+ Add</v-btn></v-col
          ></v-row
        >
        <v-row v-for="(item, ind1) in $v.dataDialog.values.$each.$iter" :key="ind1 + '1'" class="">
          <v-col sm="3">
            <label for="">Name</label>
            <v-text-field
              placeholder="Type size name"
              hide-details=""
              dense
              outlined
              v-model="item.value.$model"
            ></v-text-field>
            <div class="red--text" v-if="!item.value.required">Name is required</div>
          </v-col>
          <v-col sm="2">
            <label for="">Code</label>
            <v-text-field
              placeholder="Type code"
              dense
              outlined
              v-model="item.code.$model"
              hide-details=""
            ></v-text-field>
            <div class="red--text" v-if="!item.code.required">Code is required</div>
          </v-col>
          <v-col sm="2">
            <label for="">Price</label>
            <v-text-field
              placeholder="price"
              dense
              outlined
              type="number"
              hide-details=""
              error-messages=""
              v-model.number="item.price.$model"
            ></v-text-field>
            <div class="red--text" v-if="!item.price.required">Price is required.</div>
            <div class="red--text" v-if="!item.price.minValue">Price must be greater than 0</div>
          </v-col>
          <v-col sm="3">
            <label for="">compareAtPrice</label>
            <v-text-field
              placeholder="compareAtPrice"
              dense
              outlined
              type="number"
              hide-details=""
              error-messages=""
              v-model.number="item.compareAtPrice.$model"
            ></v-text-field>
          </v-col>
          <v-col sm="2" class="pt-9 text-end">
            <v-btn class="btn" outlined style="width: 100%" color="error" @click="openDeleteVariantSize(ind1)"
              ><v-icon>mdi mdi-delete mdi-18px</v-icon></v-btn
            >
          </v-col>
          <v-col sm="12">
            <editor :height="300" type="size" @callback="callbackGetHtml" :itemSetData="item" />
          </v-col>
          <!-- <div class="sketch-color">
            <sketch-picker v-model="item.code" class="ma-auto" />
          </div> -->
          <v-col sm="2" v-if="ind1 < dataDialog.values.length - 1"></v-col>
          <v-col sm="8" v-if="ind1 < dataDialog.values.length - 1"><v-divider></v-divider></v-col>
        </v-row>
        <v-divider class="mt-4"></v-divider>
        <v-card-actions class="px-0">
          <v-spacer></v-spacer>
          <v-btn class="btn" color="primary" @click="cancel">Cancel</v-btn>
          <v-btn class="btn" color="error" :disabled="$v.$invalid" @click="submit(dataDialog)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import formData from './data'
import { required, minValue } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import Editor from '../../components/components/Editor.vue'

export default {
  components: { Editor },
  data() {
    return {
      des: '',
      indexOfTitleDelete: 0, // index của title muốn xóa (index của dòng)
      dialogDeleteTitle: false, // xuất hiện khi xóa title ( cả dòng),
      variantDelete: 0, // index của size muốn xóa (trong 1 title)
      dialogDeleteVariant: false, // xuất hiện khi xóa variant size
      dataDialog: {
        values: [
          {
            price: 3,
          },
        ],
      },
      // price: 3,
      curentSize: 0,
      dataColor: formData.form,
      turnOnSketch: [{ display: true }],
      showDialog: false,
      search: '',
      loadingItems: null,
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
          text: 'Value',
          value: '_source.size',
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
      turnOnEditSize: false,
      indexOfeditSize: null,
      isEdit: null, // phân biệt là đang edit hay add
    }
  },
  // watch: {},
  created() {
    this.fetchSize()
  },
  computed: {
    ...mapGetters(['getSize']),
  },
  methods: {
    callbackGetHtml(data, html) {
      data.description.$model = html
      console.log(data)
    },
    addSize() {
      this.turnOnEditSize = true
      this.isEdit = false
      this.curentSize = 0
      this.dataDialog = {
        title: '',
        description: '',
        type: 'size',
        values: [{ code: '', value: '', price: 0, description: '', compareAtPrice: 0 }],
      }
    },
    openDeleteSize(ind) {
      this.dialogDeleteTitle = true
      this.indexOfTitleDelete = ind
    },
    deleteSize() {
      this.loadingItems = true
      this.$store
        .dispatch('deleteSize', this.indexOfTitleDelete)
        .then(() => {
          this.dialogDeleteTitle = false
          this.fetchSize()
          this.loadingItems = false
        })
        .catch(() => {
          console.log('error')
          this.loadingItems = false
        })
    },
    editSize(idd) {
      this.isEdit = true
      let position = this.getSize.findIndex((i) => i._id == idd)
      let convertData = Object.assign({}, this.getSize[position])
      console.log(convertData)
      convertData = {
        _id: convertData._id,
        title: convertData.title,
        values: convertData.values.map((it) => {
          return {
            ...it,
          }
        }),
      }
      this.dataDialog = Object.assign({}, convertData)
      this.curentSize = position
      this.turnOnEditSize = true
    },
    cancel() {
      this.turnOnEditSize = false
    },
    // khi click vào btn xóa
    openDeleteVariantSize(ind) {
      this.dialogDeleteVariant = true
      this.variantDelete = ind
    },
    deleteVariantSize() {
      this.dataDialog.values.splice(this.variantDelete, 1)
      this.dialogDeleteVariant = false
    },
    addVariantSize() {
      this.turnOnEditSize = true
      this.dataDialog.values.push({
        value: '',
        code: '',
        price: 0,
        compareAtPrice: 0,
      })
    },
    changeColorName(a) {
      let result = []
      a.filter((i) => {
        if (i.value) {
          result.push(i.value)
        }
      })
      return result.join(', ')
    },
    changeColorCode(a) {
      let result = []
      a.filter((i) => {
        if (i.code) {
          result.push(i.code)
        }
      })
      return result.join(', ')
    },
    // lấy color về
    fetchSize() {
      this.loadingItems = true
      this.$store
        .dispatch('getSize', { type: 'size', page: 0, limit: 20 })
        .then(() => (this.loadingItems = false))
        .catch(() => {
          console.log('error')
          this.loadingItems = false
        })
    },
    // sửa color
    submit(item) {
      console.log(item)
      item.values
      if (this.isEdit == true) {
        let data = {
          option: { option: { title: item.title, values: item.values } },
          id: item._id,
        }
        this.$store
          .dispatch('setSize', data)
          .then(() => this.fetchSize())
          .catch(() => {
            console.log('error')
          })
      } else if (this.isEdit == false) {
        let data = { option: { option: { title: item.title, type: item.type, values: item.values } } }
        this.$store
          .dispatch('addSize', data)
          .then(() => this.fetchSize())
          .catch(() => {
            console.log('error')
          })
      }
      this.isEdit = null
      this.turnOnEditSize = false
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
  validations: {
    dataDialog: {
      values: {
        $each: {
          description: {},
          code: {
            required,
          },
          value: {
            required,
          },
          price: {
            required,
            minValue: minValue(0),
          },
          compareAtPrice: {},
        },
      },
    },
  },
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
