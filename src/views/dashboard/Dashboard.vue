<template>
  <div class="page-dashboard">
    <v-container>
      <v-row>
        <!-- mini statistic  end -->
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card icon="mdi-tag-multiple" :title="`${getTotalProduct}`" sub-title="Total products" color="indigo" />
        </v-col>
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card icon="mdi-cart-check" :title="`${getTotalOrder}`" sub-title="Total orders" color="red" />
        </v-col>
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card
            icon="mdi-chart-line-variant"
            :title="`${getConversionRate * 100}%`"
            sub-title="Conversion Rate"
            color="light-blue"
          />
        </v-col>
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card icon="mdi-chart-scatter-plot" :title="`${getAoi}/$${getAov}`" sub-title="AOI/AOV" color="purple" />
        </v-col>
        <v-col :cols="12" lg="12" :sm="12">
          <StoreAnalytics />
        </v-col>
        <v-col :lg="12" :sm="12" :cols="12">
          <DetailTable />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Material from 'vuetify/es5/util/colors'
import MiniStatisticCard from '@/components/card/MiniStatisticCard'
import { StackData, SinData, monthVisitData, campaignData, locationData } from '@/api/chart'
import { mapGetters } from 'vuex'
import StoreAnalytics from './components/StoreAnalytics'
import DetailTable from './components/DetailTable'

export default {
  name: 'PageDashboard',
  components: {
    StoreAnalytics,
    DetailTable,
    MiniStatisticCard,
  },
  data: () => ({
    color: Material,
    selectedTab: 'tab-1',
    linearTrending: [
      {
        subheading: 'Sales',
        headline: '2,55',
        caption: 'increase',
        percent: 15,
        icon: {
          label: 'mdi-trending-up',
          color: 'success',
        },
        linear: {
          value: 15,
          color: 'success',
        },
      },
      {
        subheading: 'Revenue',
        headline: '6,553',
        caption: 'increase',
        percent: 10,
        icon: {
          label: 'mdi-trending-down',
          color: 'error',
        },
        linear: {
          value: 15,
          color: 'error',
        },
      },
      {
        subheading: 'Orders',
        headline: '5,00',
        caption: 'increase',
        percent: 50,
        icon: {
          label: 'mdi-arrow-up',
          color: 'info',
        },
        linear: {
          value: 50,
          color: 'info',
        },
      },
    ],
    trending: [
      {
        subheading: 'Email',
        headline: '15+',
        caption: 'email opens',
        percent: 15,
        icon: {
          label: 'mdi-email-open',
          color: 'info',
        },
        linear: {
          value: 15,
          color: 'info',
        },
      },
      {
        subheading: 'Tasks',
        headline: '90%',
        caption: 'tasks completed.',
        percent: 90,
        icon: {
          label: 'mdi-view-list',
          color: 'primary',
        },
        linear: {
          value: 90,
          color: 'success',
        },
      },
      {
        subheading: 'Issues',
        headline: '100%',
        caption: 'issues fixed.',
        percent: 100,
        icon: {
          label: 'mdi-bug',
          color: 'primary',
        },
        linear: {
          value: 100,
          color: 'error',
        },
      },
    ],
    dataset: {
      sinData: SinData,
      monthVisit: monthVisitData,
      campaign: campaignData,
      location: locationData,
      stackData: StackData,
    },
  }),
  computed: {
    ...mapGetters([
      'getTotalOrder',
      'getTotalProduct',
      'getAoi',
      'getAov',
      'getConversionRate',
      'getTotalStore',
      'getConverionRate'
    ]),
  },
  created() {
    this.loading = true
    this.$store.dispatch('storeReport')
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
