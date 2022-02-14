import ApiService from '@/common/api.service'

const state = {
  accounts: [],
  current: {},
  options: {
    total: 500
  }
}

const getters = {
  getAccounts: state => state.accounts,
  getCurrent: state => state.current,
  getAccountOptions: state => state.options,
}
const actions = {
  getAccounts({ commit }, query = {}) {
    return new Promise((resolve, reject) => {
      ApiService.get('/report/accounts', '', query)
        .then(({ data }) => {
          commit('SET_ACCOUNTS', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  setAccount({ dispatch }, account = {}) {
    return new Promise((resolve, reject) => {
      ApiService.put(`/report/accounts/${account.id}`, account)
        .then(async ({ data }) => {
          await dispatch('getAccounts', {})
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
}
const mutations = {
  SET_ACCOUNTS(state, data) {
    state.accounts = data?.data || []
    state.options.total = data.total || 500
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
