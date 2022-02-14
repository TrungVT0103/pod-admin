import request from '@/util/request'
import colors from 'vuetify/es5/util/colors'
import ApiService from '@/common/api.service'
import { BASE_LOGIN_URL, BASE_URL_URL } from '@/common/config'

const randomColor = () => {
  const temp = Object.keys(colors)
  const key = temp[Math.floor(Math.random() * temp.length)]
  const color = colors[key].base
  return color
}

const state = {
  access_token: null,
  refresh_token: null,
  expires_in: 3600,
  token_type: 'bearer',
  username: 'admin',
  avatar: null,
  userColor: '#2196f3',
  status: 'online',
  systemDomain: null,
}
const getters = {
  getAccessToken: state => {
    return state.access_token
  },
  getAvatar: state => state.avatar,

  getUsername: state => state.username,
  getUserStatus: state => state.status,
}
const actions = {
  login({ commit }, cridentials) {
    return new Promise((resolve, reject) => {
      ApiService.setBaseURL(BASE_LOGIN_URL)
      ApiService.post('/auth/login', cridentials)
        .then(({ data }) => {
          const accessToken = data.accessToken
          const refreshToken = data.refreshToken
          commit('SET_LOGIN', { access_token: accessToken, refresh_token: refreshToken })
          return resolve({ message: 'success' })
          // ApiService.setHeader(accessToken)
          // ApiService.get('/users/stores')
          //   .then(({ data }) => {
          //     commit('SET_DEFAULT_STORE', data)
          //     return resolve({ message: 'success' })
          //   })
          //   .catch(ex => {
          //     console.log(ex)
          //     return reject({ message: 'Auth Failed' })
          //   })
        })
        .catch(ex => {
          console.log(ex)
          return reject({ message: 'Auth Failed' })
        })
    })
  },
  register({ commit, dispatch }, data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data: data,
    }).then(resp => {
      commit('SET_LOGIN', resp)
      dispatch('fetchProfile')
      return resp
    })
  },
  logout({ commit, dispatch }) {
    dispatch('closeSocket')
    commit('SET_ACCESS_TOKEN', null)
  },
  // get current login user info

  fetchProfile({ commit }) {
    return request({
      url: '/me',
      method: 'get',
    }).then(resp => {
      commit('SET_LOGIN_PROFILE', resp.data)
      return resp
    })
  },
}
// function loadEnv() {
//   return process.env.ACCOUNT_API_BASE_URL
// }
const mutations = {
  SET_LOGIN(state, { access_token, expires_in, refresh_token }) {
    state.systemDomain = BASE_URL_URL
    ApiService.setBaseURL(BASE_URL_URL)
    state.access_token = access_token
    state.expires_in = expires_in
    state.refresh_token = refresh_token
  },
  SET_DEFAULT_STORE(state, stores) {
    for (const store of stores) {
      if (store && store?.storeDetail?.defaultSystemDomain) {
        state.systemDomain = `https://${store.storeDetail.defaultSystemDomain}/api`
        ApiService.setBaseURL(`https://${store.storeDetail.defaultSystemDomain}/api`)
        return
      }
    }
  },
  SET_ACCESS_TOKEN(state, token) {
    state.access_token = token
  },
  SET_LOGIN_PROFILE(state, payload) {
    state.username = payload.username
    state.avatar = payload.avatar
    state.color = randomColor()
  },
  UPDATE_SELF_STATUS(state, status) {
    state.status = status
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
