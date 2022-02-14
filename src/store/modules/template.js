import ApiService from '@/common/api.service'

const state = {
  oneTemplate: {},
}

const getters = {
  oneTemplates: (state) => state.oneTemplate,
}
const actions = {
  getOneTemplate({ commit }, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/printhub/templates/${data}`)
      // ApiService.get(`/printhub/mockups/${data.mockup}/templates`)
        .then(async ({ data }) => {
          console.log('data', data);
          commit('SET_ONETEMPLATE', data.template);
          return resolve({ message: data['message'] || "success" })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  updateTemplate(context, data) { 
    return new Promise((resolve, reject) => {
      ApiService.put(`/printhub/templates/${data.templateId}`, {template: {...data.template}})
        .then(() => {
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  deleteTemplate( context, data) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/printhub/templates/${data}`)
        .then(() => {
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
}
const mutations = {
  SET_ONETEMPLATE(state, data) {
    state.oneTemplate = Object.assign({}, data) || null
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
