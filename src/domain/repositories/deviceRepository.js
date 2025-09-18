import {Device} from '../models/index.js'

import { Device } from '../models/index.js'

class DeviceRepository {
  async findByUuid(devUuid) {
    return await Device.findOne({
      where: {
        devUuid,
        devEnabled: true // ✅ CORREGIDO: Solo devices habilitados
      }
    });
  }

  async findById(devId) {
    return await Device.findByPk(devId);
  }
}

export default new DeviceRepository();
