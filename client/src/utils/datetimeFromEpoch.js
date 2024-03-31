const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

export function datetimeFromEpoch(timeEpoch) {
    const date = new Date(timeEpoch);
    let day = date.getDay();
    let dd = date.getDate(), mm = date.getMonth(), yy = date.getFullYear();
    let hours = date.getHours(), minutes = date.getMinutes();

    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = `${weekDays[day]}, ${dd} ${months[mm].slice(0, 3)} ${yy} ${hours}:${minutes} ${ampm}`;
    return strTime;
}