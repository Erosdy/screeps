import {AbstractService} from "../abstract.service";

export class RoomService extends AbstractService {

  private memory = new Map<string, Map<string, StructureMemory>>();

  public init() {
    const roomsMemory = Memory.rooms;
    for (const name in roomsMemory) {
      const room = roomsMemory[name];
      const roomMap = new Map<string, StructureMemory>();
      for (const structure of room.structures) {
        roomMap.set(structure.name, structure);
      }
      this.memory.set(name, roomMap);
    }
  }

  public close() {
    for (const [room, map] of this.memory) {
      const roomMemory: RoomMemory = {
        name: room,
        structures: []
      };
      for (const [structure, structureMemory] of map) {
        roomMemory.structures.push(structureMemory);
      }
      Memory.rooms[room] = roomMemory;
    }
  }

}