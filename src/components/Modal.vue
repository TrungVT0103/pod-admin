<template>
  <div class="text-center modal">
    <v-dialog v-model="$parent[model]" :transition="transition" :width="width" :max-width="maxWidth">
      <v-card relative>
        <!-- Title -->
        <v-card-title class="headline " v-once>
          {{ title }}
        </v-card-title>

        <!-- Close icon -->
        <div class="close-icon" @click="$parent[model] = false">
          <v-icon>mdi-close</v-icon>
        </div>
        <v-divider class="mb-3"></v-divider>
        <!-- Content -->
        <v-card-text class="content-modal">
          <slot name="content"></slot>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Footer -->
        <v-card-actions v-if="showFooter">
          <v-spacer></v-spacer>
          <v-btn color="" @click="$parent[model] = false">
            Close
          </v-btn>
          <v-btn :disabled="isLoading" :loading="isLoading" color="primary" @click="submit">
            {{ titleButton }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    /*
     String props model
    */
    model: {
      type: String,
      default: '',
    },
    /*
     Width dialog
    */
    width: {
      type: String,
      default: '500',
    },
    /*
     Max width dialog
    */
    maxWidth: {
      type: String,
      default: '',
    },
    /*
     transition:
      fab-transition,
      fade-transition,
      expand-transition,
      scale-transition,
      scroll-x-transition,
      scroll-x-reverse-transition,
      scroll-y-transition,
      scroll-y-reverse-transition,
      slide-x-transition,
      slide-x-reverse-transition,
      slide-y-transition,
      slide-y-reverse-transition,
    */
    transition: {
      type: String,
      default: 'scale-transition',
    },
    /*
     Show Footer
    */
    showFooter: {
      type: Boolean,
      default: true,
    },
    /*
     Title dialog
    */
    title: {
      type: String,
      default: '',
    },
    /*
     Title submit button
    */
    titleButton: {
      type: String,
      default: 'OK',
    },
    /**
     * Callback
     */
    callback: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    /*
     fnc submit and close
    */
    clearDisable() {
      this.$parent.turnOffBtn = false;
    },
    submit() {
      this.callback(this.$el);
      // console.log(this.$el);
      this.$parent.turnOffBtn = true;
      setTimeout(this.clearDisable, 1000);
    },
  },
};
</script>

<style>
.close-icon {
  position: absolute;
  top: 16px;
  right: 10px;
  cursor: pointer;
}

.content-modal {
  max-height: 700px;
  overflow-y: auto;
}
</style>