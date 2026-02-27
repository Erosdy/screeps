import {RepositoryClass} from "../repositories/repository.type";
import {Repository} from "../repositories/repository.decorator";
import {NeedInterface} from "./need.interface";
import {RepositoryAbstract} from "../repositories/repository.abstract";
import {MemoryKey} from "../repositories/memory-key.class";

@Repository(MemoryKey.NEEDS)
class NeedRepositoryImpl extends RepositoryAbstract<NeedInterface> {
}

export const NeedRepository = NeedRepositoryImpl as unknown as RepositoryClass<NeedRepositoryImpl>;