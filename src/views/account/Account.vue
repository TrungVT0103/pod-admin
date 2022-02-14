<template>
  <div class="page-account">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-text-field
                v-model="filter['email']"
                text
                solo
                flat
                :prepend-icon="showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
                append-icon="mdi-magnify"
                placeholder="Type something"
                hide-details
                clearable
                @keyup.enter="handleApplyFilter"
                @click:append="handleApplyFilter"
                @click:prepend="showFilter = !showFilter"
                @click:clear="handleClear"
              />
              <!-- <v-btn icon @click="handleRefreshItem">
              <v-icon>mdi-refresh</v-icon>
            </v-btn> -->
            </v-toolbar>
            <v-divider />
            <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-row>
                  <v-col :cols="4">
                    <v-autocomplete
                      v-model="filter['isAdminActive']"
                      :items="status"
                      label="Status"
                      item-text="key"
                      item-value="value"
                      @change="handleStatusChange"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="handleResetFilter">Reset</v-btn>
                <v-btn tile color="primary" @click="handleApplyFilter">Apply</v-btn>
              </v-card-actions>
            </v-card>
            <v-card-text class="pa-0">
              <v-data-table
                :loading="loadingItems"
                :headers="headers"
                :items="getAccounts"
                :items-per-page="50"
                :server-items-length="getAccountOptions.total"
                :footer-props="footerProps"
                :page.sync="filter['page']"
                item-key="id"
                @update:page="handlePageChanged"
              >
                <template v-slot:[`item.createdAt`]="{ item }">
                  {{ `${formatDate(item.createdAt)}` }}
                </template>
                <template v-slot:[`item.isAdminActive`]="{ item }">
                  <v-btn class="ma-2" outlined :color="getColor(item.isAdminActive)" @click="updateStatus(item)">
                    {{ item.isAdminActive === false ? 'Inactive' : 'Active' }}
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="showDialog" scrollable width="840">
        <task-form :item="selectedItem" @form:success="handleFormSuccess" />
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import TaskForm from '@/components/form/TaskForm'
import { mapGetters } from 'vuex'
import Material from 'vuetify/es5/util/colors'
import * as moment from 'moment'

export default {
  components: {
    TaskForm,
  },
  mixins: [TooltipMixin],
  data() {
    let query = this.$route.query;
    return {
      showDialog: false,
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      showFilter: true,
      status: [
        {
          key: 'Active',
          value: 'true',
        },
        {
          key: 'Inactive',
          value: 'false',
        },
      ],
      filter: {
        page: query?.page || 1,
        limit: query?.limit || 50,
        email: query?.email || null,
        isAdminActive: query?.isAdminActive || null,
      },
      footerProps: {
        itemsPerPageOptions: [20, 50, 100],
      },
      headers: [
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Created At',
          value: 'createdAt',
        },
        {
          text: 'Status',
          value: 'isAdminActive',
        },
      ],
      color: Material,
    }
  },
  created() {
    this.fetchRecords(this.filter)
  },
  computed: {
    ...mapGetters(['getAccounts', 'getAccountOptions']),
  },
  watch: {
    '$route.query': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
      immediate: true,
    },
    'filter.email': {
      handler() {
        this.filter.page = 1
      },
    },
  },
  methods: {
    //
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, this.transformQuery(query))
      return filter
    },
    transformQuery(query) {
      const numbers = ['filter[email]', 'filter[isAdminActive]', 'page']
      for (let key in query) {
        if (numbers.includes(key)) {
          const val = query[key] ? parseInt(query[key]) : query[key]
          query[key] = val
        }
      }
      return query
    },
    resetFilter() {
      this.filter = {
        page: 1,
        'filter[email]': null,
        'filter[isAdminActive]': null,
      }
    },
    // filter
    handlePageChanged(page) {
      this.filter.page = page
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleStatusChange() {
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleResetFilter() {
      this.filter = {
        page: 1,
        'filter[email]': null,
        'filter[isAdminActive]': null,
      }
      this.$router.replace({
        path: this.$route.path,
      })
    },
    handleApplyFilter() {
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleClear() {
      this.resetFilter()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleFormSuccess() {
      this.showDialog = false
      this.fetchRecords()
    },
    fetchRecords(filters) {
      this.$store.dispatch('getAccounts', filters).catch(() => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Auth Failed',
          color: 'error',
        })
        this.loading = false
      })
    },
    getColor(status) {
      if (status === false) {
        return 'grey'
      } else return 'green'
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    updateStatus(item) {
      this.loading = true
      let msg = item.isAdminActive === false ? 'anable' : 'disable'
      if (confirm(`Are you sure to ${msg} accounts?`)) {
        this.$store.dispatch('setAccount', { id: item.id, isAdminActive: !item.isAdminActive || false })
        .then(() => {
          this.handleResetFilter();
          this.loading = false
        })
        .catch(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            show: true,
            text: 'Auth Failed',
            color: 'error',
          })
          this.loading = false
        })
      }
    },
  },
}
</script>
