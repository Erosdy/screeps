export abstract class AbstractComparable {

  protected constructor(protected value: number) {
  }

  public equals(other: AbstractComparable) {
    return this.value === other.value;
  }

  public greaterThan(other: AbstractComparable) {
    return this.value > other.value;
  }

  public greaterThanOrEqual(other: AbstractComparable) {
    return this.greaterThan(other) || this.equals(other);
  }

  public lessThan(other: AbstractComparable) {
    return this.value < other.value;
  }

  public lessThanOrEqual(other: AbstractComparable) {
    return this.lessThan(other) || this.equals(other);
  }
}