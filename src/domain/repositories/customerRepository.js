import { Customer } from "../models/index.js";

class CustomerRepository {
  async createCustomer(data) {
    return await Customer.create({
      cusExternalId: data.externalId
    });
  }
}

export default new CustomerRepository();
