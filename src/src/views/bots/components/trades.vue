<template>
  <div class="trades container-fluid">
    <b-table
        :items="signals"
        :striped="true"
        class="mb-3"
        :responsive="true"
    >
      <template #cell(status)="row">
        <b-badge :variant="statusVariant(row.item.status)">
          {{ row.item.status }}
        </b-badge>
      </template>
      <template #cell(percentage)="row">
        <b-badge :variant="percentageVariant(row.item.percentage)">
          {{ row.item.percentage }}
        </b-badge>
      </template>
      <template #cell(actions)="">
        <a href="#">
          Delete
        </a>
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
</template>

<script>
import {
  BBadge, BPagination, BTable,
} from 'bootstrap-vue-3';
import TradeViewModel from '@/models/viewmodels/trade';
import TradeRepository from '@/models/repositories/trade';

export default {
  name: 'BotTable',
  components: {
    BPagination,
    BBadge,
    BTable,
  },
  props: {
    bot_id: { // current page
      type: String,
      required: true,
    },
    status: { // current page
      type: String,
      required: true,
    },
    setPercentageNotEqualsNull: { // current page
      type: Boolean,
      required: true,
      default: true,
    },
  },
  data() {
    return {
      page: 1,
      total: 0,
      perPage: 1,
      pageUrl: null,
      pageNumbers: [],
      loading: true,
      signals: [],
      startCapital: 500,
      singleTrade: 20,
      profitTrades: 0,
      lossTrades: 0,
      openTrades: 0,
      pnlTotal: 0,
      totalTrades: 0,
      max_results: 25,
    };
  },
  computed: {
    percentageVariant() {
      return percentage => ((percentage > 0) ? 'light-success' : 'light-danger');
    },
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        close: 'danger',
        close_on_market: 'warning',
        open: 'success',
        open_on_market: 'warning',
        /* eslint-enable key-spacing */
      };

      return status => statusColor[status];
    },
  },
  mounted() {
    this.setPageUrl();
    this.getAllTrades();
  },
  methods: {
    getStatus() {
      let _status = `["${this.status}"]`;
      if (this.status === 'on_market') {
        _status = '["open_on_market", "close_on_market"]';
      }
      return _status;
    },
    setPageUrl(page = 1) {
      this.page = page;
      this.pageUrl = `${TradeViewModel.ObjUrl({})}?page=${this.page}&sort=-_id&where={"bot_id":"${this.bot_id}","percentage":{"$ne":null},"status":{"$in":${this.getStatus()}}}`;
      if (this.setPercentageNotEqualsNull === false) {
        this.pageUrl = `${TradeViewModel.ObjUrl({})}?page=${this.page}&sort=-_id&where={"bot_id":"${this.bot_id}","status":{"$in":${this.getStatus()}}}`;
      }
    },
    getAllTrades() {
      this.loading = true;
      TradeViewModel.find_by_status_bot(this.page, this.getStatus(), this.setPercentageNotEqualsNull, this.bot_id).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new TradeRepository(res.data._items);
      }).then(trades => {
        this.processRepo(trades);
        this.loading = false;
      });
    },
    processPage(page) {
      this.setPageUrl(page);
      this.getAllTrades();
    },
    resetStats() {
      this.profitTrades = 0;
      this.lossTrades = 0;
      this.openTrades = 0;
      this.pnlTotal = 0;
      this.totalTrades = 0;
    },
    processRepo(_repo) {
      this.resetStats();
      this.signals = [];
      for (const trade of _repo.objsParsed) {
        this.totalTrades += 1;
        if (trade.status === 'close') {
          const capital = (this.singleTrade / 100) * this.startCapital;
          const _calculated = capital
              + (parseFloat(trade.percentage) / 100) * capital;
          this.pnlTotal = this.startCapital - capital + _calculated;
          if (trade.percentage > 0) {
            this.profitTrades += 1;
          } else {
            this.lossTrades += 1;
          }
        } else {
          this.totalTrades += 1;
          this.openTrades += 1;
        }
        const row = {
          market: trade.market,
          interval: trade.interval,
          open_price: trade.open_price,
          close_price: trade.close_price,
          status: trade.status,
          percentage: parseFloat(trade.percentage).toFixed(2),
          _created: trade._created,
          _updated: trade._updated,
          _closed_at: trade.status === 'close' ? trade._updated : '-',
        };
        this.signals.push(row);
      }
    },
  },
};
</script>
