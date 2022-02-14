<template>
  <div class="pa-4">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2>Posts</h2>
          <v-btn color="primary" @click="onCreatePost"> <v-icon>mdi-plus</v-icon>Create Post </v-btn>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="getPosts"
              hide-default-footer
              item-key="name"
              :items-per-page="1000"
            >
              <template v-slot:[`item.stt`]="{ item }">
                <div class="post-title font-weight-bold">{{ getPosts.indexOf(item) + 1 }}</div>
              </template>
              <template v-slot:[`item.title`]="{ item }">
                <div class="content font-weight-bold my-2">{{ item.title }}</div>
              </template>
              <template v-slot:[`item.description`]="{item}">
                <div @click="updatePost(item.id)" class="content" style="cursor: pointer">View detail post</div>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" @click="updatePost(item.id)" normal class="mr-2" color="primary">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit Post</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs}">
                   <v-icon v-on="on" v-bind="attrs" @click="onDeleteCategory(item)" color="error" normal>
                    mdi-delete
                  </v-icon>
                  </template>
                  <span>Detele Post</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-skeleton-loader v-else class="mx-auto" type="card"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
      <modal model="dialogDelateCategory" title="Delete Category" :callback="deletePost">
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
  name: 'post-list',
  data() {
    let query = this.$route.query
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
          fixed: true
        },
        { text: 'Description', value: 'description', sortable: false, width: '25%' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'start', width: '25%'},
      ],
      dialogDelateCategory: false,
      category: query.category || null,
    }
  },
  computed: {
    ...mapGetters(['getLocale', 'getCategories', 'getPosts']),
    headers0() {
      return this.headers.map(header => Object.assign({}, header, {fixed: false}))
    },
  },
  methods: {
    viewListArticle(id) {
      this.$router.push({ name: 'posts', query: { category: id } })
    },
    onCreatePost() {
      this.$router.push({ name: 'post.create' })
    },
    updatePost(id) {
      this.$router.push({
        name: 'post.update',
        params: { id: id },
      })
    },
    onDeleteCategory(item) {
      this.idCatalog = item.id
      this.dialogDelateCategory = true
    },
    cancel() {
      this.dialogDelateCategory = false
      this.idCatalog = ''
    },
    getListPosts() {
      let filters = {
        lang: this.getLocale,
        category: this.category,
      }
      this.$store.dispatch('getAllPost', filters)
    },
    async deletePost() {
      await this.$store.dispatch('deleteOnePost', this.idCatalog)
      this.dialogDelateCategory = false
      this.idCatalog = ''
      this.isLoading = true
      // await this.$store.dispatch('getCatalog')
      this.getListPosts();
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
    this.getListPosts();
  },
  watch: {
    getLocale: function() {
      this.fetchRecords({})
      this.getListPosts();
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
