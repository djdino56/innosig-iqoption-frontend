import BaseRepository from "./base_repository";
import BotLogViewModel from "../viewmodels/bot_log";

export default class BotLogRepository extends BaseRepository {
  constructor(objects) {
    super(objects, BotLogViewModel);
  }
}
