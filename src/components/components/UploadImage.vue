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
          <!-- Cho 4 loại jpg png gif jpeg  -->
          <v-card-text v-if="image && image.imageSrc != '' && typeUpload == 'image'" class="d-flex justify-center">
            <v-img
              :lazy-src="imageHelpers.url(image.imageSrc, { width: width, height: height })"
              max-height="300"
              max-width="300"
              :src="imageHelpers.url(image.imageSrc, { width: width, height: height })"
              alt=""
              srcset=""
            ></v-img>
          </v-card-text>
          <v-card-text class="" v-if="image && image.imageSrc == '' && typeUpload == 'image'">
            <v-btn class="w-100 py-16 mb-2" outlined width="100%" :height="height" color="" @click="uploadFile">
              <v-icon></v-icon>
              Upload image here
            </v-btn>
            <input
              class="hidden"
              type="file"
              ref="inputImage"
              accept="image/gif, image/jpeg, image/png , image/jpg"
              @change="onChangeImage"
            />
          </v-card-text>
          <!-- Cho tất cả các loại -->
          <v-card-text v-if="image && image.src != '' && typeUpload != 'image'" class="d-flex justify-center">
            <v-img
              v-if="checkFileType(image.src)"
              :lazy-src="imageHelpers.url(image.src, { width: width, height: height })"
              max-height="300"
              max-width="300"
              :src="imageHelpers.url(image.src, { width: width, height: height })"
              alt=""
              srcset=""
            ></v-img>
            <div v-else>{{ image.src }}</div>
          </v-card-text>
          <v-card-text class="" v-if="image && image.src == '' && typeUpload != 'image' && !isLoading">
            <v-btn class="w-100 py-16 mb-2" outlined width="100%" :height="height" color="" @click="uploadFile">
              <v-icon></v-icon>
              Upload image here
            </v-btn>
            <input class="hidden" type="file" ref="inputImage" accept="*" @change="onChangeImage" />
          </v-card-text>
          <v-card-text class="text-center" v-if="image && image.src == '' && typeUpload != 'image' && isLoading">
            <v-progress-circular class="ml-5" indeterminate color="primary" :value="50"></v-progress-circular>
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
    typeUpload: {
      type: String,
      default: 'image',
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
      isLoading: null, // quay quay khi load file pds mất nhiều tgian 
      imageHelpers: imageHelpers,
    }
  },
  methods: {
    checkFileType(file) { // để 4 loại file dưới thì hiện ảnh, khác thì hiện tên
      if (file) {
        if (file.includes('.png') || file.includes('.jpg') || file.includes('.jpeg') || file.includes('.gif')) {
          return true
        }
        return false
      }
    },
    async onChangeImage(e) {
      // let inputTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
      var _URL = window.URL || window.webkitURL
      let img = new Image()
      img.src = _URL.createObjectURL(e.target.files[0])
      let file = e.target.files[0]
      console.log(file)
      try {
        let type = file.name.split('.')[file.name.split('.').length - 1]
        console.log(type)
        let id = this.objectId()
        let resGetImage = await this.$store.dispatch('getImage', `lattehub-image-${id}.${type}`)
        if (resGetImage) {
          console.log(resGetImage)
          this.isLoading = true
          try {
            await axios.put(resGetImage.data.presignedUrl, file, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            this.isLoading = false
          } catch (e) {
            console.log(e)
            this.isLoading = false
          }
          let obj = {
            alt: file.name,
            alt_text: file.name,
            imageSrc: resGetImage.data.imagePath,
            _id: id,
          }
          console.log(obj)
          if (this.typeUpload === 'image') {
            // với 4 loại file ảnh
            this.$emit('callback', obj, this.itemSetData, 'image')
          } else {
            // với tất cả các loại
            this.$emit('callback', obj, this.itemSetData, '')
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    objectId() {
      return this.hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => this.hex(Math.random() * 16))
    },
    removeUpload() {
      // giống onChangeImage()
      if (this.typeUpload === 'image') {
        this.$emit('callbackDelete', this.itemSetData, 'image')
      } else {
        this.$emit('callbackDelete', this.itemSetData, '')
      }
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
