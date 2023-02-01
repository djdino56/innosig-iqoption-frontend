import BaseRepository from "./base_repository";
import CandleViewModel from "@/models/viewmodels/candle";

export default class CandleRepository extends BaseRepository {
  constructor(objects) {
    super(objects, CandleViewModel);
  }
}
