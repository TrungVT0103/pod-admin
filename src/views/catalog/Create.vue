<template>
  <div class="template-table">
    <v-container>
      <v-row v-if="!isLoading" class="px-16">
        <v-col cols="12">
          <v-chip
            class="ma-2"
            color="grey"
            label
            text-color="white"
            @click="$router.push({ name: 'lattehub.catalog' })"
          >
            <v-icon left> mdi-chevron-left </v-icon>
            Catalog
          </v-chip>
        </v-col>
        <v-col cols="12" class="headline font-weight-bold text-capitalize d-flex align-center justify-space-between">
          <span>{{ $route.params.id ? 'Edit' : 'Create' }} Catalog</span>
          <div>
            <v-btn class="mr-2" outlined @click="cancel">Cancel</v-btn>
            <v-btn color="primary" text-color="white" @click="save">Save</v-btn>
          </div>
        </v-col>
        <v-col cols="8">
          <v-card>
            <v-card-title class="subtitle-1 font-weight-bold"> Title </v-card-title>
            <v-card-text class="">
              <v-text-field
                label="Title"
                v-model="catalog.title"
                :rules="[(v) => !!v || 'Title is required']"
                placeholder="Title"
                outlined
                dense
              ></v-text-field>
            </v-card-text>
            <!-- <v-card-title class="subtitle-1 font-weight-bold">
              Description
            </v-card-title> -->
            <v-card-text class="py-0 mb-0">
              <!-- <v-textarea
                outlined
                v-model="catalog.description"
                class="mb-0"
                height="150px"
                label="Description"
              ></v-textarea> -->
              <Editor @callback="callbackGetHtml" :itemSetData="catalog" />
            </v-card-text>
            <v-row class="py-5">
              <v-col cols="3">
                <v-card-title class="subtitle-1 font-weight-bold"> Price </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-text-field
                    label="Price"
                    placeholder="Price"
                    outlined
                    v-model.number="catalog.attributes.salePrice"
                    type="number"
                    min="0"
                    dense
                    hide-details
                  ></v-text-field>
                </v-card-text>
              </v-col>
              <v-col cols="3">
                <v-card-title class="subtitle-1 font-weight-bold"> Compare Price </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-text-field
                    label="Compare Price"
                    v-model.number="catalog.attributes.compareAtPrice"
                    type="number"
                    min="0"
                    placeholder="Processing time"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </v-card-text>
              </v-col>
              <v-col cols="6">
                <v-card-title class="subtitle-1 font-weight-bold"> Processing Time </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-text-field
                    label="Processing Time"
                    v-model="catalog.processTime"
                    placeholder="Processing time"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </v-card-text>
              </v-col>
              <v-col cols="3">
                <v-card-title class="subtitle-1 font-weight-bold"> Type </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-select
                    :items="getMockup"
                    item-text="name"
                    item-value="_id"
                    label="Type"
                    v-model="mockupType"
                    :return-object="true"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'Type is required']"
                  ></v-select>
                </v-card-text>
              </v-col>
              <v-col cols="3">
                <v-card-title class="subtitle-1 font-weight-bold"> Color </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-select
                    :items="getColor"
                    item-text="title"
                    item-value="_id"
                    label="Color"
                    v-model="colorOption"
                    :return-object="true"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'Color is required']"
                  ></v-select>
                </v-card-text>
              </v-col>
              <v-col cols="3">
                <v-card-title class="subtitle-1 font-weight-bold"> Size </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-select
                    :items="getSize"
                    item-text="title"
                    item-value="_id"
                    label="Size"
                    v-model="sizeOption"
                    :return-object="true"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'Size is required']"
                  ></v-select>
                </v-card-text>
              </v-col>
              <v-col cols="3">
                <v-card-title class="subtitle-1 font-weight-bold"> Type print </v-card-title>
                <v-card-text class="py-0 mb-0">
                  <v-select
                    :items="[
                      { name: 'Default', value: 'default' },
                      { name: 'PSD', value: 'psd' },
                      { name: 'Phone Case', value: 'phonecase' },
                    ]"
                    item-text="name"
                    item-value="value"
                    label="Type"
                    v-model="catalog.type"
                    outlined
                    dense
                    :rules="[(v) => !!v || 'Type is required']"
                  ></v-select>
                  <!-- <v-text-field label="Type print" v-model="catalog.type" outlined dense></v-text-field> -->
                </v-card-text>
              </v-col>
            </v-row>
            <div v-if="$route.params.id" class="">
              <v-card-title class="d-flex align-center justify-space-between">
                <div>Templates</div>
                <v-btn class="ma-2" color="primary" normal @click="goToTemplate($route.params.id)">
                  <v-icon>mdi-plus</v-icon>Add Template
                </v-btn>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="templates"
                :items-per-page="20"
                :footer-props="footerOption"
                @update:items-per-page="changeLimit"
                @update:page="changePage"
                :server-items-length="totalTemplates"
                :loading="loadingTemplate"
              >
                <template v-slot:[`item.image`]="{ item }">
                  <div class="">
                    <v-img
                      @mouseenter="getImage(item.imageSrc)"
                      @mouseleave="clearImage()"
                      style="cursor: pointer"
                      :src="imageHelpers.url(item.imageSrc, { width: 50, height: 50 })"
                      :lazy-src="item.imageSrc"
                      max-height="50"
                      max-width="50"
                    ></v-img>
                  </div>
                </template>
                <template v-slot:[`item.title`]="{ item }">
                  {{ item.title }}
                </template>
                <template v-slot:[`item.default`]="{ item }">
                  {{ item.isDefault ? 'Yes' : 'No' }}
                </template>
                <template v-slot:[`item.isRendered`]="{ item }">
                  <v-checkbox v-model="item.isRendered" @change="changeRender(item)" label=" "> </v-checkbox>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon @click="editTemplate($route.params.id, item._id)" normal color="primary" class="mr-2">
                    mdi-pencil
                  </v-icon>
                  <v-icon @click="openDeleteTemplate(item._id)" normal color="error"> mdi-delete </v-icon>
                </template>
              </v-data-table>
              <PreviewImg class="detail-avatar" v-show="hasFrame" :image="templateAvatar"></PreviewImg>
            </div>
          </v-card>
          <!-- <div v-if="hasFrame">
            <div class="detail-avatar" v-if="hasFrame">
              <v-img
                :src="imageHelpers.url(templateAvatar, { width: 450, height: 450 })"
                max-height="450"
                max-width="450"
              ></v-img>
            </div>
          </div> -->
        </v-col>
        <v-col cols="4" class="">
          <UploadImage
            :height="`300`"
            :image="catalog"
            :itemSetData="catalog"
            @callback="callback"
            @callbackDelete="callbackDelete"
          />
        </v-col>
        <v-col cols="12" class="d-flex align-center justify-start">
          <v-btn class="mr-2" outlined @click="cancel">Cancel</v-btn>
          <v-btn color="primary" text-color="white" @click="save">Save</v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="onDeleteTemplate" persistent max-width="700">
          <v-card>
            <v-card-title class="text-h5"> Are you sure you want to delete this template? </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="cancelDeleteTemplate"> Disagree </v-btn>
              <v-btn color="green darken-1" text @click="deleteTemplate"> Agree </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import UploadImage from '../../components/components/UploadImage.vue'
import Editor from '../../components/components/Editor.vue'
import { mapGetters } from 'vuex'
import imageHelpers from '@/helpers/image'
import PreviewImg from '@/components/PreviewModal'
export default {
  components: {
    UploadImage,
    Editor,
    PreviewImg,
  },
  data() {
    return {
      dataFetch: '', // là filterQuery có thêm trường id:mockupId, để call api mỗi lần change
      filterQuery: {
        // data k có mockupId, để replace lại query mỗi lần change
        page: 1,
        limit: 20,
        id: this.$route.params.id,
      },
      footerOption: {
        itemsPerPageOptions: [5, 10, 20],
      },
      onDialog: true,
      hasFrame: false,
      templateAvatar: '',
      idDeleteTemplate: '',
      onDeleteTemplate: false,
      imageHelpers: imageHelpers,
      headers: [
        { text: 'Image', value: 'image' },
        { text: 'Title', value: 'title' },
        { text: 'Layout', value: 'default' },
        { text: 'DefaultRender', value: 'isRendered' },
        { text: 'Actions', value: 'actions' },
      ],
      attributes: {
        bodyHtml: '334',
      },
      isLoading: true,
      loadingTemplate: false,
      catalog: {
        title: '',
        description: '',
        vendor: '',
        tags: [],
        price: 4.95,
        processTime: '',
        mockupType: '',
        sizeOption: '',
        colorOption: '',
        type: '',
        imageSrc: '',
        layouts: [],
        frames: [],
        attributes: {
          active: true,
          sku: 'SKU ',
          barCode: 'Barcode ',
          cost: 0,
          salePrice: 19.95,
          compareAtPrice: 40,
          inventoryPolicy: 'deny',
          requiresShipping: true,
          weightUnit: 'lb',
          weight: 0,
          inventoryQuantity: null,
        },
      },
      panelLayout: [0],
      panelFrame: [0],
      disabled: false,
      readonly: false,
      positions: [
        {
          id: 'front',
          label: 'Front',
        },
        {
          id: 'back',
          label: 'Back',
        },
      ],
      dialog: false,
      sizeOption: {},
      colorOption: {},
      mockupType: {},
    }
  },
  computed: {
    ...mapGetters(['getColor', 'getSize', 'getMockup', 'catalogEdit', 'templates', 'totalTemplates']),
  },
  methods: {
    async changeRender(item) {
      try {
        await this.$store.dispatch('updateTemplate', { template: item, templateId: item._id })
      } catch (error) {
        console.log(`error`, error)
        //
      }
    },
    // khi change limit, page
    changeLimit(infor) {
      this.filterQuery.limit = infor
      this.$router.push({
        path: this.$route.path,
        query: { page: this.filterQuery.page, limit: this.filterQuery.limit },
      })
    },
    changePage(infor) {
      this.filterQuery.page = infor
      this.$router.push({
        path: this.$route.path,
        query: { page: this.filterQuery.page, limit: this.filterQuery.limit },
      })
    },
    onDetailImage(item) {
      console.log(item)
      // this.templateAvatar = item
      // this.hasFrame = true
    },
    getImage(item) {
      this.templateAvatar = item
      this.hasFrame = true
    },
    clearImage() {
      this.templateAvatar = ''
      this.hasFrame = false
    },
    openDeleteTemplate(id) {
      this.onDeleteTemplate = true
      this.idDeleteTemplate = id
    },
    async deleteTemplate() {
      this.onDeleteTemplate = false
      await this.$store.dispatch('deleteTemplate', this.idDeleteTemplate)
      await this.$store.dispatch('getTemplate', this.filterQuery)
    },
    cancelDeleteTemplate() {
      this.onDeleteTemplate = false
    },
    editTemplate(mockupId, id) {
      console.log(this.$route, mockupId, id)
      this.$router.push({ name: 'lattehub.template.edit', params: { mockupId: mockupId, id: id } })
    },
    goToTemplate() {
      this.$router.push({ name: 'lattehub.template.create', params: { mockupId: this.$route.params.id } })
    },
    callbackGetHtml(itemSetData, html) {
      itemSetData.description = html
    },
    uploadFile() {
      this.$refs.inputImage.click()
    },
    callbackDelete(itemSetData, type) {
      if (type == 'image') {
        itemSetData.imageSrc = ''
      } else {
        itemSetData.src = ''
      }
      this.$forceUpdate()
    },
    callback(obj, itemSetData, type) {
      if (type == 'image') {
        itemSetData.imageSrc = obj.imageSrc
      } else {
        itemSetData.src = obj.imageSrc
      }
      this.$forceUpdate()
    },
    addLayout() {
      let layout = {
        title: 'Title',
        description: '',
        imageSrc: '',
        code: 'front',
        height: 0,
        width: 0,
        slot: {
          height: 100,
          left: 0,
          top: 0,
          width: 100,
        },
      }
      this.catalog.layouts.push(layout)
      this.panelLayout[0] = this.catalog.layouts.length - 1
    },
    removeLayout(index) {
      this.catalog.layouts.splice(index, 1)
    },
    addFrame() {
      let frame = {
        title: '',
        layout: 'front',
        imageSrc: '',
        height: 0,
        width: 0,
        slots: [],
      }
      this.catalog.frames.push(frame)
      this.panelFrame[0] = this.catalog.frames.length - 1
    },
    addSlot(index) {
      let slot = {
        height: 100,
        left: 0,
        top: 0,
        width: 100,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      }
      console.log('add slot')
      this.catalog.frames[index].slots.push(slot)
    },
    removeSlot(indexFrame, indexSlot) {
      this.catalog.frames[indexFrame].slots.splice(indexSlot, 1)
    },
    removeFrame(index) {
      this.catalog.frames.splice(index, 1)
    },
    cancel() {
      this.$router.push({ name: 'lattehub.catalog' })
    },
    async save() {
      if (this.$route.params.id) {
        await this.$store.dispatch('updateCatalog', { id: this.$route.params.id, data: this.catalog })
        await this.$store.dispatch('getCatalogId', this.$route.params.id)
      } else {
        await this.$store.dispatch('createCatalog', this.catalog)
      }
    },
  },
  async created() {
    console.log(this.$router)
    console.log(this.$route)
    this.isLoading = true
    let idd = this.$route.params.id
    console.log(idd)
    // this.dataFetch = {
    //   id: idd,
    //   page: this.filterQuery.page,
    //   limit: this.filterQuery.limit,
    // }
    await this.$store.dispatch('getColor', { type: 'color', page: 0, limit: 100 })
    await this.$store.dispatch('getSize', { type: 'size', page: 0, limit: 100 })
    await this.$store.dispatch('getMockup')
    if (this.$route.params.id) {
      // console.log(this.dataFetch)
      await this.$store.dispatch('getTemplate', this.filterQuery)
      await this.$store.dispatch('getCatalogId', this.$route.params.id)
      this.panelLayout = []
      this.panelFrame = []
      this.catalog = this.catalogEdit
      console.log(
        'size',
        typeof this.catalogEdit.sizeOption,
        typeof this.catalogEdit.colorOption,
        typeof this.catalogEdit.mockupType,
      )
      if (typeof this.catalogEdit.sizeOption === 'object') {
        this.sizeOption = this.catalogEdit.sizeOption
      } else if (typeof this.catalogEdit.sizeOption === 'string') {
        this.sizeOption = this.getSize.find((value) => value._id === this.catalogEdit.sizeOption)
      }
      if (typeof this.catalogEdit.colorOption === 'object') {
        this.colorOption = this.catalogEdit.colorOption
      } else if (typeof this.catalogEdit.sizeOption === 'string') {
        this.colorOption = this.getColor.find((value) => value._id === this.catalogEdit.colorOption)
      }
      if (typeof this.catalogEdit.mockupType === 'object') {
        this.mockupType = this.catalogEdit.mockupType
      } else if (typeof this.catalogEdit.mockupType === 'string') {
        this.mockupType = this.getMockup.find((value) => value._id === this.catalogEdit.mockupType)
      }
    } else {
      this.sizeOption = this.getSize[0]
      this.colorOption = this.getColor[0]
      this.mockupType = this.getMockup[0]
    }
    this.isLoading = false
  },
  watch: {
    '$route.query': {
      handler() {
        console.log(this.filterQuery)
        this.loadingTemplate = true
        this.$store
          .dispatch('getTemplate', this.filterQuery)
          .then(() => {
            this.loadingTemplate = false
          })
          .catch(() => {
            this.loadingTemplate = false
          })
      },
    },
    sizeOption: {
      deep: true,
      handler() {
        console.log('this.sizeOption', this.sizeOption)
        this.catalog.sizeOption = this.sizeOption._id
      },
    },
    colorOption: {
      deep: true,
      handler() {
        console.log('this.colorOption', this.colorOption)
        this.catalog.colorOption = this.colorOption._id
      },
    },
    mockupType: {
      deep: true,
      handler() {
        console.log('this.mockupType', this.mockupType)
        this.catalog.mockupType = this.mockupType._id
      },
    },
  },
}
</script>

<style lang="scss">
.hidden {
  display: none;
}
.border-slot {
  border: 1px solid #e0e0e0;
}
.template-table {
  position: relative;
}
.detail-avatar {
  position: fixed;
  background-color: white;
  top: 20%;
  left: 40%;
  box-shadow: 1px 3px 6px 4px grey !important;
  border: solid 1px black;
  z-index: 10;
}
</style>
