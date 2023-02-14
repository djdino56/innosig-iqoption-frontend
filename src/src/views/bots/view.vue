<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  <b-row class="match-height px-2">
    <b-col md="12">
      <bot-create-or-edit
          :is-edit="true"
          :obj-prop="obj"
      />
    </b-col>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              On Market
            </h4>
          </div>
          <div class="card-body">
            <p class="card-text">
              Here you can see the list of the current on market trades by our strategies.
            </p>
          </div>
          <hr>
          <bot-table
              status="on_market"
              :set-percentage-not-equals-null="false"
              :bot_id="id"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Trades
            </h4>
          </div>
          <div class="card-body">
            <p class="card-text">
              Here you can see the list of the current trades by our strategies.
            </p>
          </div>
          <hr>
          <bot-table
              status="open"
              :set-percentage-not-equals-null="true"
              :bot_id="id"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Latest 25 sells
            </h4>
          </div>
          <div class="card-body">
            <p class="card-text">
              Here you can see the list of the latest sell orders by your bot!
            </p>
          </div>
          <hr>
          <bot-table
              status="close"
              :set-percentage-not-equals-null="true"
              :bot_id="id"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Bot logs
            </h4>
          </div>
          <div class="card-body">
            <p class="card-text">
              Here you can see the list of the latest logs of your bot!
            </p>
          </div>
          <hr>
          <bot-logs :bot_id="id" />
        </div>
      </div>
    </div>
  </b-row>
  </Layout>
</template>

<script>
import {
  BRow, BCol
} from 'bootstrap-vue-3';
import BotLogs from '@/views/bots/components/logs';
import BotTable from '@/views/bots/components/trades';
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import BotViewModel from "@/models/viewmodels/bot";
import BotCreateOrEdit from "@/views/bots/components/add";
import appConfig from "../../../app.config.json";
import BondViewModel from "@/models/viewmodels/bond";

export default {
  name: 'Bot',
  components: {
    BotLogs, BotTable, Layout, PageHeader, BotCreateOrEdit, BRow, BCol
  },
  page: {
    title: "Bot",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {
      title: "Bot " + this.$route.params.id,
      items: [
        {
          text: "Bots",
          href: "/bots",
        },
        {
          text: "Bot",
          active: true,
        },
      ],
      id: this.$route.params.id,
      obj: new BotViewModel(),
      bond: new BondViewModel(),
      loading: true,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      BotViewModel.Get(this.id).then(response => {
        this.obj = new BotViewModel(response.data);
        BondViewModel.Get(this.obj.bond).then(response => {
          this.bond = new BondViewModel(response.data);
          this.loading = false
        });
      });
    }
  },
};
</script>

<style scoped>

</style>
