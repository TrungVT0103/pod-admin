import ApiService from '@/common/api.service'

const state = {
  catalogs: [],
  catalog: {},
  totalTemplates: 0,
  templates: [],
}

const getters = {
  catalogs: (state) => state.catalogs,
  templates: (state) => state.templates,
  totalTemplates: (state) => state.totalTemplates,
  catalogEdit: (state) => state.catalog,
}
const actions = {
  createTemplate({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.post(`/printhub/mockups/${data.mockup}/templates`, {template: {...data}})
      // ApiService.get(`/printhub/mockups/${data.mockup}/templates`)
        .then(async ({ data }) => {
          console.log(dispatch);
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  getTemplate({ commit }, data ) {
    return new Promise((resolve, reject) => {
      console.log(data);
      // ApiService.get(`/printhub/mockups/${data.id}/templates`)
      ApiService.get(`/printhub/mockups/${data.id}/templates`, '', { page: data.page, limit: data.limit })
        .then(async ({ data }) => {
          console.log('data', data);
          commit('SET_TEMPLATE', data.templates);
          commit('SET_TOTAL_TEMPLATE', data.paging.total);
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  getCatalog({ commit}) {
    return new Promise((resolve, reject) => {
      ApiService.get('/printhub/mockups?page=0&limit=1000')
        .then(({ data }) => {
          console.log('data', data);
          commit('SET_CATALOGS', data.mockups)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  getCatalogId({ commit}, id) {
    return new Promise((resolve, reject) => {
      ApiService.get('/printhub/mockups/' + id)
        .then(({ data }) => {
          // console.log('data', data);
          commit('SET_CATALOG', data.mockup)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  updateCatalog({ dispatch}, data) { 
    return new Promise((resolve, reject) => {
      ApiService.put('printhub/mockups/' + data.id, {mockup: data.data})
        .then(() => {
          dispatch('setMessage', {color: 'primary', dialog: true, content: 'susses'})
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          dispatch('setMessage', {color: 'red', dialog: true, content: 'error'})
          return reject({ message: ex.message })
        })
    })
  },
  deleteCatalog( context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete('printhub/mockups/' + id)
        .then(() => {
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  createCatalog( { dispatch }, data) {
    return new Promise((resolve, reject) => {
      ApiService.post('printhub/mockups', {mockup: data})
        .then(() => {
          dispatch('setMessage', {color: 'primary', dialog: true, content: 'susses'})
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          dispatch('setMessage', {color: 'red', dialog: true, content: 'error'})
          return reject({ message: ex.message })
        })
    })
  }
}
const mutations = {
  SET_CATALOGS(state, data) {
    state.catalogs = data || [];
    console.log('test', state.catalogs)
  },
  SET_CATALOG(state, data) {
    state.catalog = data || null
  },
  SET_TEMPLATE(state, data) {
    state.templates = data || null
  },
  SET_TOTAL_TEMPLATE(state, data) {
    state.totalTemplates = data || null
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
