const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email');
    }
    return new Email(value.toLowerCase());
  }

  toString(): string {
    return this.value;
  }
}
