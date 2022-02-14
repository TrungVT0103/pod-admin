import ApiService from '@/common/api.service'

const state = {
  category: [],
  posts: [],
  oneCategory: {},
  onePost: {},
  postGroups: [],
  currentPostGroup: {},
}

const getters = {
  getCategories: state => state.category,
  getPosts: state => state.posts,
  oneCategory: state => state.oneCategory,
  onePost: state => state.onePost,
  getPostGroups: state => state.postGroups,
  getCurrentPostGroup: state => state.currentPostGroup,
}
const actions = {
  // Category
  getAllCategory({ commit }, filters) {
    return new Promise((resolve, reject) => {
      ApiService.get('/helpbase/categories', '', filters)
        .then(({ data }) => {
          commit('SET_CATEGORY', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  createOneCategory({ dispatch }, { group, data }) {
    return new Promise((resolve, reject) => {
      ApiService.post('/helpbase/categories?group=' + group, data)
        .then(async ({ data }) => {
          console.log(dispatch)
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  getOneCategory({ commit }, id) {
    return new Promise((resolve, reject) => {
      ApiService.get('/helpbase/categories/' + id)
        .then(({ data }) => {
          commit('SET_ONE_CATEGORY', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  updateOneCategory(commit, { group, data, id }) {
    return new Promise((resolve, reject) => {
      ApiService.put('/helpbase/categories/' + id + '?group=' + group, data)
        .then(() => {
          // dispatch('setMessage', { color: 'primary', dialog: true, content: 'susses' })
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          // dispatch('setMessage', { color: 'red', dialog: true, content: 'error' })
          return reject({ message: ex.message })
        })
    })
  },
  deleteOneCategory(context, filters) {
    return new Promise((resolve, reject) => {
      ApiService.delete('/helpbase/categories/'+ filters)
        .then(() => {
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  // Post
  getAllPost({ commit }, filters) {
    return new Promise((resolve, reject) => {
      ApiService.get('helpbase/articles', '', filters)
        .then(({ data }) => {
          commit('SET_ALL_POST', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  createOnePost({ dispatch }, { data, category }) {
    return new Promise((resolve, reject) => {
      ApiService.post(`helpbase/articles?category=` + category, data)
        .then(async ({ data }) => {
          console.log(dispatch)
          return resolve({ message: data['message'] || 'success' })
        })
        .catch(ex => {
          return reject(ex.message)
        })
    })
  },
  getOnePost({ commit }, id) {
    return new Promise((resolve, reject) => {
      ApiService.get('/helpbase/articles/' + id)
        .then(({ data }) => {
          commit('SET_ONE_POST', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  updateOnePost({ dispatch }, { data, category, id }) {
    return new Promise((resolve, reject) => {
      ApiService.put(`helpbase/articles/${id}?category=${category}`, data)
        .then(() => {
          dispatch('setMessage', { color: 'primary', dialog: true, content: 'susses' })
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          dispatch('setMessage', { color: 'red', dialog: true, content: 'error' })
          return reject({ message: ex.message })
        })
    })
  },
  deleteOnePost(context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`helpbase/articles/${id}`,)
        .then(() => {
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  getPostGroups({ commit }, filters) {
    return new Promise((resolve, reject) => {
      ApiService.get('/helpbase/groups', null, filters)
        .then(({ data }) => {
          // console.log('data', data);
          commit('SET_POST_GROUPS', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  getPostGroup({ commit }, id) {
    return new Promise((resolve, reject) => {
      ApiService.get('/helpbase/groups/' + id)
        .then(({ data }) => {
          commit('SET_CURRENT_POST_GROUP', data)
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  deletePostGroup({ dispatch }, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete('/helpbase/groups/' + id)
        .then(() => {
          dispatch('getPostGroups')
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  createPostGroup({ dispatch }, postGroup) {
    return new Promise((resolve, reject) => {
      ApiService.post('/helpbase/groups', postGroup)
        .then(() => {
          dispatch('getPostGroups')
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
  updatePostGroup({ dispatch }, postGroup) {
    return new Promise((resolve, reject) => {
      console.log(postGroup)
      ApiService.put('/helpbase/groups/' + postGroup.id, postGroup.groups)
        .then(() => {
          dispatch('getPostGroups')
          return resolve({ message: 'success' })
        })
        .catch(ex => {
          return reject({ message: ex.message })
        })
    })
  },
}
const mutations = {
  SET_CATEGORY(state, data) {
    state.category = data || []
  },
  SET_ONE_CATEGORY(state, data) {
    state.oneCategory = data || []
  },
  SET_ALL_POST(state, data) {
    state.posts = data || []
  },
  SET_ONE_POST(state, data) {
    state.onePost = data || []
  },
  SET_POST_GROUPS(state, data) {
    state.postGroups = data || []
  },
  SET_CURRENT_POST_GROUP(state, data) {
    state.currentPostGroup = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
