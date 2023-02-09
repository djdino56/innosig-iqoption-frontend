<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <b-row class="px-2">
      <b-col md="12">

        <b-col
            v-if="objects.length <= 0"
            md="6"
            class="px-auto mx-auto text-center"
        >
          <blockquote class="blockquote custom-blockquote blockquote-outline blockquote-secondary rounded mb-0 mt-3">
            <p class="text-dark mb-2">You don't have any bots</p>
            <footer class="blockquote-footer mt-0">Tip: create a bot by clicking the button below</footer>
          </blockquote>

          <b-button
              class="mt-3"
              variant="outline-primary"
              @click="modalShow = !modalShow"
          >
            Create
          </b-button>

        </b-col>
        <div
            v-if="objects.length >= 1"
            class="objects-wrapper"
        >
          <b-row class="px-2">
            <b-col
                md="12"
                class="py-2"
            >
              <b-button
                  class="float-end me-1"
                  variant="outline-primary"
                  @click="modalShow = !modalShow"
              >
                Create
              </b-button>
            </b-col>
          </b-row>
          <b-table
              :striped="true"
              :responsive="true"
              :items="modifiedObjects"
              class="vh-100 text-center mb-3" align-v="center"
          >
            <template #cell(name)="row">
              <a :href="`/bots/${objects.get_by_index(row.index)._id}`">
                {{ row.item.name }}
              </a>
            </template>
            <template #cell(strategy)="row">
              <a :href="`/strategies/${objects.get_by_index(row.index).strategy}`">
                {{ row.item.strategy }}
              </a>
            </template>
            <template #cell(practice_mode)="row">
              <i :class="boolVariant(row.item.practice_mode)" class="mdi"></i>
            </template>
            <template #cell(sell_by_tpst)="row">
              <i :class="boolVariant(row.item.sell_by_tpst)" class="mdi"></i>
            </template>
            <template #cell(sell_by_strategy)="row">
              <i :class="boolVariant(row.item.sell_by_strategy)" class="mdi"></i>
            </template>
            <template #cell(profit_at)="row">
              <b-badge :variant="integerVariant(row.item.profit_at)">
                {{ row.item.profit_at }}
              </b-badge>
            </template>
            <template #cell(stop_loss)="row">
              <b-badge :variant="integerVariant(row.item.stop_loss)">
                {{ row.item.stop_loss }}
              </b-badge>
            </template>
            <template #cell(percentage_per_trade)="row">
              <b-badge variant="secondary">
                {{ row.item.percentage_per_trade }}%
              </b-badge>
            </template>
            <template #cell(actions)="row">
              <b-button variant="outline-danger" class="btn-icon waves-effect waves-light" @click="deleteObj(row)"><AlertTriangleIcon /></b-button>
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
        <!-- modal login-->
        <b-modal
            class="v-modal-custom"
            size="lg"
            v-model="modalShow"
            centered
            title="Create new bot"
            hide-footer
        >
          <bot-add
              @created="addObj"
              @exit="closeModal"
          />
        </b-modal>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import {
  BRow, BCol, BPagination, BTable, BButton,
} from 'bootstrap-vue-3';
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../app.config";
import BotAdd from "@/views/bots/components/add";
import Swal from "sweetalert2";
import {AlertTriangleIcon} from "@zhuowenli/vue-feather-icons";
import BotRepository from "@/models/repositories/bot";
import BotViewModel from "@/models/viewmodels/bot";

export default {
  page: {
    title: "Bots",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {
      title: "Bots",
      items: [
        {
          text: "Bots",
          active: true,
        },
      ],
      page: 1,
      total: 0,
      perPage: 25,
      objects: [],
      modifiedObjects: [],
      loading: true,
      modalShow: false,
    };
  },
  components: {
    AlertTriangleIcon,
    BotAdd,
    Layout,
    PageHeader,
    BCol,
    BRow,
    BPagination,
    BTable,
    BButton
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
    integerVariant() {
      return status => (status < 0) ? 'danger' :  (status > 0) ? 'success' : 'secondary';
    },
    boolVariant() {
      return status => (status) ? 'icon-dual-success mdi-check-circle' :  'icon-dual-danger mdi-close-circle';
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
    closeModal() {
      this.modalShow = false;
    },
    addObj(obj) {
      this.objects.add([obj]);
      this.getTableData();
    },
    processPage(page) {
      this.setPage(page);
      this.getAll();
    },
    setPage(page = 1) {
      this.page = page;
    },
    getAll() {
      this.loading = true;
      BotViewModel.all(this.page).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new BotRepository(res.data._items);
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
          name: _m.name,
          strategy: _m.strategy,
          practice_mode: _m.practice_mode,
          max_positions_per_market: _m.max_positions_per_market,
          profit_at: _m.profit_at,
          stop_loss: _m.stop_loss,
          sell_by_strategy: _m.sell_by_strategy,
          sell_by_tpst: _m.sell_by_tpst,
          percentage_per_trade: _m.percentage_per_trade,
          actions: undefined,
        })
      }
    },
    deleteObj(row) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          const _obj = this.objects.get_by_index(row.index);
          _obj.delete().then(() => {
            this.objects.remove(_obj);
            this.getTableData();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Exchange account has been deleted.',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            });
          }).catch(error => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong.',
              text: 'Try again later!',
              customClass: {
                confirmButton: 'btn btn-danger',
              },
            });
          });
        }
      });
    },
  },
};
</script>