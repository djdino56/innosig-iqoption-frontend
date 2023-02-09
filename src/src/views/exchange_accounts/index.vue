<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  <b-row class="match-height px-2">
    <b-col md="12">
      <b-col
          v-if="objects.length <= 0"
          md="6"
          class="px-auto mx-auto text-center"
      >
        <blockquote class="blockquote custom-blockquote blockquote-outline blockquote-secondary rounded mb-0 mt-3">
          <p class="text-dark mb-2">You don't have any exchange accounts</p>
          <footer class="blockquote-footer mt-0">Tip: create a exchange account by clicking the button below</footer>
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
          v-if="objects.length >= 1"
          class="exchange-account-wrapper"
      >
        <b-row class="px-2">
          <b-col
              md="12"
              class="py-2"
          >
            <!-- modal login button -->
            <b-button
                class="mt-3"
                variant="outline-primary"
                v-b-modal.modal-create
            >
              Create
            </b-button>
          </b-col>
        </b-row>
        <b-table
            :items="modifiedObjects"
            :striped="true"
            class="mb-3"
            :responsive="true"
        >
          <template #cell(status)="row">
            {{ row.item.status }}
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
            class="pagination-lg mt-1 mb-1 justify-content-center"
            @change="processPage"
        />
      </div>
      <!-- modal login-->
      <b-modal
          class="v-modal-custom"
          size="lg"
          id="modal-create"
          ref="exchange-account-create"
          v-model="modalShow"
          cancel-variant="outline-secondary"
          centered
          title="Create new exchange account"
          hide-footer
      >
        <exchange-account-add
            @exit="closeModal"
            @created="addObj"
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
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import ExchangeAccountAdd from "@/views/exchange_accounts/components/add";
import ExchangeAccountViewModel from '@/models/viewmodels/exchange_account';
import ExchangeAccountRepository from '@/models/repositories/exchnage_account';
import Swal from "sweetalert2";
import appConfig from "../../../app.config.json";
import {AlertTriangleIcon} from "@zhuowenli/vue-feather-icons";

export default {
  page: {
    title: "Exchange Accounts",
    meta: [{ name: "description", content: appConfig.description }],
  },
  name: 'Exchange Accounts',
  components: {
    Layout,
    PageHeader,
    BCol,
    BRow,
    BPagination,
    BTable,
    BButton,
    BModal,
    ExchangeAccountAdd,
    AlertTriangleIcon
  },
  props: {
  },
  data() {
    return {
      title: "Exchange Accounts",
      items: [
        {
          text: "Exchange Accounts",
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
      ExchangeAccountViewModel.all(this.page).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new ExchangeAccountRepository(res.data._items);
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
          status: _m.status,
          exchange_api: _m.exchange_api,
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

<style scoped>

</style>
