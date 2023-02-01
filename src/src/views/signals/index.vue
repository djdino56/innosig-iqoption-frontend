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
            <p class="text-dark mb-2">No signals found</p>
            <footer class="blockquote-footer mt-0">Tip: signals are system created objects</footer>
          </blockquote>

        </b-col>
        <div
            v-if="modifiedObjects.length >= 1"
            class="objects-wrapper"
        >
          <!-- Info Alert -->
          <b-alert show variant="secondary">
            <strong> Did you know? </strong> Signals are system-created models.
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
            <template #cell(signals)="row">
              <div
                  v-for="(signal_value, index) in row.item.signals"
                  :key="index"
                  class="pop-overs"
              >
                <b-button
                    :id="`popover-button-${row.item.market}-${row.item.interval}-${index}`"
                    variant="outline-secondary"
                >
                  {{ signal_value.strategy }}: <b-badge :variant="statusVariant(signal_value.value)">
                  {{ signal_value.value }}
                </b-badge>
                </b-button>

                <b-popover
                    :target="`popover-button-${row.item.market}-${row.item.interval}-${index}`"
                    variant="dark"
                    triggers="focus"
                    placement="top"
                >
                  <template #title>
                    <span>{{ signal_value.strategy }}</span>
                  </template>
                  <b-card
                      no-body
                  >
                    <b-list-group flush>
                      <b-list-group-item
                          v-for="(signal_value_results_item, signal_value_results_key, signal_value_results_index) in signal_value.results"
                          :key="`${signal_value_results_item}-${signal_value_results_key}-${signal_value_results_index}`"
                      >
                        {{ signal_value_results_item.name }}: <b-badge :variant="statusVariant(signal_value_results_item.result)">
                        {{ signal_value_results_item.result }}
                      </b-badge>
                      </b-list-group-item>
                    </b-list-group>
                  </b-card>
                </b-popover>
              </div>
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
  BRow, BCol, BPagination, BTable, BButton, BBadge, BPopover, BListGroup, BListGroupItem, BCard
} from 'bootstrap-vue-3';
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../app.config";
import SignalViewModel from "@/models/viewmodels/signal";
import SignalRepository from "@/models/repositories/sginal";

export default {
  page: {
    title: "Signals",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {
      title: "Signals",
      items: [
        {
          text: "Signals",
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
    BRow,
    BCol,
    BPagination,
    BTable,
    BButton,
    BBadge,
    BListGroup,
    BListGroupItem,
    BPopover,
    BCard,
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
      const statusColor = {
        /* eslint-disable key-spacing */
        none: 'secondary',
        sell: 'danger',
        buy: 'success',
        /* eslint-enable key-spacing */
      };

      return status => statusColor[status];
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
      SignalViewModel.all(this.page).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new SignalRepository(res.data._items);
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
          signals: _m.signals,
          _updated: _m._updated
        })
      }
    }
  },
};
</script>