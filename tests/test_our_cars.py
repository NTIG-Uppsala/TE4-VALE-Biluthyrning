import unittest
from utils import *


class TestOurCars(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="public/se/kiruna/index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # tests

    def testVATButtonsExists(self) -> None:
        self.assertInAllTextContent(["Moms", "Exkl. moms"])

    def testCarsWithVAT(self) -> None:
        withVatButton = self.page.query_selector("#vat-button")

        withVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "800 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "300 kr"])

    def testCarsWithoutVAT(self) -> None:
        withoutVatButton = self.page.query_selector("#no-vat-button")

        withoutVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "640 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "240 kr"])

    def testDoubleVATButtons(self) -> None:
        withVatButton = self.page.query_selector("#vat-button")

        withVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "800 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "300 kr"])

        withVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "800 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "300 kr"])

    def testDoubleNoVATButtons(self) -> None:
        withoutVatButton = self.page.query_selector("#no-vat-button")

        withoutVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "640 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "240 kr"])

        withoutVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "640 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "240 kr"])

    def testSpamVATButton(self) -> None:
        withVatButton = self.page.query_selector("#vat-button")

        for _ in range(10):
            withVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "800 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "300 kr"])

    def testSpamNoVATButton(self) -> None:
        withoutVatButton = self.page.query_selector("#no-vat-button")

        for _ in range(10):
            withoutVatButton.click()

        self.assertInAllTextContent(["Audi A6", "2011", "640 kr"])
        self.assertInAllTextContent(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertInAllTextContent(["VW Polo", "2022", "240 kr"])
    






    def testSortTableRowsToggle(self) -> None:
        # Step 1: Check what's inside the first column, second row, and store that in a variable
        initialValue = self.page.query_selector("#our-cars-table tr:nth-child(1) td:nth-child(1)").inner_text()

        # Step 2: Click the button that sorts the table using JavaScript execution
        self.page.evaluate("document.querySelector('#our-cars-table thead tr th:nth-child(1)').click()")

        # Step 3: Check what's inside the first column, second row, and store that in another variable
        newValue = self.page.query_selector("#our-cars-table tr:nth-child(1) td:nth-child(1)").inner_text()

        # Step 4: Compare the two variables
        if initialValue == newValue:
            self.fail("The table is not sorted.")
        else:
            self.assertTrue(True, "The table is sorted.")



# First, check whats inside the first column, second row, and store that in a variable.
# Then, click the button that sorts the table.
# Then, check whats inside the first column, second row, and compare it to the variable.
# If it's the same, the table is not sorted.
# If it's different, the table is sorted.






if __name__ == "__main__":
    unittest.main(verbosity=2)
