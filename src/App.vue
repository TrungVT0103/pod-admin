<template>
  <v-app dark>
    <router-view></router-view>
    <!-- theme setting -->
    <v-btn small fab dark fixed top="top" right="right" class="setting-fab" color="red" @click="openThemeSettings">
      <v-icon>mdi-silverware-variant</v-icon>
    </v-btn>
    <v-btn small fab dark fixed top="top" right="right" class="chat-fab" color="primary" @click="openOnlineUser">
      <v-icon>mdi-chat</v-icon>
    </v-btn>
    <!-- setting drawer -->
    <v-navigation-drawer v-model="rightDrawer" class="setting-drawer" temporary right hide-overlay fixed>
      <template v-if="showSetting">
        <theme-settings />
      </template>
      <template v-else>
        <online-user />
      </template>
    </v-navigation-drawer>
    <!-- global snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="3000" app top centered :color="snackbar.color">
      {{ snackbar.text }}
      <template #action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="$store.commit('HIDE_SNACKBAR')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-row>
      <v-col>
        <Message />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import ThemeSettings from '@/components/ThemeSettings'
import Message from '@/components/components/Message'
import OnlineUser from '@/components/OnlineUser'
import { mapGetters } from 'vuex'
import isAuthenticated from '@/mixins/isAuthenticated';

export default {
  components: {
    ThemeSettings,
    OnlineUser,
    Message
  },
  mixins: [isAuthenticated],
  data() {
    return {
      rightDrawer: false,
      showSetting: true,
    }
  },
  computed: {
    ...mapGetters(['getSnackbar']),
    snackbar: {
      get() {
        return this.getSnackbar
      },
      set(val) {
        this.$store.commit('UPDATE_SNACKBAR', val)
      },
    },
  },
  mounted() {
    if (typeof window !== undefined && window._VMA === undefined) {
      window._VMA = this
    }
  },
  created() {
    this.verifyToken();
  },
  methods: {
    openThemeSettings() {
      this.$vuetify.goTo(0)
      this.showSetting = true
      this.rightDrawer = !this.rightDrawer
    },
    openOnlineUser() {
      this.$vuetify.goTo(0)
      this.showSetting = false
      this.rightDrawer = !this.rightDrawer
    },
  },
}
</script>

<style lang="sass" scoped>
.setting-fab
  top: 50% !important
  right: 0
  border-radius: 0
.chat-fab
  top: calc(50% + 40px) !important
  right: 0
  border-radius: 0
</style>
<style lang="scss">
input{ 
  min-height: 20px !important;
}
</style>
