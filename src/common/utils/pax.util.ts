import { RoomsSearchRequestDto } from 'src/shared/dtos';

export function getMaxNumOfPaxes(rooms: RoomsSearchRequestDto[]) {
  return rooms.reduce(
    (maxValues, room) => {
      return {
        maxAdult: Math.max(maxValues.maxAdult, room.adult),
        maxChildren: Math.max(maxValues.maxChildren, room.children),
        maxInfant: Math.max(maxValues.maxInfant, room.infant),
      };
    },
    { maxAdult: 0, maxChildren: 0, maxInfant: 0 },
  );
}
