<template>
  <div class="pa-4">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2>Categories</h2>
          <v-btn color="primary" @click="onCreateCatalog"> <v-icon>mdi-plus</v-icon>Create Category </v-btn>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="getCategories"
              hide-default-footer
              item-key="name"
              class="elevation-1"
              :items-per-page="1000"
            >
              <template v-slot:[`item.stt`]="{ item }">
                <div class="post-title font-weight-bold">{{ getCategories.indexOf(item) + 1 }}</div>
              </template>
              <template v-slot:[`item.title`]="{ item }">
                <div class="content font-weight-bold my-2">{{ item.title }}</div>
              </template>
              <template v-slot:[`item.post`]="{ item }">
                <v-icon
                  color="primary"
                  @click="$router.push({ name: 'help.category.create-post', params: { categoryId: item.id } })"
                  >mdi-plus</v-icon
                >
                <span color="primary" class="font-weight-bold blue--text">({{ item.templateCount }})</span>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" @click="updateCategory(item.id)" normal class="mr-2 ten1" color="primary">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit Category</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs}">
                    <v-icon v-on="on" v-bind="attrs" @click="onDeleteCategory(item)" class="mr-2" color="error" normal>
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Detele Category</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs}">
                    <v-icon v-on="on" v-bind="attrs" @click="viewListArticle(item.id)" color="green" normal>
                      mdi-file-eye
                    </v-icon>
                  </template>
                  <span>View Posts</span>
                </v-tooltip>
                
              </template>
            </v-data-table>
            <v-skeleton-loader v-else class="mx-auto" type="card"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
      <modal model="dialogDelateCategory" title="Delete Category" :callback="deleteCatalog">
        <template slot="content">
          <div>Are you sure you want to delete this category?</div>
        </template>
      </modal>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imageHelpers from '@/helpers/image'

export default {
  name: 'catalog',
  data() {
    return {
      dialogCreateCategory: false,
      imageHelpers: imageHelpers,
      query: {
        page: 0,
        limit: 10,
      },
      isLoading: false,
      headers: [
        { text: 'NO', value: 'stt', sortable: false, width: '10%' },
        {
          text: 'Title',
          align: 'start',
          value: 'title',
          sortable: false,
          width: '40%',
        },
        // { text: 'Image', value: 'imageSrc', sortable: false, },
        // { text: 'Price', value: 'price', sortable: false },
        // { text: 'Deleted', value: 'deleted', sortable: false },
        { text: 'Description', value: 'description', sortable: false, width: '25%' },
        { text: 'Actions', value: 'actions', sortable: false, width: '25%' },
      ],
      dialogDelateCategory: false,
      idCatalog: '',
    }
  },
  computed: {
    ...mapGetters(['getLocale', 'getCategories', 'getPostGroups']),
  },
  methods: {
    viewListArticle(id) {
      this.$router.push({ name: 'posts', query: { category: id } })
    },
    onCreateCatalog() {
      this.$router.push({ name: 'category.create' })
    },
    updateCategory(id) {
      this.$router.push({ name: 'category.update', params: { id: id } })
    },
    onDeleteCategory(item) {
      this.idCatalog = item.id
      this.dialogDelateCategory = true
    },
    cancel() {
      this.dialogDelateCategory = false
      this.idCatalog = ''
    },
    async deleteCatalog() {
      // await this.$store.dispatch('deleteCatalog', this.idCatalog)
      // let filters = {
      //   id: this.idCatalog,
      //   lang: this.getLocale,
      // };
      await this.$store.dispatch('deleteOneCategory', this.idCatalog)
      this.dialogDelateCategory = false
      this.idCatalog = ''
      this.isLoading = true
      // await this.$store.dispatch('getCatalog')
      await this.$store.dispatch('getAllCategory')
      this.isLoading = false
    },
    fetchRecords(filters) {
      filters['lang'] = this.getLocale
      this.$store.dispatch('getAllCategory', filters).catch(() => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Auth Failed',
          color: 'error',
        })
        this.loading = false
      })
    },
  },
  async created() {
    this.fetchRecords({})
  },
  watch: {
    getLocale: function() {
      this.fetchRecords({})
    },
  },
}
</script>

<style>
.hidden {
  display: none;
}
.content {
  word-break: break-all;
}
</style>
