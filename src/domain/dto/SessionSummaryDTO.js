export default class SessionSummaryDTO {
  constructor({ item, carpark, quantity, total }) {
    this.item = item;
    this.carpark = carpark;
    this.quantity = quantity;
    this.total = total;
  }

  // (opcional) método estático para convertir una lista de resultados SQL en DTOs
  static fromQueryResults(results) {
    return results.map(result => new SessionSummaryDTO(result));
  }
}