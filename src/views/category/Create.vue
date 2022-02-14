<template>
  <div class="page-forms">
    <v-container>
      <v-row>
        <v-col :cols="12" :lg="8">
          <v-form>
            <div class="mb-4" tile v-for="item in model" :key="item.lang">
              <v-card>
                <v-card-title>Language: {{ item.lang }}</v-card-title>
                <v-divider />
                <v-card-text>
                  <v-text-field
                    v-model="item.title"
                    outlined
                    label="Title"
                    required
                    :append-icon="'mdi-account-check'"
                  />
                  <v-text-field
                    v-model="item.description"
                    outlined
                    label="Description"
                    required
                    :append-icon="'mdi-email'"
                  />
                </v-card-text>
              </v-card>
            </div>
            <div class="mb-4">
              <v-card>
                <v-card-title>Select group</v-card-title>
                <v-card-text>
                  <v-select
                    outlined
                    :items="getPostGroups"
                    item-text="title"
                    item-value="id"
                    v-model="group"
                  ></v-select>
                </v-card-text>
              </v-card>
            </div>
            <div>
              <v-card>
                <v-card-actions>
                  <v-btn text @click="handleCancelForm">Cancel</v-btn>
                  <v-spacer />
                  <v-btn tile color="primary" @click="handleSubmitForm">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-form>
        </v-col>
        <v-col :cols="12" :lg="4">
          <UploadImage
            :height="`250`"
            :image="image"
            :itemSetData="image"
            @callback="callback"
            @callbackDelete="callbackDelete"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import UploadImage from '@/components/components/UploadImage.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    UploadImage,
  },
  data() {
    return {
      loading: false,
      image: {
        imageSrc: '',
      },
      group: '',
      model: [
        {
          lang: 'vi',
          title: '',
          description: '',
          image: '',
          group: '',
        },
        {
          lang: 'en',
          title: '',
          description: '',
          image: '',
          group: '',
        },
      ],
    }
  },
  methods: {
    handleCancelForm() {
      this.$router.go(-1)
    },
    handleSubmitForm() {
      this.loading = true
      let postData = this.model.map(category => {
        category.image = this.image.imageSrc
        category.group = this.group
        return category
      })
      this.$store
        .dispatch('createOneCategory', {
          data: postData,
          group: this.group,
        })
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'category.list' })
        })
        .catch(err => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            show: true,
            text: err.message,
            color: 'error',
          })
          this.loading = false
        })
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
  },
  computed: {
    ...mapGetters(['getLocale', 'getPostGroups']),
  },
  created() {
    this.$store
      .dispatch('getPostGroups', {
        lang: this.getLocale,
      })
      .catch(() => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Auth Failed',
          color: 'error',
        })
        this.loading = false
      })
  },
}
</script>
