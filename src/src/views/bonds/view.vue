<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  <section class="bond-details">
    <!-- Alert: No item found -->
    <b-alert
        variant="danger"
        :show="obj === null"
    >
      <h4 class="alert-heading">
        Error fetching strategy data
      </h4>
      <div class="alert-body">
        No bond found with this item slug. Check
        <b-link
            class="alert-link"
            :to="{ name: 'bonds'}"
        >
          Bonds
        </b-link>
        for other items.
      </div>
    </b-alert>

    <!-- Content -->
    <b-row>
      <b-col md="12">
        <bond-create-or-edit
            :is-edit="true"
            :obj-prop="obj"
        />
      </b-col>
    </b-row>
  </section>
  </Layout>
</template>

<script>
import {
  BAlert, BLink, BRow, BCol
} from 'bootstrap-vue-3';
import BondCreateOrEdit from "@/views/bonds/components/add";
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import BondViewModel from '@/models/viewmodels/bond';
/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    Layout,
    PageHeader,
    BondCreateOrEdit,
  },
  props: {
    json: {
      type: Object,
      default: null,
    },
    editPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "Bond",
      items: [
        {
          text: "Bond",
          active: true,
        },
      ],
      id: this.$route.params.id,
      obj: new BondViewModel(),
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      BondViewModel.Get(this.id).then(response => {
        this.obj = new BondViewModel(response.data);
      });
    }
  },
};
</script>