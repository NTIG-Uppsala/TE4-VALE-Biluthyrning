
// Takes a key from the data files and returns the corresponding translation from the language file
const translate = (lang, key) => {
    return lang[key] || key;
};

module.exports = {
    translate,
};