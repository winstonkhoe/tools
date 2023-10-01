const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

const normalizeDate = (date: Date) => {
    date.setUTCHours(0, 0, 0, 0);
}

const getFormattedDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthString = months[month]
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`
    const dateString = `${day} ${monthString.substring(0, 3)} ${year}`

    return { date: dateString, time: timeString};
}

export { months, normalizeDate, getFormattedDate }