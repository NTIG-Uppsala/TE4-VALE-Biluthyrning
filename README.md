# Car Rental Website for NTB Car Rental

###### This is a TE4 project by the group VALE. Original group members: Viggo Ström, Axel Thornberg, Eskil Tornberg. Current maintainers: Ivar Bjerling, Tim Kelso, David Cavalli-Björkman.

---

### Compiling

In order to compile the project, [Node.js](https://nodejs.org/en) has to be installed and working.
Afterwards install the required packages with:

``npm install js-yaml handlebars dotenv cross-env``

To compile the project, run the [hbs-compilor.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/scripts/hbs-compilor.js) script with:

``node scripts/hbs-compilor.js``

This will generate all the necessary html files from the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

---

### Set Database Environment
The website uses a Cloud SQL-based database solution hosted on [cloudflare](https://www.cloudflare.com/) to fetch information about the cars.
There are two database tables available, a production and a development table.
The current database table is fetched and processed in the [hbs-compilor.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/scripts/hbs-compilor.js) script.
The URLs for the tables are set in the [database.env](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/database.env) file, which defines environment variables for the production and development table URLs.

To change the database environment and recompile the website, run:

``npm run <env>``

where ``<env>`` should be replaced with either ``prod`` or ``dev``.

You can also manually set the CARSDB_ENV environment variable to either "prod" or "dev" and run:

``node scripts/hbs-compilor.js``

### Changing Open Hours

To change the open hours that appear on the site, you have to change the object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/openHours.js) file.

To change closed days change the text content of a table in the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file and change the closedDates object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/openHours.js) file.

---

### Flag Icons
We use a customized version of the [flag-icons](https://github.com/lipis/flag-icons) project to integrate inline flag icons for the locale selection dropdown in the navigation bar. 
In the [flag-icons](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/style/flag-icons/) folder of our project there are two folders, 
[css](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/style/flag-icons/css) and
[flags](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/style/flag-icons/flags).

The [css](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/style/flag-icons/css) folder contains a minified CSS file which gets imported in the index.html files.
The [flags](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/style/flag-icons/flags) folder contains the flag icons used, which are imported through said CSS file.

Beware that you have to add a new flag icon to the [flags](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/style/flag-icons/flags) folder if you want to add more flag icons to the project.
This can be done through downloading the [flag-icons](https://github.com/lipis/flag-icons) project and adding the desired flag icons.

To place an inline icon on the page simply add this HTML, where xx is replaced with the desired country number:

    <span class="fi fi-xx"></span>

---

### Changing other Essential Information.

There are two spots in the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file that specify the phone number. Change both spots.

To change which cars are available or their price (which should include VAT) edit the corresponding table in the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file. To change the VAT tax simply change the value of the "vat" constant in [vatOnCars.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/vatOnCars.js).

To change which ZIP codes that are delivered to and their price change the [listOfZIPCodes.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/listOfZIPCodes.js) file as well as the noscript span of the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

To change the E-mail change the innerHTML and the value of the href-attribute of one element in the footer of the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

To change the address change the innerHTML and the value of the href-attribute of one element in the footer of the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

When making changes to any of the above files also make sure to add that change to its correlating python testing file.

---

### Manual and Automated Testing

The project currently uses GitHub workflows to automate the testing of any files pushed to certain branches. To view and change which branches are tested, open ".github/workflows/automated-tests.yml" and ".github/workflows/w3c-validation.yml" and under "branches:" remove or add desired branches for each file.

To manually conduct the w3c validation tests open [this page](https://validator.w3.org/#validate_by_upload) and submit the desired html-files.

To manually conduct the automated content testing you need to have installed Python version 3.12.5 and then run the following commands in the terminal: 

``pip install pytest-playwright playwright pytest-json-report``

``python -m playwright install``

To add more Python tests either add more methods (which start with test*) in the existing test*.py files or create a new file with the test*.py format using the template in "tests/template.py" but with a changed class-name.

---

### Deploy to Github Pages

Github Pages is built from the "live" branch.
To update the live github pages site you have to merge or rebase your changes to the "live" branch and then push to upstream (origin).

---

### Documents

_You must be a member of the NTI organization to open these documents due to administrator restrictions._

-   [Coding Standards](https://docs.google.com/document/d/1dJfQdgAl6E9tcHBeBnb0e2uB0bi2bdLuae2takOrGkk)
-   [Development Environment](https://docs.google.com/document/d/1Ssf3YnYcBpyaFDB6_u13xwsDctFAzLoYFpRsogTgHsQ)
-   [Programming languages](https://docs.google.com/document/d/1SSwpfVekfKO-xPAD7ia-tl_2XUqu4rodW4a1T_FcxaQ)