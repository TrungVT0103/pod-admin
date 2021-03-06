import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
import store from '../store'
import vi from '@/locale/vi.json'
import en from '@/locale/en.json'
const translation = {
  // zh: zhHans,
  en: en,
  vi: vi,
}
const i18n = new VueI18n({
  locale: store.getters.getLocale, // set locale
  messages: translation, // set locale messages
})

store.commit('SET_TRANSLATION', translation)

export default i18n
