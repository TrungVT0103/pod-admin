import ApiService from '@/common/api.service'
const state = {
  color: [],
  current: {},
  options: {
    total: 500
  }
}

const getters = {
  getColor: state => state.color,
  // getCurrent: state => state.current,
  // getAccountOptions: state => state.options,
}
const actions = {
  getColor({ commit }, query = { type: 'color', page: 0, limit: 20 }) {
    return new Promise((resolve, reject) => {
      ApiService.get('/printhub/options', '', query)
        .then(({ data }) => {
          commit('SET_COLOR', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  setColor({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.put(`/printhub/options/${data.id}`, data.option)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  addColor({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.post(`/printhub/options`, data.option)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  deleteColor({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/printhub/options/${data}`)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
}

const mutations = {
  SET_COLOR(state, data) {
    state.color = data?.options || []
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