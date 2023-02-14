<template>
  <div class="bot-logs container-fluid">
    <b-table
        :items="logs"
        :striped="true"
        class="mb-3"
        :responsive="true"
    />
    <!--    <vue-advanced-table v-bind="tableConfig" class="mb-3"></vue-advanced-table>-->
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
import { BPagination, BTable } from 'bootstrap-vue-3';
import BotLogViewModel from '@/models/viewmodels/bot_log';
import BotLogRepository from '@/models/repositories/bot_log';

export default {
  name: 'BotLogs',
  components: {
    BPagination,
    BTable,
  },
  props: {
    bot_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      total: 0,
      perPage: 1,
      max_results: 25,
      searchTerm: '',
      pageUrl: null,
      pageNumbers: [],
      loading: true,
      logs: [],
    };
  },
  mounted() {
    this.setPage();
    this.getAll();
  },
  methods: {
    setPage(page = 1) {
      this.page = page;
    },
    getAll() {
      this.loading = true;
      BotLogViewModel.all(this.page, this.bot_id).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new BotLogRepository(res.data._items);
      }).then(objects => {
        this.processRepo(objects);
        this.loading = false;
      });
    },
    processPage(page) {
      this.setPage(page);
      this.getAll();
    },
    processRepo(_repo) {
      this.logs = [];
      for (const object of _repo.objsParsed) {
        const row = {
          level: object.level,
          message: object.message,
          _created: object._created,
        };
        this.logs.push(row);
      }
    },
  },
};
</script>
