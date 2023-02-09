<template>
  <b-card class="mt-2">
    <b-form @submit="createOrUpdateObj(isEdit)">
      <b-row class="g-3">
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">name</h5>
            <div class="p-0">
              <input type="text" class="form-control" v-model="objModel.name" required>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">signal</h5>
            <div class="p-0">
              <input type="text" class="form-control" v-model="objModel.signal" disabled>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">strategies</h5>
            <div class="p-0">
              <Multiselect class="form-control"
                           v-model="objModel.strategies"
                           mode="tags"
                           :close-on-select="false"
                           :filter-results="false"
                           :min-chars="1"
                           :resolve-on-load="false"
                           :delay="0"
                           :searchable="true"
                           :options="async function(query) {
                              return await asyncFind(query) // check JS block for implementation
                            }"
              />
              <pre class="language-json"><code>{{ objModel.strategies }}</code></pre>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">enabled</h5>
            <div class="p-0">
              <div class="form-check form-switch form-switch-md" dir="ltr">
                <input type="checkbox" class="form-check-input" v-model="objModel.enabled">
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">interval</h5>
            <div class="p-0">
              <Multiselect class="form-control"
                           v-model="objModel.interval"
                           :close-on-select="true"
                           :searchable="true"
                           :create-option="false"
                           mode="tags"
                           :options="[
                        { value: '1m', label: '1 M' },
                        { value: '5m', label: '5 M' },
                        { value: '15m', label: '15m' },
                        { value: '30m', label: '30m' },
                        { value: '1h', label: '1h' },
                        { value: '2h', label: '2h' },
                        { value: '4h', label: '4h' },
                      ]"/>
            </div>
          </div>
        </b-col>
        <b-col md="12">
          <b-button
              type="submit"
              variant="primary"
              class="mb-3 float-end"
          >
            Submit
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import {
  BForm, BButton, BCard, BCol, BRow
} from 'bootstrap-vue-3';
import Swal from "sweetalert2";
import BondViewModel from "@/models/viewmodels/bond";
import StrategyViewModel from "@/models/viewmodels/strategy";

export default {
  name: 'Bot',
  components: {
    BForm, BButton, BCard, BCol, BRow, Multiselect
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    objProp: {
      type: BondViewModel,
      default: () => {
        return new BondViewModel()
      }
    },
  },
  data() {
    return {
      objModel: new BondViewModel(),
      isLoadingSelect: false,
      selected: null,
      createColumns: ['name', 'strategies', 'interval', 'signal', 'enabled'],
      updateColumns: ['name', 'strategies', 'interval', 'signal', 'enabled'],
    };
  },
  watch: {
    objProp: function () { // watch it
      // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.init();
    }
  },
  methods: {
    init() {
      if (this.isEdit) {
        this.objModel = this.objProp;
      }
    },
    asyncFind: async (query) => {
      if (query === "") {
        return [];
      }
      const response = await StrategyViewModel.search(query)
      return response.data._items.map((item) => {
        return { value: item["_id"], label: item["name"] }
      });
    },
    createOrUpdateObj(update = false) {
      if (update === false) {
        // this.scanRequestModel.status = 0;
        this.objModel.create(this.createColumns).then(response => {
          if (response.data._status === 'OK') {
            this.objModel._etag = response.data._etag;
            this.objModel._updated = response.data._updated;
            this.objModel._created = response.data._updated;
            this.objModel._id = response.data._id;
            this.$emit('exit', true);
            this.$emit('created', this.objModel);
            Swal.fire({
              icon: 'success',
              title: 'Created!',
              text: 'Strategy has been created.',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            });
          }
        }).catch(error => {
          console.log(error);
        });
      } else {
        // this.scanRequestModel.status = 0;
        this.objModel.update(this.updateColumns).then(response => {
          if (response.data._status === 'OK') {
            this.objModel._etag = response.data._etag;
            this.objModel._updated = response.data._updated;
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: 'Strategy has been updated.',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            });
          }
        }).catch(error => {
          console.log(error);
        });
      }
    },
  },
};
</script>
