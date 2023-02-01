import BaseRepository from "./base_repository";
import SignalViewModel from "../viewmodels/signal";

export default class SignalRepository extends BaseRepository {
  constructor(objects) {
    super(objects, SignalViewModel);
  }
}
