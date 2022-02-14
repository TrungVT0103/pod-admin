<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card tile>
          <v-toolbar flat>
            <v-text-field
              v-model="filter['search']"
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
                    v-model="filter['store_id']"
                    :items="getStoreDetail"
                    item-text="_source.store_domain"
                    item-value="_source.store_id"
                    label="Store"
                  />
                </v-col>
                <v-col :cols="4">
                  <v-autocomplete
                    v-model="filter['is_active']"
                    :items="status"
                    label="Status"
                    item-text="key"
                    item-value="value"
                    @change="handleStatusChange"
                  />
                </v-col>
                <v-col :cols="4" class="mt-auto mb-auto">
                  <DateRangePicker :handler="pickedDate" :timezone="'America/Los_Angeles'" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn tile color="success" @click="handleDownload">
                Export
                <v-icon right dark>
                  mdi-download
                </v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="handleResetFilter">Reset</v-btn>
              <v-btn tile color="primary" @click="handleApplyFilter">Apply</v-btn>
            </v-card-actions>
          </v-card>

          <!-- :server-items-length="getReportOptions.totalItems" -->
          <!-- :footer-props="footerProps" -->
          <v-card-text class="pa-0">
            <v-data-table
              :loading="loadingItems"
              :headers="headers"
              :items="getStoreDetail"
              :items-per-page="50"
              :hide-default-footer="true"
              :page.sync="filter['page']"
              item-key="id"
              @update:page="handlePageChanged"
            >
              <template slot="body.prepend">
                <tr class="grey lighten-2">
                  <th>Summary</th>
                  <th>{{ sumField('total_product') }}</th>
                  <th>{{ sumField('total_order') }}</th>
                  <th>{{ sumField('total_sale') }}</th>
                  <th>{{ avgField('conversion_rate') }}%</th>
                  <th>{{ avgField('aoi') }}</th>
                  <th>{{ avgField('aov') }}</th>
                  <th></th>
                </tr>
              </template>
              <template v-slot:[`item._source.total_sale`]="{ item }">
                {{ `$${item._source.total_sale}` }}
              </template>
              <template v-slot:[`item._source.conversion_rate`]="{ item }">
                {{ `${item._source.conversion_rate}%` }}
              </template>
              <template v-slot:[`item._source.aov`]="{ item }">
                {{ `$${item._source.aov}` }}
              </template>
              <template v-slot:[`item._source.is_active`]="{ item }">
                <v-chip class="ma-2" :color="getColor(item._source.is_active)" label outlined>
                  {{ item._source.is_active ? 'Active' : 'Inactive' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-text class="text-center">
            <v-pagination
              v-model="filter.page"
              :length="getReportOptions.totalPages"
              :total-visible="7"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" scrollable width="840">
      <task-form :item="selectedItem" @form:success="handleFormSuccess" />
    </v-dialog>
  </div>
</template>

<script>
import * as moment from 'moment-timezone'
import TooltipMixin from '@/mixins/Tooltip'
import TaskForm from '@/components/form/TaskForm'
import { mapGetters } from 'vuex'
import { StackData, SinData, monthVisitData, campaignData, locationData } from '@/api/chart'
import Material from 'vuetify/es5/util/colors'
import DateRangePicker from './DateRangePicker'

export default {
  components: {
    TaskForm,
    DateRangePicker,
  },
  mixins: [TooltipMixin],
  data() {
    return {
      showDialog: false,
      search: '',
      loadingItems: false,
      selectedItem: null,
      serverItemsLength: 0,
      showFilter: true,
      status: [
        {
          key: 'Active',
          value: '1',
        },
        {
          key: 'Inactive',
          value: '0',
        },
      ],
      filter: {
        page: 1,
        search: null,
        store_id: null,
        is_active: null,
        from: null,
        to: null,
      },
      footerProps: {
        itemsPerPageOptions: [20, 50, 100],
      },
      headers: [
        {
          text: 'Store',
          value: '_source.store_domain',
        },
        {
          text: 'Total products',
          value: '_source.total_product',
        },
        {
          text: 'Total orders',
          value: '_source.total_order',
        },
        {
          text: 'Total sales',
          value: '_source.total_sale',
        },
        {
          text: 'CR',
          value: '_source.conversion_rate',
        },
        {
          text: 'AOI',
          value: '_source.aoi',
          width: 100,
        },
        {
          text: 'AOV',
          value: '_source.aov',
        },
        {
          text: 'Status',
          value: '_source.is_active',
        },
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
      dataset: {
        sinData: SinData,
        monthVisit: monthVisitData,
        campaign: campaignData,
        location: locationData,
        stackData: StackData,
      },
      color: Material,
    }
  },
  created() {
    // this.fetchRecords(this.filter)
  },
  computed: {
    ...mapGetters(['getReportOptions', 'getStoreDetail']),
  },
  watch: {
    '$route.query': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
      immediate: true,
    },
    'filter.search': {
      handler() {
        this.filter.page = 1
      },
    },
    'filter.page': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
    },
  },
  methods: {
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, this.transformQuery(query))
      return filter
    },
    transformQuery(query) {
      const numbers = ['filter[project_id]', 'filter[is_active]', 'page']
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
        'filter[name]': null,
        'filter[project_id]': null,
        'filter[is_active]': null,
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
        'filter[name]': null,
        'filter[is_active]': null,
      }
      this.$router.replace({
        path: this.$route.path,
      })
    },
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
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
      this.loadingItems = true
      this.$store
        .dispatch('storeDetailReport', filters)
        .then(() => {
          this.loadingItems = false
        })
        .catch(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            show: true,
            text: 'Auth Failed',
            color: 'error',
          })
          this.loadingItems = false
          this.loading = false
        })
    },
    getColor(status) {
      if (status) {
        return 'green'
      } else return 'grey'
    },
    handleDownload() {
      this.$store
        .dispatch('downloadReport', this.filter)
        .then(data => {
          var aLink = document.createElement('a')
          aLink.download = 'export.csv'
          aLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data.data)
          var event = new MouseEvent('click')
          aLink.dispatchEvent(event)
        })
        .catch(error => {
          console.log(error)
        })
    },
    pickedDate({ startDate, endDate }) {
      this.filter.from = moment(startDate).format('YYYY-MM-DD HH:mm:ss')
      this.filter.to = moment(endDate).format('YYYY-MM-DD HH:mm:ss')
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    momentToDate(time) {
      let date = new Date(time.format('YYYY-MM-DDTHH:mm:ss.sss'))
      return date
    },
    sumField(key) {
      let sum = this.getStoreDetail.reduce((a, b) => a + (parseFloat(b['_source'][key]) || 0), 0);
      return (sum % 1 == 0 ? parseInt(sum) : sum.toFixed(2)) || 0;
    },
    avgField(key) {
      let sum = this.getStoreDetail.reduce((a, b) => a + (parseFloat(b['_source'][key]) || 0), 0);
      let length = this.getStoreDetail.reduce((a, b) => {
        if (parseFloat(b['_source'][key]) > 0) {
          a += 1;
        }
        return a;
      }, 0);
      let avg = sum / length;
      return avg ? avg.toFixed(2) : 0;
    },
  },
}
</script>
