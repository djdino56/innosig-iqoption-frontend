import BaseRepository from "./base_repository";
import BondViewModel from "../viewmodels/bond";

export default class BondRepository extends BaseRepository {
  constructor(objects) {
    super(objects, BondViewModel);
  }
}
