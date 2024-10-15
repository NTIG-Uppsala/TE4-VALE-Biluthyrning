
// Format phone number to remove all characters except numbers and plus sign
const format = (number) => {
    const cleaned = number.replace(/[^0-9+]/g, '');
    return cleaned;
}

module.exports = {
    format: format
}