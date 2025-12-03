

import { Device } from '../models/index.js'

class DeviceRepository {
  async findByUuid(devUuid) {
    return await Device.findOne({
      where: {
        devUuid
      }
    });
  }
/*
  async findById(devId) {
    return await Device.findByPk(devId);
  }*/

  async  findById(id) {
  return await Device.findOne({ where: { devId: id } });
}

  async hasValidUuid(devId) {
    const device = await Device.findOne({ where: { devId } });
    return device && device.devUuid ? true : false;
  }

}

export default new DeviceRepository();
