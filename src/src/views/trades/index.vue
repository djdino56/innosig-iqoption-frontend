<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <b-row class="match-height px-2">
      <b-col md="12">

        <b-col
            v-if="modifiedObjects.length <= 0"
            md="6"
            class="px-auto mx-auto text-center"
        >
          <blockquote class="blockquote custom-blockquote blockquote-outline blockquote-secondary rounded mb-0 mt-3">
            <p class="text-dark mb-2">No Trades found</p>
            <footer class="blockquote-footer mt-0">Tip: trades are system created objects</footer>
          </blockquote>

        </b-col>
        <div
            v-if="modifiedObjects.length >= 1"
            class="objects-wrapper"
        >
          <!-- Info Alert -->
          <b-alert show variant="secondary">
            <strong> Did you know? </strong> Trades are system-created models.
          </b-alert>

          <b-row class="px-2">
            <b-col
                md="12"
                class="py-2"
            >
            </b-col>
          </b-row>
          <b-table
              :foot-clone="true"
              :striped="true"
              :responsive="true"
              :items="modifiedObjects"
              class="mb-3"
          >
            <template #cell(bot_id)="row">
              <a :href="`/bots/${row.item.bot_id}`" target="_blank">
                {{ row.item.bot_id }}
              </a>
            </template>
            <template #cell(open_price)="row">
              <b-badge variant="secondary">
                {{ row.item.open_price }}
              </b-badge>
            </template>
            <template #cell(close_price)="row">
              <b-badge variant="info">
                {{ row.item.close_price }}
              </b-badge>
            </template>
            <template #cell(percentage)="row">
              <b-badge :variant="percentageVariant(row.item.percentage)">
                {{ row.item.percentage }}%
              </b-badge>
            </template>
            <template #cell(status)="row">
              <b-badge :variant="statusVariant(row.item.status)">
                {{ row.item.status }}
              </b-badge>
            </template>
          </b-table>
          <b-pagination
              v-model="page"
              :per-page="perPage"
              :total-rows="total"
              align="center"
              class="pagination-md mt-1 mb-5 justify-content-center"
              @update:modelValue="processPage"
          />
        </div>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import {
  BRow, BCol, BPagination, BTable, BAlert
} from 'bootstrap-vue-3';
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../app.config";
import TradeViewModel from "@/models/viewmodels/trade";
import TradeRepository from "@/models/repositories/trade";

export default {
  page: {
    title: "Trades",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {
      title: "Trades",
      items: [
        {
          text: "Trades",
          active: true,
        },
      ],
      page: 1,
      total: 0,
      perPage: 25,
      objects: [],
      modifiedObjects: [],
      loading: true,
    };
  },
  components: {
    Layout,
    PageHeader,
    BCol,
    BRow,
    BPagination,
    BTable,
    BAlert
  },
  props: {
    market: {
      type: String,
      default: 'all',
    },
  },
  computed: {
    listObjects() {
      return this.objects.objsParsed;
    },
    statusVariant() {
      return status => (status === "close" || status === "close_on_market") ? 'danger' : 'success';
    },
    percentageVariant() {
      return status => (status < 0) ? 'danger' : 'success';
    },
  },
  watch: {
    listObjects() {
      this.getTableData();
    },
  },
  mounted() {
    this.setPage();
    this.getAll();
  },
  methods: {
    processPage(page) {
      this.setPage(page);
      this.getAll();
    },
    setPage(page = 1) {
      this.page = page;
    },
    getAll() {
      this.loading = true;
      TradeViewModel.all(this.page).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new TradeRepository(res.data._items);
      }).then(objects => {
        this.objects = objects;
        this.loading = false;
      });
    },
    getTableData() {
      const _modified = this.objects.to.json()
      this.modifiedObjects = []
      for (const _m of _modified) {
        this.modifiedObjects.push({
          market: _m.market,
          interval: _m.interval,
          bot_id: _m.bot_id,
          open_price: _m.open_price,
          close_price: _m.close_price,
          percentage: _m.percentage,
          status: _m.status,
          last_updated: _m._updated,
        })
      }
    }
  },
};
</script>