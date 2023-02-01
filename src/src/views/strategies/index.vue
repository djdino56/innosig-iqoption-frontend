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
            <p class="text-dark mb-2">No Strategies found</p>
            <footer class="blockquote-footer mt-0">Tip: create a strategy by clicking the button below</footer>
          </blockquote>

          <b-button
              class="mt-3"
              variant="outline-primary"
              v-b-modal.modal-create
          >
            Create
          </b-button>

        </b-col>
        <div
            v-if="modifiedObjects.length >= 1"
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
                  v-b-modal.modal-create
              >
                Create
              </b-button>
            </b-col>
          </b-row>
          <b-row class="px-2">
            <b-col
                md="12"
                class="py-2"
            >
            </b-col>
          </b-row>
          <b-table
              :items="modifiedObjects"
          >
            <template #cell(name)="row">
              <a :href="`/strategies/${objects.get_by_index(row.index)._id}`">
                {{ row.item.name }}
              </a>
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
            size="lg"
            id="modal-create"
            ref="obj-create"
            v-model="modalShow"
            cancel-variant="outline-secondary"
            centered
            title="Create new strategy"
            hide-footer
        >
          <strategy-add
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
  BRow, BCol, BPagination, BTable, BButton, BModal,
} from 'bootstrap-vue-3';
import StrategyAdd from "@/views/strategies/components/add";
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../app.config";
import Swal from "sweetalert2";
import {AlertTriangleIcon} from "@zhuowenli/vue-feather-icons";
import StrategyViewModel from "@/models/viewmodels/strategy";
import StrategyRepository from "@/models/repositories/strategy";

export default {
  page: {
    title: "Strategies",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {
      title: "Strategies",
      items: [
        {
          text: "Strategies",
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
    Layout,
    PageHeader,
    BCol,
    BRow,
    BPagination,
    BTable,
    BButton,
    BModal,
    StrategyAdd
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
      StrategyViewModel.all(this.page).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new StrategyRepository(res.data._items);
      }).then(results => {
        this.objects = results;
        this.loading = false;
      });
    },
    getTableData() {
      const _modified = this.objects.to.json();
      this.modifiedObjects = [];
      for (const _m of _modified) {
        this.modifiedObjects.push({
          name: _m.name,
          interval: _m.interval.toString(),
          minimal_sell_signals: _m.minimal_sell_signals,
          minimal_buy_signals: _m.minimal_buy_signals,
          actions: undefined,
        });
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
              text: 'Request has been deleted.',
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