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
            <h5 class="font-size-14 mb-1 mt-0">strategy</h5>
            <div class="p-0">
              <Multiselect class="form-control"
                           v-model="objModel.strategy"
                           :options="async function(query) {
                              return await asyncFindStrategy(query) // check JS block for implementation
                            }"
                           mode="single"
                           :searchable="true"
                           :delay="0"
              />
              <pre class="language-json"><code>{{ objModel.strategy }}</code></pre>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">account</h5>
            <div class="p-0">
              <Multiselect class="form-control"
                           v-model="objModel.exchange_account_id"
                           :options="async function(query) {
                              return await asyncFindAccount(query) // check JS block for implementation
                            }"
                           mode="single"
                           :clear-on-select="false"
                           :searchable="true"
                           :delay="0"
              />
              <pre class="language-json"><code>{{ objModel.exchange_account_id }}</code></pre>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">coins</h5>
            <div class="p-0">
              <Multiselect class="form-control"
                           v-model="objModel.coins"
                           :close-on-select="true"
                           :searchable="true"
                           :create-option="false"
                           mode="tags"
                           :options="[
                        // { value: '', label: 'Select coins' },
                        { value: 'ETH-EUR', label: 'ETH-EUR (bitvavo)' },
                        { value: 'ADA-EUR', label: 'ADA-EUR (bitvavo)' },
                        { value: 'XRP-EUR', label: 'XRP-EUR (bitvavo)' },
                        { value: 'BTC-EUR', label: 'BTC-EUR (bitvavo)' },
                        { value: 'BTCUSDT', label: 'BTCUSDT (binance)' },
                        { value: 'EURUSD', label: 'EURUSD (iqoption)' },
                        { value: 'IDXUSD', label: 'IDXUSD (iqoption)' },
                        { value: 'SPY', label: 'SPY (iqoption)' },
                      ]" />
              <pre class="language-json"><code>{{ objModel.coins }}</code></pre>
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
            <h5 class="font-size-14 mb-1 mt-0">practice_mode</h5>
            <div class="p-0">
              <div class="form-check form-switch form-switch-md" dir="ltr">
                <input type="checkbox" class="form-check-input" v-model="objModel.practice_mode">
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">buy_enabled</h5>
            <div class="p-0">
              <div class="form-check form-switch form-switch-md" dir="ltr">
                <input type="checkbox" class="form-check-input" v-model="objModel.buy_enabled">
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">sell_enabled</h5>
            <div class="p-0">
              <div class="form-check form-switch form-switch-md" dir="ltr">
                <input type="checkbox" class="form-check-input" v-model="objModel.sell_enabled">
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-5 mt-0">profit_at</h5>
            <div class="p-3">
              <Slider v-model="objModel.profit_at" :min="0" :max="10"/>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-5 mt-0">stop_loss</h5>
            <div class="p-3">
              <Slider v-model="objModel.stop_loss" :min="-10" :max="0"/>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">sell_by_tpst</h5>
            <div class="p-0">
              <div class="form-check form-switch form-switch-md" dir="ltr">
                <input type="checkbox" class="form-check-input" v-model="objModel.sell_by_tpst">
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">sell_by_strategy</h5>
            <div class="p-0">
              <div class="form-check form-switch form-switch-md" dir="ltr">
                <input type="checkbox" class="form-check-input" v-model="objModel.sell_by_strategy">
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-5 mt-0">percentage_per_trade</h5>
            <div class="p-3">
              <Slider v-model="objModel.percentage_per_trade" :min="0" :max="100"/>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-5 mt-0">max_positions_per_market</h5>
            <div class="p-3">
              <Slider v-model="objModel.max_positions_per_market" :min="0" :max="10"/>
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
import BotViewModel from "@/models/viewmodels/bot";
import StrategyViewModel from "@/models/viewmodels/strategy";
import ExchangeAccountViewModel from "@/models/viewmodels/exchange_account";

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
      type: BotViewModel,
      default: () => {
        return new BotViewModel()
      }
    },
  },
  data() {
    return {
      isLoadingSelect: false,
      objModel: new BotViewModel(),
      createColumns: ['name', 'exchange_account_id', 'practice_mode', 'enabled', 'buy_enabled', 'sell_enabled', 'coins', 'strategy', 'base_symbol', 'amount', 'amountRemaining', 'percentage_per_trade', 'stop_loss', 'profit_at', 'sell_by_strategy','sell_by_tpst', 'max_positions_per_market'],
      updateColumns: ['name', 'exchange_account_id', 'practice_mode', 'enabled', 'buy_enabled', 'sell_enabled', 'coins', 'strategy', 'base_symbol', 'amount', 'amountRemaining', 'percentage_per_trade', 'stop_loss', 'profit_at', 'sell_by_strategy','sell_by_tpst', 'max_positions_per_market'],
    };
  },
  watch: {
    objProp: function () { // watch it
      // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.init();
    }
  },
  methods: {
    asyncFindAccount: async (query) => {
      if (query === "") {
        return [];
      }
      const response = await ExchangeAccountViewModel.search(query)
      return response.data._items.map((item) => {
        return { value: item["_id"], label: item["name"] }
      });
    },
    asyncFindStrategy: async (query) => {
      if (query === "") {
        return [];
      }
      const response = await StrategyViewModel.search(query)
      return response.data._items.map((item) => {
        return { value: item["_id"], label: item["name"] }
      });
    },
    init() {
      if (this.isEdit) {
        this.objModel = this.objProp;
      }
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
              text: 'Bot has been created.',
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
              text: 'Bot has been updated.',
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
