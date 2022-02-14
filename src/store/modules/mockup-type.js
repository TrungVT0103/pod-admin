import ApiService from '@/common/api.service'
const state = {
  mockup: [],
  current: {},
  options: {
    total: 500,
  },
}

const getters = {
  getMockup: state => state.mockup,
  // getCurrent: state => state.current,
  // getAccountOptions: state => state.options,
}
const actions = {
  getMockup({ commit }) {
    return new Promise((resolve, reject) => {
      ApiService.get('/printhub/mockup-types')
        .then(({ data }) => {
          commit('SET_MOCKUP', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  setMockup({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.put(`/printhub/mockup-types/${data.id}`, data.option)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  addMockup({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.post(`/printhub/mockup-types`, data.option)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  deleteMockup({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/printhub/mockup-types/${data}`)
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
  SET_MOCKUP(state, data) {
    state.mockup = data?.mockupTypes || []
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
