import ApiService from '@/common/api.service'

const state = {
}

const getters = {
}
const actions = {
  async getImage( context, filename) {
    console.log('filename', filename);
    return await ApiService.get(`/media/admin-presigned-url-upload?filename=${filename}`);
  }
}
const mutations = {
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
