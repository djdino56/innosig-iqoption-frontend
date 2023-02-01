import BaseRepository from "./base_repository";
import StrategyViewModel from "../viewmodels/strategy";

export default class StrategyRepository extends BaseRepository {
  constructor(objects) {
    super(objects, StrategyViewModel);
  }
}
