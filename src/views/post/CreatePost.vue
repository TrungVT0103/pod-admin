<template>
  <div class="page-forms">
    <v-container>
      <v-row>
        <v-col :cols="12" :lg="12">
          <v-form v-if="!loading">
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
                  <Editor @callback="callbackGetHtml" :itemSetData="item" />
                </v-card-text>
              </v-card>
            </div>
            <div class="mb-4">
              <v-card>
                <v-card-title>Select category</v-card-title>
                <v-card-text>
                  <v-select
                    outlined
                    :items="getCategories"
                    item-text="title"
                    item-value="id"
                    v-model="category"
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
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Editor from '../../components/components/Editor.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Editor,
  },
  data() {
    let params = this.$route.params
    let query = this.$route.query
    return {
      loading: false,
      image: {
        imageSrc: '',
      },
      category: params.categoryId || query.category || null,
      model: [
        {
          lang: 'vi',
          title: '',
          description: '',
          image: '',
          category: '',
        },
        {
          lang: 'en',
          title: '',
          description: '',
          image: '',
          category: '',
        },
      ],
      currentPostId: params.id || null,
      currentCategoryId: query.categoryId,
    }
  },
  methods: {
    callbackGetHtml(itemSetData, html) {
      itemSetData.description = html
    },
    handleCancelForm() {
      this.$router.go(-1)
    },
    handleSubmitForm() {
      this.loading = true
      let postData = this.model.map(post => {
        post.category = this.category
        return post
      })
      if (this.category && this.currentPostId) {
        this.$store
          .dispatch('updateOnePost', { data: postData, category: this.category, id: this.currentPostId })
          .then(() => {
            this.loading = false
            this.$router.push({ name: 'posts' })
          })
          .catch(err => {
            window._VMA.$emit('SHOW_SNACKBAR', {
              show: true,
              text: err.message,
              color: 'error',
            })
            this.loading = false
          })
      } else {
        this.$store
          .dispatch('createOnePost', { data: postData, category: this.category })
          .then(() => {
            this.loading = false
            this.$router.push({ name: 'posts' })
          })
          .catch(err => {
            window._VMA.$emit('SHOW_SNACKBAR', {
              show: true,
              text: err.message,
              color: 'error',
            })
            this.loading = false
          })
      }
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
    ...mapGetters(['getLocale', 'getCategories', 'oneCategory', 'onePost']),
  },
  watch: {
    getLocale: function() {
      this.$store.dispatch('getAllCategory', { lang: this.getLocale }).catch(() => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Auth Failed',
          color: 'error.',
        })
        this.loading = false
      })
    },
  },
  async created() {
    this.loading = true
    await this.$store.dispatch('getAllCategory', { lang: this.getLocale })
    if (this.currentPostId) {
      this.$store
        .dispatch('getOnePost', this.currentPostId)
        .then(() => {
          this.model = this.onePost
          this.category = this.onePost[0].category
          this.loading = false
        })
        .catch(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            show: true,
            text: 'Auth Failed',
            color: 'error.',
          })
          this.loading = false
        })
    } else {
      this.loading = false
    }
  },
}
</script>
