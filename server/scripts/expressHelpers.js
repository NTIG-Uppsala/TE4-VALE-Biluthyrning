// Render a page using Handlebars
const renderPage = (req, res, data, page) => {
    // Renders the page using the given data
    res.render(page, {
        layout: false,
        ...data,
    });
};

module.exports = {
    renderPage,
};
