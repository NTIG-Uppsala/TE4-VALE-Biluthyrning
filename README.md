# Car Rental Website for NTB Car Rental

###### Group members: Viggo Ström, Axel Thornberg, Eskil Tornberg. This is a TE4 project by the group VALE.

---

### Compiling

To compile simply run the [hbs-compile.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/scripts/hbs-compile.js) file. Most information can be found in the locations and locales files situated in [the locations folder](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/locations/) and [the locales folder](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/locales/).

---

### Changing Open Opening Hours

To change the opening hours that appear on the site, you have to change the object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/js/openHours.js) file.

To change closed days change the text content of a table in the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/index.html) file and change the closedDates object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/js/openHours.js) file.

---

### Changing other essential information.

There are two spots in the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/index.html) file that specify the phone number. Change both spots.

To change which cars are available or their price (which should include VAT) edit the corresponding table in the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/index.html) file. To change the VAT tax simply change the value of the "vat" constant in [vatOnCars.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/js/vatOnCars.js).

To change which ZIP codes that are delivered to and their price change the [listOfZIPCodes.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/js/listOfZIPCodes.js) file as well as the noscript span of the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/index.html) file.

To change the E-mail change the innerHTML and the value of the href-attribute of one element in the footer of the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/index.html) file.

To change the address change the innerHTML and the value of the href-attribute of one element in the footer of the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/main/index.html) file.

When making changes to any of the above files also make sure to add that change to its correlating python testing file.

---

### Manual and Automated Testing

The project currently uses GitHub workflows to automate the testing of any files pushed to the following branches: main, gh-pages, validation-testing, live, and validation-and-automation-testing. To change which branches are tested open .github/workflows/automated-tests.yml and .github/workflows/w3c-validation.yml and under "branches:" remove or add desired branches.

To manually conduct the w3c validation tests open [this page](https://validator.w3.org/#validate_by_upload) and submit the desired html-files.

To manually conduct the automated content testing install Python 3.12.5 and run the following commands in the terminal: "pip install pytest-playwright", "pip install playwright", "pip install pytest-json-report", and "playwright install". After that run the tests/test_index.py file.

To add more Python tests either add more methods (which start with test*) in the existing test*.py files or create a new file with the test*.py format using the template in template.py but with a changed class-name.

---

### Documents

_You must be a member of the NTI organization to open these documents due to administrator restrictions._

-   [Coding Standards](https://docs.google.com/document/d/1dJfQdgAl6E9tcHBeBnb0e2uB0bi2bdLuae2takOrGkk)
-   [Development Environment](https://docs.google.com/document/d/1Ssf3YnYcBpyaFDB6_u13xwsDctFAzLoYFpRsogTgHsQ)
-   [Programming languages](https://docs.google.com/document/d/1SSwpfVekfKO-xPAD7ia-tl_2XUqu4rodW4a1T_FcxaQ)
