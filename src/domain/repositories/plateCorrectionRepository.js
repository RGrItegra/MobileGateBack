import {PlateCorrection} from "../models/index";

class PlateCorrectionRepository {
  async createCorrection(data) {
    return await PlateCorrection.create(data);
  }
}

export default new PlateCorrectionRepository();
