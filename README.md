# Car Rental Website for NTB Car Rental

###### Group members: Viggo Ström, Axel Thornberg, Eskil Tornberg, Leo Åkhagen. This is a TE4 project by the group VALE.

---

### Changing Open Opening Hours

To change the opening hours that appear on the site, you have to change it manually at three places. There are two tables in the [index.html](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/e0b33f2f1ffff5d1a3a0ac8d0b5031c1aa9de9b8/index.html) file and one object in the [openHours.js](https://github.com/NTIG-Uppsala/TE4-VALE-Biluthyrning/blob/e0b33f2f1ffff5d1a3a0ac8d0b5031c1aa9de9b8/js/openHours.js) file that have to be changed.

---

### Manual and Automated Testing

The project currently uses GitHub workflows to automate the testing of any files pushed to the following branches: main, gh-pages, validation-testing, live, and validation-and-automation-testing. To change which branches are tested open .github/workflows/automated-tests.yml and .github/workflows/w3c-validation.yml and under "branches:" remove or add desired branches.

To manually conduct the w3c validation tests open [this page](https://validator.w3.org/#validate_by_upload) and submit the desired html-files.

To manually conduct the automated content testing install Python 3.12.5 and run the following commands in the terminal: "pip install pytest-playwright", "pip install playwright", "pip install pytest-json-report", and "playwright install". After that run the tests/test_index.py file.

To add more Python tests add another method in the TestIndex class whose name starts with "test" and use the assert methods to make the checks.

---

### Documents

_You must be a member of the NTI organization to open these documents due to administrator restrictions._

-   [Coding Standards](https://docs.google.com/document/d/1dJfQdgAl6E9tcHBeBnb0e2uB0bi2bdLuae2takOrGkk)
-   [Development Environment](https://docs.google.com/document/d/1Ssf3YnYcBpyaFDB6_u13xwsDctFAzLoYFpRsogTgHsQ)
-   [Programming languages](https://docs.google.com/document/d/1SSwpfVekfKO-xPAD7ia-tl_2XUqu4rodW4a1T_FcxaQ)
