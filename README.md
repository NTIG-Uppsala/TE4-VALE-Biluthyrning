# Car Rental Website for NTB Car Rental

###### Group members: Viggo Ström, Axel Thornberg, Eskil Tornberg. This is a TE4 project by the group VALE.

---

### Compiling

In order to compile the project, [Node.js](https://nodejs.org/en) has to be installed and working.
Afterwards install the required packages with:

``npm install js-yaml handlebars``

To compile the project, run the [hbs-compile.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/scripts/hbs-compilor.js) script with:

``node scripts/hbs-compilor.js``

This will generate all the necessary html files from the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

---

### Changing Open Opening Hours

To change the opening hours that appear on the site, you have to change the object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/openHours.js) file.

To change closed days change the text content of a table in the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file and change the closedDates object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/openHours.js) file.

---

### Changing other essential information.

There are two spots in the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file that specify the phone number. Change both spots.

To change which cars are available or their price (which should include VAT) edit the corresponding table in the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file. To change the VAT tax simply change the value of the "vat" constant in [vatOnCars.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/vatOnCars.js).

To change which ZIP codes that are delivered to and their price change the [listOfZIPCodes.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/public/js/listOfZIPCodes.js) file as well as the noscript span of the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

To change the E-mail change the innerHTML and the value of the href-attribute of one element in the footer of the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

To change the address change the innerHTML and the value of the href-attribute of one element in the footer of the [index.hbs](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/hbs/index.hbs) file.

When making changes to any of the above files also make sure to add that change to its correlating python testing file.

---

### Manual and Automated Testing

The project currently uses GitHub workflows to automate the testing of any files pushed to the following branches: main, gh-pages, validation-testing, live, and validation-and-automation-testing. To change which branches are tested open .github/workflows/automated-tests.yml and .github/workflows/w3c-validation.yml and under "branches:" remove or add desired branches.

To manually conduct the w3c validation tests open [this page](https://validator.w3.org/#validate_by_upload) and submit the desired html-files.

To manually conduct the automated content testing install Python version 3.12.5 and run the following commands in the terminal: 

``pip install pytest-playwright playwright pytest-json-report``

``python -m playwright install``

To add more Python tests either add more methods (which start with test*) in the existing test*.py files or create a new file with the test*.py format using the template in "tests/template.py" but with a changed class-name.

---

### Documents

_You must be a member of the NTI organization to open these documents due to administrator restrictions._

-   [Coding Standards](https://docs.google.com/document/d/1dJfQdgAl6E9tcHBeBnb0e2uB0bi2bdLuae2takOrGkk)
-   [Development Environment](https://docs.google.com/document/d/1Ssf3YnYcBpyaFDB6_u13xwsDctFAzLoYFpRsogTgHsQ)
-   [Programming languages](https://docs.google.com/document/d/1SSwpfVekfKO-xPAD7ia-tl_2XUqu4rodW4a1T_FcxaQ)

---

### Deploy to Github Pages

Github Pages is built from the "live" branch.
To update the live github pages site you have to merge or rebase your changes to the "live" branch and then push to upstream (origin).