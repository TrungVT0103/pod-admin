import ApiService from '@/common/api.service'

const state = {
  totalStore: 0,
  activeStores: 0,
  inActiveStores: 0,
  totalProduct: 0,
  getTotalOrder: 0,
  converionRate: 0,
  aoi: 0,
  aov: 0,
  storeDetail: [],
  options: {
    totalItems: 1,
    itemsPerPage: 50,
    totalPages: 1
  },
  histogram: [],
}

const getters = {
  getTotalStore: state => state.totalStore,
  getTotalProduct: state => state.totalProduct,
  getTotalOrder: state => state.getTotalOrder,
  getAov: state => state.aov.toFixed(2),
  getAoi: state => state.aoi.toFixed(2),
  getConversionRate: state => state.converionRate.toFixed(2),
  getStoreDetail: state => state.storeDetail,
  getReportOptions: state => state.options,
  getStoreAnalytics: state => {
    return [
      {
        value: state.activeStores,
        name: 'Activated',
      },
      {
        value: state.inActiveStores,
        name: 'Inactivated',
      },
    ]
  },
  getHistogram: state => state.histogram,
}
const actions = {
  storeReport({ commit }, query = {}) {
    return new Promise((resolve, reject) => {
      ApiService.get('/report/system/store', '', query)
        .then(({ data }) => {
          commit('SET_STORE_REPORT', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  storeDetailReport({ commit }, query = {}) {
    return new Promise((resolve, reject) => {
      ApiService.get('/report/system/store-detail', '', query)
        .then(({ data }) => {
          commit('SET_STORE_DETAIL', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  storeHistogram({ commit }, query = {}) {
    return new Promise((resolve, reject) => {
      ApiService.get('/report/system/store-histogram', '', query)
        .then(({ data }) => {
          console.log(data)
          commit('SET_STORE_HISTOGRAM', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  downloadReport({ dispatch }, query = {}) {
    return new Promise((resolve, reject) => {
      ApiService.get('/report/system/export', '', query)
        .then(({ data }) => {
          dispatch('setMessage', { color: 'green', content: 'Success' })
          return resolve({ message: 'success', data: data })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
}
const mutations = {
  SET_STORE_REPORT(state, data) {
    state.totalStore = data?.total_store || 0
    state.totalProduct = data?.total_product || 0
    state.getTotalOrder = data?.total_order || 0
    state.converionRate = data?.conversion_rate || 0
    state.aoi = data?.aoi || 0
    state.aov = data?.aov || 0
    state.totalSales = data?.total_sale || 0
    state.activeStores = data?.active_stores || 0
    state.inActiveStores = data?.total_store - data?.active_stores || 0
  },
  SET_STORE_DETAIL(state, data) {
    state.options.totalItems = data?.hits?.total?.value
    state.options.totalPages = parseInt(data?.hits?.total?.value / state.options.itemsPerPage) + 1
    state.storeDetail = data?.hits?.hits
  },
  SET_STORE_HISTOGRAM(state, data) {
    state.histogram = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
