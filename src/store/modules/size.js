import ApiService from '@/common/api.service'
const state = {
  size: [],
  current: {},
  options: {
    total: 500,
  },
}

const getters = {
  getSize: state => state.size,
  // getCurrent: state => state.current,
  // getAccountOptions: state => state.options,
}
const actions = {
  getSize({ commit }, query = { type: 'size', page: 0, limit: 20 }) {
    return new Promise((resolve, reject) => {
      ApiService.get('/printhub/options', '', query)
        .then(({ data }) => {
          commit('SET_SIZE', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  setSize({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.put(`/printhub/options/${data.id}`, data.option)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  addSize({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.post(`/printhub/options`, data.option)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  deleteSize({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/printhub/options/${data}`)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
}

const mutations = {
  SET_SIZE(state, data) {
    state.size = data?.options || []
    // state.options.total = data.total || 500
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
