<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn @click="$router.push({ name: 'lattehub.template.create' })"
          ><v-icon>mdi mdi-plus</v-icon>Create Template</v-btn
        >
      </v-col>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="template" hide-default-footer>
          <template v-slot:[`item.title`]="{ item }">
            {{ item.title }}
          </template>
          <template v-slot:[`item.image`]="{ item }">
            {{ item.image }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <!-- {{ item.actions }} -->
            <v-btn @click="editTemplate(item._id)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn @click="openDeleteDialog"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-dialog v-model="onDeleteDialog" max-width="400">
        <v-card>
          <v-card-title>Are you sure you want to delete template?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="onDeleteDialog = false">Cancel</v-btn>
            <v-btn color="error" @click="deleteTemplate()">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
// import { mapGetter } from 'vuex'
export default {
  data() {
    return {
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Image', value: 'image' },
        { text: 'Actions', value: 'actions' },
      ],
      onDeleteDialog: false,
    }
  },
  computed: {
    // ...mapGetter(['template']),
  },
  methods: {
    editTemplate() {},
    deleteTemplate() {},
  },
}
</script>

<style></style>
