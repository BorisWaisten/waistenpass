export class Price {
  private constructor(private readonly amount: number, private readonly currency: string) {}

  static create(amount: number, currency: string): Price {
    if (amount < 0) {
      throw new Error('Price must be positive');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be ISO 4217 code');
    }
    return new Price(amount, currency.toUpperCase());
  }

  get value(): { amount: number; currency: string } {
    return { amount: this.amount, currency: this.currency };
  }
}
