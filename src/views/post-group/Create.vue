<template>
  <div class="page-forms">
    <v-container>
      <v-row>
        <v-col :cols="12" :lg="12">
          <v-form>
            <div class="mb-4" tile v-for="item in model" :key="item.lang">
              <v-card>
                <v-card-title>Language: {{ item.lang }}</v-card-title>
                <v-divider />
                <v-card-text>
                  <v-text-field
                    v-model="item.title"
                    outlined
                    label="Title"
                    required
                    :append-icon="'mdi-account-check'"
                  />
                  <v-text-field
                    v-model="item.description"
                    outlined
                    label="Description"
                    required
                    :append-icon="'mdi-email'"
                  />
                </v-card-text>
              </v-card>
            </div>
            <div>
              <v-card>
                <v-card-actions>
                  <v-btn text @click="handleCancelForm">Cancel</v-btn>
                  <v-spacer />
                  <v-btn tile color="primary" @click="handleSubmitForm">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      model: [
        {
          lang: 'vi',
          title: '',
          description: '',
        },
        {
          lang: 'en',
          title: '',
          description: '',
        },
      ],
    }
  },
  methods: {
    handleCancelForm() {
      this.$router.go(-1)
    },
    handleSubmitForm() {
      this.loading = true
      this.$store
        .dispatch('createPostGroup', this.model)
        .then(() => {
          this.loading = false
          this.$router.push({ name: "ListPostGroup" })
        })
        .catch(err => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            show: true,
            text: err.message,
            color: 'error',
          })
          this.loading = false
        })
    },
  },
}
</script>
