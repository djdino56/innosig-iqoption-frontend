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
            <h5 class="font-size-14 mb-1 mt-0">indicators</h5>
            <div class="p-0">
              <Multiselect class="form-control"
                           v-model="objModel.indicators"
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
              <pre class="language-json"><code>{{ objModel.indicators }}</code></pre>
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
            <h5 class="font-size-14 mb-5 mt-0">minimal_buy_signals</h5>
            <div class="p-3">
              <Slider v-model="objModel.minimal_buy_signals" :min="0" :max="10"/>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-5 mt-0">minimal_sell_signals</h5>
            <div class="p-3">
              <Slider v-model="objModel.minimal_sell_signals" :min="0" :max="10"/>
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
import Slider from "@vueform/slider";
import Swal from "sweetalert2";
import StrategyViewModel from "@/models/viewmodels/strategy";
import IndicatorViewModel from "@/models/viewmodels/indicator";

export default {
  name: 'Bot',
  components: {
    BForm, BButton, Slider, BCard, BCol, BRow, Multiselect
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    objProp: {
      type: StrategyViewModel,
      default: () => {
        return new StrategyViewModel()
      }
    },
    generatedName: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      objModel: new StrategyViewModel(),
      isLoadingSelect: false,
      selected: null,
      createColumns: ['name', 'indicators', 'minimal_buy_signals', 'minimal_sell_signals', 'enabled'],
      updateColumns: ['name', 'indicators', 'minimal_buy_signals', 'minimal_sell_signals', 'enabled'],
    };
  },
  mounted() {
    if (this.generatedName !== "") {
      this.objModel.name = this.generatedName;
    }
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
      const response = await IndicatorViewModel.search(query)
      return response.data._items.map((item) => {
        return { value: item["_id"], label: item["endpoint"] }
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
