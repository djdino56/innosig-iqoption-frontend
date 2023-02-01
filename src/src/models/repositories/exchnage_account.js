import BaseRepository from "./base_repository";
import ExchangeAccountViewModel from "../viewmodels/exchange_account";

export default class ExchangeAccountRepository extends BaseRepository {
  constructor(objects) {
    super(objects, ExchangeAccountViewModel);
  }
}
