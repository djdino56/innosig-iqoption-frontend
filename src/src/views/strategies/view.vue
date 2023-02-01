<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  <section class="strategy-details">
    <!-- Alert: No item found -->
    <b-alert
        variant="danger"
        :show="strategy === null"
    >
      <h4 class="alert-heading">
        Error fetching strategy data
      </h4>
      <div class="alert-body">
        No strategy found with this item slug. Check
        <b-link
            class="alert-link"
            :to="{ name: 'strategies'}"
        >
          Strategies
        </b-link>
        for other items.
      </div>
    </b-alert>

    <!-- Content -->
    <b-row>
      <b-col md="12">
        <strategy-create-or-edit
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
import StrategyCreateOrEdit from "@/views/strategies/components/add";
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import StrategyViewModel from '@/models/viewmodels/strategy';
/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    Layout,
    PageHeader,
    StrategyCreateOrEdit,
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
      title: "Strategy",
      items: [
        {
          text: "Strategy",
          active: true,
        },
      ],
      id: this.$route.params.id,
      obj: new StrategyViewModel(),
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      StrategyViewModel.Get(this.id).then(response => {
        this.obj = new StrategyViewModel(response.data);
      });
    }
  },
};
</script>