import BaseRepository from "./base_repository";
import BotViewModel from "../viewmodels/bot";

export default class BotRepository extends BaseRepository {
  constructor(objects) {
    super(objects, BotViewModel);
  }
}
