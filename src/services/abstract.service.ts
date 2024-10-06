export abstract class AbstractService {

  constructor() {
  }


  public init(): void {
    // à override si nécessaire par le service
  }

  public close(): void {
    // à override si nécessaire par le service
  }

}