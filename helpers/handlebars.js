// Takes a key from the data files and returns the corresponding translation from the language file
const translate = (key, options) => {
    const langData = options.data.root.lang;
    return langData[key] || key;
};

// Register the 'order' helper in Handlebars
const order = (array, language, key) => {
    const index = array.findIndex((element) => element[key] === language);
    if (index > -1) {
        const first = array.splice(index, 1);
        return first.concat(array);
    }
    return array;  // Return the array as is if the language is not found
};
module.exports = {
    translate,
    order,
};
