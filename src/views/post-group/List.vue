<template>
  <div class="page-account pa-4">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2>Groups</h2>
          <v-btn color="primary" @click="gotoCreatePostGroup">
            <v-icon right dark>
              mdi-plus
            </v-icon>
            Create group
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-card tile>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="getPostGroups"
                :items-per-page="50"
                :server-items-length="100"
                :hide-default-footer="true"
                :page.sync="filter['page']"
                item-key="id"
              >
                <template v-slot:[`item.stt`]="{ item }">
                  <div class="post-title font-weight-bold">
                    {{ getPostGroups.indexOf(item) + 1 }}
                  </div>
                </template>
                <template v-slot:[`item.title`]="{ item }">
                  <div class="post-title font-weight-bold">
                    {{ item.title }}
                  </div>
                </template>
                <template v-slot:[`item.isAdminActive`]="{ item }">
                  <v-btn class="ma-2" outlined :color="getColor(item.isAdminActive)" @click="updateStatus(item)">
                    {{ item.isAdminActive === false ? 'Inactive' : 'Active' }}
                  </v-btn>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon @click="updatePostGroup(item.id)" normal class="mr-2" color="primary">
                    mdi-pencil
                  </v-icon>
                  <v-icon @click="deletePostGroup(item.id)" color="error" normal>
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import { mapGetters } from 'vuex'
export default {
  components: {},
  mixins: [TooltipMixin],
  data() {
    let query = this.$route.query
    return {
      showDialog: false,
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      showFilter: true,
      filter: {
        page: query?.page || 1,
        limit: query?.limit || 50,
        lang: 'en',
      },
      headers: [
        { text: 'NO', value: 'stt', sortable: false, width: '10%' },
        {
          text: 'Title',
          value: 'title',
          width: '40%'
        },
        {
          text: 'Language',
          value: 'lang',
          width: '25%'
        },
        {
          text: 'Actions',
          value: 'actions',
          width: '25%',
          sortable: false,
        },
      ],
    }
  },
  created() {
    this.fetchRecords(this.filter)
  },
  computed: {
    ...mapGetters(['getLocale', 'getPostGroups']),
  },
  methods: {
    gotoCreatePostGroup() {
      this.$router.push({
        path: '/post-group/create',
      })
    },
    updatePostGroup(postId) {
      this.$router.push({
        name: 'UpdatePostGroup',
        params: {
          id: postId,
        },
      })
    },
    deletePostGroup(postId) {
      this.loading = true
      this.$store
        .dispatch('deletePostGroup', postId)
        .then(() => {
          this.loading = false
        })
        .catch(ex => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            show: true,
            text: ex.message,
            color: 'error',
          })
          this.loading = false
        })
    },
    fetchRecords(filters) {
      filters['lang'] = this.getLocale
      this.$store.dispatch('getPostGroups', filters).catch(() => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Auth Failed',
          color: 'error',
        })
        this.loading = false
      })
    },
  },
  watch: {
    getLocale: function() {
      this.fetchRecords(this.filter)
    },
  },
}
</script>
