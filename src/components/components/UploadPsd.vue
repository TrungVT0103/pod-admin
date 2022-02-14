<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="subtitle-1 font-weight-bold d-flex align-center justify-space-between">
            <div>
              {{ title }} <span class="body-1">{{ subTitle }}</span>
            </div>
            <v-btn @click="removeUpload" class="ma-2" outlined small>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text v-if="image && image.src" class="d-flex justify-center">
            <v-img
              v-if="image.src.includes('png') || image.src.includes('jpg')"
              :lazy-src="imageHelpers.url(image.src, { width: width, height: height })"
              max-height="300"
              max-width="300"
              :src="imageHelpers.url(image.src, { width: width, height: height })"
              alt=""
              srcset=""
            ></v-img>
            <div v-else>{{ image.src }}</div>
          </v-card-text>
          <v-card-text class="" v-else>
            <v-btn class="w-100 py-16 mb-2" outlined width="100%" :height="height" color="" @click="uploadFile">
              <v-icon></v-icon>
              Upload file here
            </v-btn>
            <input
              class="hidden"
              type="file"
              ref="inputImage"
              accept="*"
              @change="onChangeImage"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import imageHelpers from '@/helpers/image'
export default {
  props: {
    subTitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Image',
    },
    image: {
      type: Object,
      default: () => {},
    },
    itemSetData: {
      type: Object,
      default: () => {},
    },
    height: {
      type: String,
      default: '300',
    },
    width: {
      type: String,
      default: '300',
    },
  },
  data() {
    return {
      // image: {},
      imageHelpers: imageHelpers,
    }
  },
  methods: {
    async onChangeImage(e) {
      // let inputTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
      var _URL = window.URL || window.webkitURL
      let img = new Image()
      img.src = _URL.createObjectURL(e.target.files[0])
      let file = e.target.files[0]
      try {
        let type = file.name.split('.')[file.name.split('.').length - 1]
        console.log(type)
        let id = this.objectId()
        let resGetImage = await this.$store.dispatch('getImage', `lattehub-image-${id}.${type}`)
        if (resGetImage) {
          await axios.put(resGetImage.data.presignedUrl, file, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          let obj = {
            alt: file.name,
            alt_text: file.name,
            imageSrc: resGetImage.data.imagePath,
            _id: id,
          }
          console.log(obj)
          this.$emit('callback1', obj, this.itemSetData, 'upload');
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    objectId() {
      return this.hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => this.hex(Math.random() * 16))
    },
    removeUpload() {
      // this.image = {};
      this.$emit('callback1', {}, this.itemSetData, '');
    },
    hex(value) {
      return Math.floor(value).toString(16)
    },
    uploadFile() {
      this.$refs.inputImage.click()
    },
  },
  watch: {},
}
</script>

<style></style>
