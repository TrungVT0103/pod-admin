<template>
    <!-- <v-dialog v-model="$parent[model]" :width="width" :height="width" :max-width="maxWidth"> -->
      <v-card :width="width" :height="width">
        <v-card-title>{{ title }}</v-card-title>
        <!-- <div class="close-icon" @click="$parent[model] = false">
          <v-icon>mdi-close</v-icon>
        </div> -->
        <v-card-text>
          <v-img
            :src="imageHelpers.url(image, { width: width-50, height: width-50 })"
            :max-height="width-50"
            :max-width="width-50"
            class="mx-auto my-auto"
          ></v-img>
        </v-card-text>
      </v-card>
    <!-- </v-dialog> -->
</template>

<script>
import imageHelpers from '@/helpers/image'
export default {
  data() {
    return {
      imageHelpers: imageHelpers,
    };
  },
  props: {
    model: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '500',
    },
    maxWidth: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    imgWidth: {
      type: String,
      default: '',
    },
    imgHeight: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  }
}
</script>

<style lang="scss"></style>