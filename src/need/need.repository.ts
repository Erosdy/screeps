import {RepositoryClass} from "../repositories/repository.type";
import {MemoryKeyEnum} from "../repositories/memory-key.enum";
import {Repository} from "../repositories/repository.decorator";
import {NeedInterface} from "./need.interface";
import {RepositoriyAbstract} from "../repositories/repository.abstract";

@Repository(MemoryKeyEnum.NEEDS)
class NeedRepositoryImpl extends RepositoriyAbstract<NeedInterface> {
}

export const NeedRepository = NeedRepositoryImpl as unknown as RepositoryClass<NeedRepositoryImpl>;