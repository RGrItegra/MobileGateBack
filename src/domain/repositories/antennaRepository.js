import {antenna} from '../models/index.js'
import sequelize from '../../infraestructure/database/connectionSQLServer.js';

class AntennaRepository {
  async getAntennasTypeOne() {
    const query = `
      SELECT a.gerNr, a.antName 
      FROM antenna a
      WHERE a.antType = 1
    `;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return results;
  }
}

export default new AntennaRepository();