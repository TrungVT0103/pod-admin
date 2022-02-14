

const state = {
  color:  'primary',
  dialog: false,
  content: ''
}

const getters = {
  color: (state) => state.color,
  dialog: (state) => state.dialog,
  content: (state) => state.content,
  message: (state) => {
    let message = { color: state.color, dialog: state.dialog, content: state.content};
    return message;
  },
}
const actions = {
  setMessage({ commit }, data) {
    commit('setColor', data.color);
    commit('setDialog', data.dialog);
    commit('setContent', data.content);
    setTimeout(() => {
      commit('setDialog', false);
    }, 1000);
  }
}
const mutations = {
  setColor(state, color) {
    state.color = color;
  },
  setDialog(state, dialog) {
    state.dialog = dialog;
  },
  setContent(state, content) {
    state.content = content;
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
