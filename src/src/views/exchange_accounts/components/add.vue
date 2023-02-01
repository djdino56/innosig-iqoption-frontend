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
            <h5 class="font-size-14 mb-1 mt-0">exchange_type</h5>
            <select class="form-select mb-3" aria-label="Default select example" v-model="objModel.exchange_type" required>
              <option value="binance_spot">binance</option>
              <option value="bitvavo">bitvavo</option>
              <option value="iqoption">iqoption</option>
            </select>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">exchange_api</h5>
            <div class="p-0">
              <input type="text" class="form-control" v-model="objModel.exchange_api" required>
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <div class="p-1">
            <h5 class="font-size-14 mb-1 mt-0">exchange_secret</h5>
            <div class="p-0">
              <input type="text" class="form-control" v-model="objModel.exchange_secret" required>
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
import {
  BForm, BButton, BCard, BCol, BRow
} from 'bootstrap-vue-3';
import Swal from "sweetalert2";
import ExchangeAccountViewModel from "@/models/viewmodels/exchange_account";

export default {
  name: 'Bot',
  components: {
    BForm, BButton, BCard, BCol, BRow
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    objProp: {
      type: ExchangeAccountViewModel,
      default: () => {
        return new ExchangeAccountViewModel()
      }
    },
  },
  data() {
    return {
      objModel: new ExchangeAccountViewModel(),
      createColumns: ['name', 'status', 'exchange_type', 'exchange_api', 'exchange_secret'],
      updateColumns: ['name', 'status', 'exchange_type', 'exchange_api', 'exchange_secret'],
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
    createOrUpdateObj(update = false) {
      if (update === false) {
        this.objModel.status = 'new';
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
              text: 'Exchange account has been created.',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            });
          }
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.objModel.status = 'new';
        this.objModel.update(this.updateColumns).then(response => {
          if (response.data._status === 'OK') {
            this.objModel._etag = response.data._etag;
            this.objModel._updated = response.data._updated;
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: 'Exchange account has been updated.',
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
