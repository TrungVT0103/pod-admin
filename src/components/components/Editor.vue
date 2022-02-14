<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <label class="mb-1 fz-14 color" style="font-weight: 600">
      {{ 'Description' }}
    </label>
    <!-- các option của init nằm trong Configuration reference Tiny doc -->
    <editor
      api-key="cp1okc1v5mgid311kk2qxto3hn01wllmxcduuffi34b50rwr"
      v-model="html"
      :init="{
        toolbar_mode: 'wrap',
        toolbar_sticky: true,
        selector: 'textarea',
        menubar: false,
        // color_cols: 8,
        plugins:
          'autoresize print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap quickbars emoticons advtable code',

        toolbar:
          'bold italic underline strikethrough  | alignleft aligncenter alignright alignjustify |  image media   link anchor  |outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | fontselect fontsizeselect formatselect code',
        max_height: height,
        min_height: minHeight,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        /* without images_upload_url set, Upload tab won't show up*/
        /* we override default upload handler to simulate successful upload*/
        browser_spellcheck: true,
        // fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px'
        images_upload_handler: example_image_upload_handler
      }"
      @onSelectionChange="handlerFunction"
    />
  </div>
</template>

<script>
import axios from 'axios'
import imageHelpers from '@/helpers/image'
import Editor from '@tinymce/tinymce-vue'
// function example_image_upload_handler() {
//   console.log('abd');
// }
export default {
  props: {
    model: {
      type: String,
      default: 'bodyHtml',
    },
    height: {
      type: Number,
      default: null,
    },
    minHeight: {
      type: Number,
      default: 500,
    },
    itemSetData: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: null,
    },
  },
  components: {
    editor: Editor,
  },
  data() {
    return {
      html: '',
      imageHelpers,
    }
  },
  methods: {
    handlerFunction() {
      this.$emit('callback', this.itemSetData, this.html)
    },
    objectId() {
      return this.hex(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => this.hex(Math.random() * 16))
    },
    hex(value) {
      return Math.floor(value).toString(16)
    },
    async onChangeImage(e) {
      let size = { width: 0, height: 0 }
      let inputTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg']
      var _URL = window.URL || window.webkitURL

      let img = new Image()
      // var objectUrl = _URL.createObjectURL(e);
      img.onload = function () {
        size.width = this.width
        size.height = this.height
      }
      img.src = _URL.createObjectURL(e)
      if (inputTypes.includes(e.type)) {
        let file = e
        try {
          let type = file.name.split('.')[file.name.split('.').length - 1]
          let id = this.objectId()
          let urlData = await this.$store.dispatch('getImage', `lattehub-image-${id}.${type}`)
          if (urlData) {
            await axios.put(urlData.data.presignedUrl, file, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            let obj = {
              alt: file.name,
              alt_text: file.name,
              src: urlData.data.imagePath,
              _id: id,
              size: size,
            }
            return obj
            // this.$emit('callback', obj, this.itemSetData);
          }
        } catch (error) {
          console.log('error', error)
          this.$store.commit('setMessages', {
            messages: 'Error image ',
            type: 'error',
          })
        }
      } else {
        alert('Type not support')
      }
    },
    async example_image_upload_handler(blobInfo, success) {
      // console.log(`blobInfo`, blobInfo)
      // console.log(`blobInfo.blob()`, blobInfo.blob())

      let urlImage = await this.onChangeImage(blobInfo.blob())
      if (urlImage) success(this.imageHelpers.url(urlImage.src, { width: 1000, height: 1000 }))
    },
  },
  created() {
    if (this.type === 'size') {
      // console.log(`this.itemSetData`,this.itemSetData);
      this.html = this.itemSetData.description.$model
      // console.log(`this.html`,this.html);
    } else {
      this.html = this.itemSetData.description
    }
  },
}
</script>
<style lang="scss">
.tox-button--naked {
  .tox-icon.tox-tbtn__icon-wrap {
    display: none;
  }
}
.tox-editor-header {
  top: 60px !important;
}
.color {
  color: rgba(0, 0, 0, 0.87);
}
</style>
