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
            <p class="text-dark mb-2">No Bonds found</p>
            <footer class="blockquote-footer mt-0">Tip: create a bond by clicking the button below</footer>
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
                  @click="modalShow = !modalShow"
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
              <a :href="`/bonds/${objects.get_by_index(row.index)._id}`">
                {{ row.item.name }}
              </a>
            </template>
            <template #cell(enabled)="row">
              <i :class="boolVariant(row.item.enabled)" class="mdi"></i>
            </template>
            <template #cell(signal)="row">
              <b-badge :variant="statusVariant(row.item.signal)">
                {{ row.item.signal }}
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

        <!-- modal create-->
        <b-modal
            v-if="!loading"
            class="v-modal-custom"
            size="lg"
            v-model="modalShow"
            centered
            title="Create new strategy"
            hide-footer
        >
          <bond-add
              @created="addObj"
              @exit="closeModal"
              :generated-name="generateName"
          />
        </b-modal>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import {
  BRow, BCol, BPagination, BTable, BButton, BModal, BBadge
} from 'bootstrap-vue-3';
import BondAdd from "@/views/bonds/components/add";
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../app.config";
import Swal from "sweetalert2";
import {AlertTriangleIcon} from "@zhuowenli/vue-feather-icons";
import BondViewModel from "@/models/viewmodels/bond";
import BondRepository from "@/models/repositories/bond";

export default {
  page: {
    title: "Bonds",
    meta: [{ name: "description", content: appConfig.description }],
  },
  data() {
    return {
      title: "Bonds",
      items: [
        {
          text: "Bonds",
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
    BBadge,
    BondAdd
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
        "sell": 'danger',
        "strong sell": 'danger',
        "none": 'info',
        "buy": 'success',
        "strong buy": 'success',
        /* eslint-enable key-spacing */
      };
      return status => statusColor[status];
    },
    generateName: function() {
      return "Bond " + (this.total + 1)
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
      BondViewModel.all(this.page).then(res => {
        this.total = res.data._meta.total;
        this.perPage = res.data._meta.max_results;
        return new BondRepository(res.data._items);
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
          signal: _m.signal,
          enabled: _m.enabled,
          interval: _m.interval.toString(),
          _updated: _m._updated,
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