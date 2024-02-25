export function createRoomID({ idArray, isGroup }) {
    let room;
    if (isGroup) room = idArray[0];
    else {
        idArray.sort();
        room = idArray[0] + idArray[1];
    }
    return room;
}