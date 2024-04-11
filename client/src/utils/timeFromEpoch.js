export function timeFromEpoch(timeEpoch) {
    const date = new Date(timeEpoch);
    let hours = date.getHours(), minutes = date.getMinutes();

    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
}