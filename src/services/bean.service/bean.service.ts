import {ServiceEnum} from "./service.enum";
import {AbstractService} from "../abstract.service";
import {declarationServices} from "./declaration.service";

/**
 * Service statique qui va permettre d'initialiser, récupérer et cloturer
 * tous les services déclarés dans le fichier declaration.service
 */
export class BeanService {

  private static hasBeenInstanciate: boolean = false;
  private static services: Map<ServiceEnum, AbstractService> = new Map();

  /**
   * <strong>A appeler au tout début de la boucle</strong> <br>
   * Initialise tous les services présent dans declaration.service.
   */
  public static init(): void {
    for (const entry of declarationServices) {
      this.addService(entry.name, entry.service);
    }
    for (const service of this.services.values()) {
      service.init();
    }
    this.hasBeenInstanciate = true;
  }

  /**
   * <strong>Ne peut pas être utilisé avant que la méthode [init]{@link BeanService#init} n'ait été invoqué</strong><br>
   * Permet de récupérer le service correspondant au type donné
   * @param type
   */
  public static getService<T extends AbstractService>(type: ServiceEnum): T {
    const result = this.services.get(type);
    if (!result) {
      throw new Error(`Service ${type} not found`);
    }
    return result as T;
  }

  /**
   * <strong>A appeler en toute fin de boucle</strong><br>
   * Cloture tous les services initialisés plus tôt
   */
  public static closeServices(): void {
    if (!this.hasBeenInstanciate) {
      throw new Error("bean.service should be initialise before closing its services");
    }
    for (const service of this.services.values()) {
      service.close();
    }
    this.hasBeenInstanciate = false;
  }

  private static addService(name: ServiceEnum, service: AbstractService) {
    this.services.set(name, service);
  }

}