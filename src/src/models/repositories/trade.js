import BaseRepository from "./base_repository";
import TradeViewModel from "../viewmodels/trade";

export default class TradeRepository extends BaseRepository {
  constructor(objects) {
    super(objects, TradeViewModel);
  }
}
