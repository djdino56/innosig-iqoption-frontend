<template>
  <b-card class="mt-2">
    <b-form @submit="createOrUpdateObj(isEdit)">
      <b-row class="g-3">
        <b-col md="12">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">json to import</h5>
            <div class="p-0">
              <b-alert
                  variant="danger"
                  :show="showError"
              >
                <div class="alert-body">
                  Import JSON is not valid or multiple strategies found
                </div>
              </b-alert>

              <b-form-textarea
                  id="textarea"
                  v-model="importText"
                  placeholder="Enter json..."
                  rows="10"
                  max-rows="10"
              ></b-form-textarea>

              <pre class="mt-3 mb-0">{{ importText }}</pre>
            </div>
          </div>
        </b-col>


        <b-col md="12">
          <b-button
              type="submit"
              variant="primary"
              class="mb-3 float-end"
          >
            Import
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import "@vueform/multiselect/themes/default.css";
import {
  BForm, BButton, BCard, BCol, BRow, BFormTextarea
} from 'bootstrap-vue-3';
import Swal from "sweetalert2";
import StrategyViewModel from "@/models/viewmodels/strategy";
import IndicatorViewModel from "@/models/viewmodels/indicator";
import IndicatorRepository from "@/models/repositories/indicator";

export default {
  name: 'Bot',
  components: {
    BForm, BButton, BCard, BCol, BRow, BFormTextarea
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
  },
  data() {
    return {
      importText: '',
      objModel: new StrategyViewModel(),
      isLoadingSelect: false,
      showError: false,
      selected: null,
      createColumns: ['name', 'indicators', 'minimal_buy_signals', 'minimal_sell_signals', 'enabled'],
      updateColumns: ['name', 'indicators', 'minimal_buy_signals', 'minimal_sell_signals', 'enabled'],
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
    isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    async createOrUpdateObj(update = false) {
      if (update === false) {
        if (this.isJsonString(this.importText)) {
          this.showError = false;
          var parsedText = JSON.parse(this.importText);
        } else {
          this.showError = true;
        }
        this.objModel.name = parsedText.name;
        this.objModel.strategy_key = parsedText.strategy_key;
        this.objModel.enabled = parsedText.enabled;
        this.objModel.minimal_sell_signals = parsedText.minimal_sell_signals;
        this.objModel.minimal_buy_signals = parsedText.minimal_buy_signals;
        for (let indicator of parsedText.indicators) {
          let endpoint = indicator["endpoint"]
          const response = await IndicatorViewModel.findByEndpoint(endpoint);
          let items = response.data._meta["total"];
          if (items >= 2 || items === 0) {
            this.showError = true;
          }
          let indicators = new IndicatorRepository(response.data._items);
          this.objModel.indicators.push(indicators.last["_id"]);
        }
        if (!this.showError) {
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
        }
      }
    },
  },
};
</script>
