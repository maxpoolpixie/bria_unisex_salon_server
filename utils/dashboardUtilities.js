const convertToDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(year, month - 1, day);  // Month is 0-indexed in JavaScript Date
};

module.exports = convertToDate;