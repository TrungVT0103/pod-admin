<template>
  <div class="page-forms">
    <v-container>
      <v-row>
        <v-col :cols="12" :lg="12">
          <v-form>
            <div class="mb-4" tile v-for="item in getCurrentPostGroup" :key="item.lang">
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
import { mapGetters } from 'vuex'
export default {
  created() {
    this.loading = true
    let params = this.$route.params
    this.$store
      .dispatch('getPostGroup', params.id)
      .then(() => {
        this.loading = false
        // this.$router.push({ name: "ListPostGroup" })
      })
      .catch(() => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Auth Failed',
          color: 'error',
        })
        this.loading = false
      })
  },
  computed: {
    ...mapGetters(['getLocale', 'getCurrentPostGroup']),
  },
  methods: {
    handleCancelForm() {
      this.$router.push({ name: 'ListPostGroup' })
    },
    handleSubmitForm() {
      this.loading = true
      let params = this.$route.params
      this.$store
        .dispatch('updatePostGroup', {
          id: params.id,
          groups: this.getCurrentPostGroup,
        })
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'ListPostGroup' })
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
