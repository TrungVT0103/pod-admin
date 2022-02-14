<template>
  <v-dialog
    v-model="dialog"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      :color="message.color"
      dark
    >
      <v-card-text>
        {{ message.content }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['message', 'dialog'])
  },
  watch: {}
}
</script>

<style>

</style>