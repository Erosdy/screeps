import {RepositoryClass} from "../repositories/repository.type";
import {MemoryKeyEnum} from "../repositories/memory-key.enum";
import {Repository} from "../repositories/repository.decorator";
import {NeedInterface} from "./need.interface";
import {RepositoryAbstract} from "../repositories/repository.abstract";

@Repository(MemoryKeyEnum.NEEDS)
class NeedRepositoryImpl extends RepositoryAbstract<NeedInterface> {
}

export const NeedRepository = NeedRepositoryImpl as unknown as RepositoryClass<NeedRepositoryImpl>;