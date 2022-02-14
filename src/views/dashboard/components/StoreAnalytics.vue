<template>
  <v-card tile title="Analysis - Pie">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">
          TOTAL
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ getTotalStore }}
        </v-list-item-title>
        <v-list-item-subtitle>Stores has been created in Lattehub Platform </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <e-chart
        v-if="getHistogram.length"
        :path-option="[
          ['color', [color.lightBlue.base, color.red.base]],
          ['dataset.source', getHistogram],
          ['series[0].type', 'bar'],
          ['series[1].type', 'bar'],
        ]"
        height="350px"
        width="100%"
      />
      <!-- <e-chart 
        v-if="getTotalStore"
        :path-option="[
          ['dataset.source', getStoreAnalytics],
          ['color', [color.lightBlue.base, color.pink.base, color.green.base, color.cyan.base, color.teal.base]],
          ['legend.orient', 'horizontal'],
          ['legend.y', 'bottom'],
          ['xAxis.show', false],
          ['yAxis.show', false],
          ['series[0].type', 'pie'],
          ['series[0].radius', ['30%', '70%']],
          [
            'series[0].itemStyle',
            {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
          ],
        ]"
        height="350px"
        width="100%"
      ></e-chart> -->
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Material from 'vuetify/es5/util/colors'
import EChart from '@/components/chart/echart'

export default {
  data: () => ({
    color: Material,
    loading: false,
  }),
  created() {
    this.$store.dispatch('storeHistogram').catch(() => {
      window._VMA.$emit('SHOW_SNACKBAR', {
        show: true,
        text: 'Auth Failed',
        color: 'error',
      })
      this.loading = false
    })
  },
  components: {
    EChart,
  },
  computed: {
    ...mapGetters(['getTotalStore', 'getActiveStore', 'getInactiveStore', 'getStoreAnalytics', 'getHistogram']),
  },
}
</script>

<style></style>
