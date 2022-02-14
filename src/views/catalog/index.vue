<template>
  <div class="mockups-page">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex justify-end align-center">
          <v-btn color="primary" @click="$router.push({ name: 'lattehub.catalog.create'})">
            <v-icon>mdi-plus</v-icon>Create Catalog
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-data-table
              v-if="!isLoading"
              :headers="headers"
              :items="catalogs"
              hide-default-footer
              item-key="name"
              class="elevation-1"
              :items-per-page="1000"
            >
              <template v-slot:[`item.imageSrc`]="{ item }">
                <v-img :src="imageHelpers.url(item.imageSrc, { width: 100, height: 100 })" :lazy-src="item.imageSrc" max-height="100" max-width="100"></v-img>
              </template>
              <template v-slot:[`item.template`]="{ item }">
                <v-icon color="primary" @click="$router.push({ name:'lattehub.template.create', params: {mockupId: item._id}})">mdi-plus</v-icon> <span color="primary" class="font-weight-bold blue--text">({{ item.templateCount }})</span>
              </template>
              <template v-slot:[`item.deleted`]="{ item }">
                <v-btn class="ma-2" outlined :color="getColor(item.deleted)">
                  {{ item.deleted === false ? 'Inactive' : 'Active' }}
                </v-btn>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="editCatalog(item)"
                  normal
                  class="mr-2"
                  color="primary"
                >
                  mdi-pencil
                </v-icon>
                <v-icon @click="openDialog(item)"
                  color="error"
                  normal
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-skeleton-loader
              v-else
              class="mx-auto"
              type="card"
            ></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          max-width="500"
        >
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to delete catalog?
            </v-card-title>
            <!-- <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-1"
                text
                @click="cancel"
              >
                Disagree
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="deleteCatalog"
              >
                Agree
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import imageHelpers from '@/helpers/image';
export default {
  name: 'catalog',
  data () {
    return {
      imageHelpers: imageHelpers,
      query: {
        page: 0,
        limit: 10,
      },
      isLoading: false,
      headers: [
        {
          text: 'Title',
          align: 'start',
          value: 'title',
          sortable: false
        },
        { text: 'Image', value: 'imageSrc', sortable: false, },
        { text: 'Price', value: 'price', sortable: false },
        { text: 'Deleted', value: 'deleted', sortable: false },
        { text: 'Template', value: 'template', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      dialog: false,
      idCatalog: '',
      desserts: [
        {
          title: 'Frozen Yogurt',
          imageSrc: 'https://pbimg.xpdcdn.com/phub/400x400_thumbnail@162676453660f674f847d00.jpg',
          price: 4.990,
          deleted: false
        }
      ],
    }
  },
  computed: {
    ...mapGetters(['catalogs']),
  },
  methods: {
    editCatalog (item) {
      this.$router.push({ name: 'lattehub.catalog.edit', params: {id: item._id}})
    },
    openDialog (item) {
      this.idCatalog = item._id;
      this.dialog = true;
    },
    getColor(status) {
      if (status) {
        return 'grey'
      } else return 'green'
    },
    cancel () {
      this.dialog = false;
      this.idCatalog = '';
    },
    async deleteCatalog () {
      await this.$store.dispatch('deleteCatalog', this.idCatalog);
      this.dialog = false;
      this.idCatalog = '';
      this.isLoading = true;
      await this.$store.dispatch('getCatalog');
      this.isLoading = false;
    }
  },
  async created () {
    this.isLoading = true;
    await this.$store.dispatch('getCatalog');
    this.isLoading = false;
  }
};
</script>

<style>

</style>