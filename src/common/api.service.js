import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { getToken, getSystemDomain } from '@/common/jwt.service'

const ApiService = {
  init() {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = getSystemDomain()
  },

  setBaseURL(url) {
    Vue.axios.defaults.baseURL = url
  },

  setHeader(token = null) {
    Vue.axios.defaults.headers.common['x-access-token'] = `${token || getToken()}`
    Vue.axios.defaults.headers.common['storeId'] = `6108e532db1c052bf287acea`
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  get(resource, slug = '', params = {}) {
    ApiService.setHeader()
    if (slug) {
      return Vue.axios.get(`${resource}/${slug}`, { params: params }).catch(error => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
    } else {
      return Vue.axios.get(`${resource}`, { params: params }).catch(error => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
    }
  },

  post(resource, params) {
    ApiService.setHeader()
    return Vue.axios.post(`${resource}`, params)
  },

  update(resource, slug, params) {
    ApiService.setHeader()
    return Vue.axios.put(`${resource}/${slug}`, params)
  },

  put(resource, params) {
    ApiService.setHeader()
    return Vue.axios.put(`${resource}`, params)
  },

  delete(resource) {
    ApiService.setHeader()
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`)
    })
  },

  loadEnv(name) {
    return process.env[name];
  }
}

export default ApiService
