const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

export function dateFromEpoch(epoch) {
    const date = new Date(epoch);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }