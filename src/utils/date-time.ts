const normalizeDate = (date: Date) => {
    date.setUTCHours(0, 0, 0, 0);
}

export { normalizeDate }