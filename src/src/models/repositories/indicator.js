import BaseRepository from "./base_repository";
import IndicatorViewModel from "../viewmodels/indicator";

export default class IndicatorRepository extends BaseRepository {
  constructor(objects) {
    super(objects, IndicatorViewModel);
  }
}
