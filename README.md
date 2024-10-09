# Car Rental Website for NTB Car Rental

###### This is a TE4 project by the group VALE. Original group members: Viggo Ström, Axel Thornberg, Eskil Tornberg. Former maintainers: Ivar Bjerling, Tim Kelso, David Cavalli-Björkman. Current maintainers: Jesper Cejie, Carl Eriksson Skogh, Joel Jansson, Viggo Ström och Axel Thornberg.


## Documents

- [Coding Standard](docs/coding-standard.md)
- [Development Environment](docs/development-environment.md)
- [Programming languages](docs/programming-languages.md)


## Compiling

In order to compile the project, [Node.js](https://nodejs.org/en/download/) version 20.18.0 has to be installed and working.
Afterwards install the required packages with:

```bash
npm install js-yaml handlebars dotenv cross-env
```

To compile the project, run the [hbs-compiler.js](scripts/hbs-compiler.js) script with:

```bash
node scripts/hbs-compiler.js
```

This will generate all the necessary html files from the [index.hbs](views/index.hbs) file.


## Changing Open Hours

To change the open hours that appear on the site, you have to change `open_hours` and/or `july_open_hours` in the [kiruna.yml](data/kiruna.yml) and/or [lulea.yml](data/lulea.yml) file.

To change closed days change the text content of a table in the [index.hbs](views/index.hbs) file and change the closedDates object in the [openHours.js](public/js/openHours.js) file.


## Flag Icons

We use a customized version of the [flag-icons](https://github.com/lipis/flag-icons) project to integrate inline flag icons for the language selection dropdown in the website's nav-bar. In the [flag-icons folder](public/css/flag-icons/) of our project there are two folders, [css](public/css/flag-icons/css) and [flags](public/css/flag-icons/flags). The [css folder](public/css/flag-icons/css) contains a minified [CSS file](public/css/flag-icons/css/flag-icons.min.css) which gets imported in [index.hbs](views/index.hbs). The [flags folder](public/css/flag-icons/flags) contains the flag icons used, which are imported through said CSS file. Beware that you have to add a new flag icon to the [flags folder](public/css/flag-icons/flags) if you want to add more flag icons to the project. This can be done through downloading the [flag-icons](https://github.com/lipis/flag-icons) project and adding the desired flag icons.

To place an inline icon on the page add the language name and code to the `languages`-variable in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).


## Changing other Essential Information.

- Phone numbers are changed in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

- Changing which cars are available in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

- To change the VAT tax simply change the value of the "vat_on_cars" in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

- To change which ZIP codes are delivered to and their price change the value of the `zip_codes`-key in [kiruna.yml](data/kiruna.yml) or [lulea.yml](data/lulea.yml).

- To change the E-mail change the `mail`-variable in [kiruna.yml](data/kiruna.yml) or [lulea.yml](data/lulea.yml).

- To change the address change the `address`- and `zip_code`-variables in [kiruna.yml](data/kiruna.yml) or [lulea.yml](data/lulea.yml).

_When making changes to any of the above files also make sure to add that change to its correlating python testing file._


## Manual and Automated Testing

The project currently uses GitHub workflows to automate the testing of any files pushed to certain branches. To view and change which branches are tested, open [automated-tests.yml](.github/workflows/automated-tests.yml) and [w3c-validation.yml](.github/workflows/w3c-validation.yml) and under "branches:" remove or add desired branches for each file.

To manually conduct the w3c html-validation tests open [w3validator](https://validator.w3.org/#validate_by_upload) and submit the desired html-files.

To manually conduct the automated content testing you need to have installed Python version 3.12.5 and then run the following commands in the terminal: 

```bash
pip install pytest-playwright playwright pytest-json-report
```

```bash
python -m playwright install
```

To add more Python tests either add more methods (which start with test*) in the existing test*.py files or create a new file with the test*.py format using the template in "tests/template.py" but with a changed class-name.
