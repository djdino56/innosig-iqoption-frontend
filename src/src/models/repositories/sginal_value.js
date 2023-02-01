import BaseRepository from "./base_repository";
import SignalValueViewModel from "../viewmodels/signal_value";

export default class SignalValueRepository extends BaseRepository {
  constructor(objects) {
    super(objects, SignalValueViewModel);
  }
}
