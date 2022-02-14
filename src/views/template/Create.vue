<template>
  <div>
    <v-row class="px-16">
      <v-col cols="12">
        <v-chip
          color="grey"
          @click="$router.push({ name: 'lattehub.catalog.edit', params: { id: $route.params.mockupId } })"
          ><v-icon>mdi-chevron-left</v-icon>Catalog</v-chip
        >
      </v-col>
      <v-col cols="12" class="d-flex justify-space-between">
        <h3>{{ $route.params.mockupId && $route.params.id ? 'Edit' : 'Create' }} Template</h3>
        <div>
          <v-btn outlined @click="cancel" class="mr-3">Cancel</v-btn>
          <v-btn outlined @click="save" class="" :disabled="disableSave()" color="primary">Save</v-btn>
        </div>
      </v-col>
      <v-col cols="12">
        <v-card>
          <!-- <v-card-text>
            <label for="">Title</label>
            <v-text-field dense outlined v-model="$v.catalog.title.$model"></v-text-field>
          </v-card-text>
          <v-card-text><Editor /></v-card-text>
          <v-row class="px-4">
            <v-col cols="3">
              <h4>Price</h4>
              <v-text-field type="number" min="0" v-model.number="template.price" outlined dense placeholder="Price"></v-text-field>
            </v-col>
            <v-col cols="3">
              <h4>Compare Price</h4>
              <v-text-field type="number" min="0" v-model.number="template.comparePrice" outlined dense placeholder="Compare Price">Compare Price</v-text-field>
            </v-col>
            <v-col cols="6">
              <h4>Processing Time</h4>
              <v-text-field type="number" min="0" v-model.number="template.processTime" outlined dense placeholder="Compare Price">Processing Time</v-text-field>
            </v-col>
          </v-row>
          <v-row class="px-4">
            <v-col cols="3">
              <h4>Type</h4>
              <v-text-field v-model="template.type" outlined dense placeholder="Type">Type</v-text-field>
            </v-col>
            <v-col cols="3">
              <h4>Color</h4>
              <v-text-field v-model="template.color" outlined dense placeholder="Color">Color</v-text-field>
            </v-col>
            <v-col cols="3">
              <h4>Size</h4>
              <v-text-field v-model="template.size" outlined dense placeholder="Size">Size</v-text-field>
            </v-col>
            <v-col cols="3">
              <h4>Type Print</h4>
              <v-text-field v-model="template.typePrint" outlined dense placeholder="Type Print">Type Print</v-text-field>
            </v-col>
          </v-row> -->
          <v-row class="px-6">
            <v-col cols="12" class="py-0">
              <v-card-title class="d-flex align-center justify-space-between px-0">
                <div>Template</div>
                <!-- <v-btn class="ma-2" color="primary" normal @click="addFrame">
                  <v-icon>mdi-plus</v-icon>Add Template
                </v-btn> -->
              </v-card-title>
            </v-col>
            <v-col cols="4" class="">
              <v-row>
                <v-col cols="12">
                  <div class="font-weight-bold mr-2 my-2 subtitle-2">Mockup</div>
                  <v-autocomplete
                    v-model="template.mockup"
                    placeholder="Mock up"
                    :items="catalogs"
                    readonly
                    outlined
                    dense
                    chips
                    color="blue-grey lighten-2"
                    item-text="title"
                    item-value="_id"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        @click="data.select"
                        @click:close="remove(data.item)"
                      >
                        {{ data.item.title }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2" class="" align-self="center"
              ><v-checkbox v-model="template.isDefault" label="Layout"></v-checkbox
            ></v-col>
            <v-col cols="2" class="" align-self="center"
              ><v-checkbox v-model="template.isRendered" label="Default render"></v-checkbox
            ></v-col>
            <v-col cols="12" class="py-0 pb-5">
              <v-row>
                <v-col class="" cols="8">
                  <v-row>
                    <v-col cols="6">
                      <div>
                        <div class="font-weight-bold mr-2 my-2 subtitle-2">Title</div>
                        <v-text-field
                          v-model="template.title"
                          placeholder="title"
                          outlined
                          dense
                          :rules="[(v) => !!v || 'Title is required']"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div>
                        <div class="font-weight-bold mr-2 my-2 subtitle-2">Code</div>
                        <!-- <v-text-field
                          v-model="template.code"
                          placeholder="code"
                          outlined
                          dense
                          :rules="[v => !!v || 'Code is required']"
                        ></v-text-field> -->
                        <v-select
                          :items="[
                            { name: 'Back', value: 'back' },
                            { name: 'Front', value: 'front' },
                          ]"
                          item-text="name"
                          item-value="value"
                          v-model="template.code"
                          outlined
                          dense
                          :rules="[(v) => !!v || 'Code is required']"
                        ></v-select>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div>
                        <div class="font-weight-bold mr-2 my-2 subtitle-2">Height (px)</div>
                        <v-text-field
                          v-model.number="template.height"
                          placeholder="height"
                          outlined
                          dense
                          :rules="[(value) => value > 0 || 'Height must be greater than 0']"
                          type="number"
                          min="0"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div>
                        <div class="font-weight-bold mr-2 my-2 subtitle-2">Width (px)</div>
                        <v-text-field
                          v-model.number="template.width"
                          placeholder="width"
                          outlined
                          dense
                          :rules="[(value) => value > 0 || 'Width must be greater than 0']"
                          type="number"
                          min="0"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <!-- <v-col cols="12"><Editor :minHeight="400" @callback="callbackGetHtml" :itemSetData="template"/></v-col> -->
                    <v-col cols="12" class="text-uppercase font-weight-bold d-flex align-center justify-space-between">
                      <div>Slots</div>
                      <v-btn class="ma-2" color="primary" normal @click="addSlot()">
                        <v-icon>mdi-plus</v-icon>Add slot
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-expansion-panels flat light :disabled="disabled" v-model="panelSlot" multiple>
                        <v-expansion-panel
                          class="border-slot"
                          v-for="(slot, indexSlot) in template.slots"
                          :key="indexSlot"
                        >
                          <v-expansion-panel-header class="font-weight-bold"
                            >Slot {{ indexSlot + 1 }}</v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <v-row>
                              <v-col cols="4">
                                <div>
                                  <div class="font-weight-bold mr-2 my-2 subtitle-2">Height (%)</div>
                                  <v-text-field
                                    v-model.number="slot.height"
                                    placeholder="height"
                                    outlined
                                    dense
                                    type="number"
                                    min="0"
                                    :rules="[(value) => value > 0 || 'Height must be greater than 0']"
                                  ></v-text-field>
                                  <!-- :rules="[value => value <= 20 || 'Height must be greater than 0']" -->
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div>
                                  <div class="font-weight-bold mr-2 my-2 subtitle-2">Width (%)</div>
                                  <v-text-field
                                    v-model.number="slot.width"
                                    placeholder="width"
                                    outlined
                                    dense
                                    type="number"
                                    min="0"
                                    :rules="[(value) => value > 0 || 'Width must be greater than 0']"
                                  ></v-text-field>
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div>
                                  <div class="font-weight-bold mr-2 my-2 subtitle-2">Top (%)</div>
                                  <v-text-field
                                    v-model.number="slot.top"
                                    placeholder="top"
                                    outlined
                                    dense
                                    hide-details
                                    type="number"
                                    min="0"
                                  ></v-text-field>
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div>
                                  <div class="font-weight-bold mr-2 my-2 subtitle-2">Left (%)</div>
                                  <v-text-field
                                    v-model.number="slot.left"
                                    placeholder="left"
                                    outlined
                                    dense
                                    hide-details
                                    type="number"
                                    min="0"
                                  ></v-text-field>
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div>
                                  <div class="font-weight-bold mr-2 my-2 subtitle-2">Rotate(deg)</div>
                                  <v-text-field
                                    v-model.number="slot.rotate"
                                    placeholder="left"
                                    outlined
                                    dense
                                    hide-details
                                    type="number"
                                    min="0"
                                  ></v-text-field>
                                </div>
                              </v-col>
                              <v-col cols="4">
                                <div class="font-weight-bold mr-2 my-2 subtitle-2">Code</div>
                                <!-- <v-text-field
                                  v-model="slot.code"
                                  placeholder="code"
                                  outlined
                                  dense
                                  :rules="[value => !!value || 'Code is required']"
                                ></v-text-field> -->
                                <v-select
                                  :items="[
                                    { name: 'Back', value: 'back' },
                                    { name: 'Front', value: 'front' },
                                  ]"
                                  item-text="name"
                                  item-value="value"
                                  v-model="slot.code"
                                  outlined
                                  dense
                                  :rules="[(v) => !!v || 'Code is required']"
                                ></v-select>
                              </v-col>
                              <v-col cols="12" class="d-flex align-center justify-end">
                                <v-btn normal color="red" @click="removeSlot(indexSlot)" outlined>Remove slot</v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="4" class="pt-8">
                  <UploadImage
                    :height="`300`"
                    title="Thumbnail"
                    subTitle="( accept image file )"
                    @callback="callback"
                    :image="template"
                    :itemSetData="template"
                    @callbackDelete="callbackDelete"
                  />
                  <UploadImage
                    :height="`300`"
                    title="Another file"
                    subTitle="( accept psd file )"
                    typeUpload="all"
                    @callback="callback"
                    :image="template"
                    :itemSetData="template"
                    @callbackDelete="callbackDelete"
                  />
                </v-col>
                <!-- <v-col cols="12" class="">
                  <v-btn normal color="red" @click="removeFrame()" outlined>Remove Template</v-btn>
                </v-col> -->
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-start">
        <v-btn class="mr-2" outlined @click="cancel">Cancel</v-btn>
        <v-btn color="primary" outlined text-color="white" :disabled="disableSave()" @click="save">Save</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UploadImage from '../../components/components/UploadImage.vue'
// import UploadPsd from '../../components/components/UploadPsd.vue'
// import Editor from '../../components/components/Editor.vue'
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  components: {
    // Editor,
    UploadImage,
    // UploadPsd,
  },
  computed: {
    ...mapGetters(['catalogs', 'templates', 'oneTemplates']),
  },
  data() {
    return {
      loadingItems: false,
      disabled: false,
      template: {},
      template1: {
        isDefault: true,
        description: '',
        title: '',
        imageSrc: '',
        src: '',
        code: '',
        height: 0,
        width: 0,
        mockup: '',
        slots: [
          {
            height: 0,
            left: 0,
            top: 0,
            width: 0,
            rotate: 0,
            code: '',
          },
        ],
      },
      panelSlot: [0],
      // mockup: '',
      type: '',
    }
  },
  async created() {
    this.fetchMockup()
    if (this.$route.params.mockupId && this.$route.params.id) {
      await this.$store.dispatch('getOneTemplate', this.$route.params.id)
      console.log(this.oneTemplates)
      this.template = Object.assign({}, this.oneTemplates)
      // this.template = Object.assign({}, this.templates[0])
    } else {
      this.template = Object.assign({}, this.template1)
      this.template.mockup = this.$route.params.mockupId
      this.$forceUpdate()
      console.log(this.template)
    }

    console.log(this.$route)
  },
  methods: {
    checkPanelSlot(index) {
      let a = []
      if (this.panelSlot[0] == index) {
        this.panelSlot = a.map((x) => x)
      } else {
        a[0] = index + 1
        this.panelSlot = a.map((x) => x)
      }
    },
    disableSave() {
      let a
      let b
      let result
      if (
        this.template.code == '' ||
        this.template.title == '' ||
        this.template.height == '' ||
        this.template.src == '' ||
        this.template.width == ''
      ) {
        a = true
      }
      this.template?.slots?.find((y) => {
        if (y.height == 0 || y.width == 0 || y.code == '') {
          b = true
        }
      })
      if (a || b) {
        result = true
      } else {
        result = false
      }
      return result
    },
    callbackDelete(itemSetData, type) {
      // khi xóa ở phần chọn file
      if (type == 'image') {
        itemSetData.imageSrc = ''
        console.log('img-callbackdelete', itemSetData)
      } else {
        itemSetData.src = ''
        console.log('all-callbackdelete', itemSetData)
      }
      this.$forceUpdate()
    },
    callback(obj, itemSetData, type) {
      // khi chọn file
      if (type == 'image') {
        itemSetData.imageSrc = obj.imageSrc
      } else {
        itemSetData.src = obj.imageSrc
      }
      this.$forceUpdate()
    },
    fetchMockup() {
      this.loadingItems = true
      this.$store
        .dispatch('getCatalog')
        .then(() => (this.loadingItems = false))
        .catch(() => {
          console.log('error')
          this.loadingItems = false
        })
    },
    callbackGetHtml(itemSetData, html) {
      itemSetData.description = html
    },
    addSlot() {
      let slot = {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
        rotate: 0,
        code: '',
      }
      console.log(this.panelSlot)
      this.template.slots.push(slot)
      this.panelSlot = [this.template.slots.length - 1]
    },
    removeSlot(indexSlot) {
      this.template.slots.splice(indexSlot, 1)
    },
    removeFrame(index) {
      this.template.splice(index, 1)
    },
    cancel() {
      this.$router.push({ name: 'lattehub.catalog.edit', params: { id: this.$route.params.mockupId } })
    },
    async save() {
      if (this.$route.params.id) {
        console.log(this.template)
        console.log(this.$route.params.id)
        await this.$store.dispatch('updateTemplate', { template: this.template, templateId: this.$route.params.id })
      } else {
        console.log(this.mockup)
        console.log(this.$route)
        await this.$store.dispatch('createTemplate', this.template)
      }
      console.log({ ...this.template, isDefault: true })
      this.$router.push({ name: 'lattehub.catalog.edit', params: {id: this.$route.params.mockupId} })
    },
  },
  validations: {
    mockup: {
      required,
    },
    template: {
      frames: {
        $each: {
          title: {
            required,
          },
          code: {
            required,
          },
        },
      },
    },
  },
}
</script>

<style>
.border-slot {
  border: 1px solid #e0e0e0;
}
.hidden {
  display: none;
}
</style>
