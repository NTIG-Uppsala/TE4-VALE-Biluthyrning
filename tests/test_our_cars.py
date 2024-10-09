import unittest
from utils import *


class TestOurCars(TemplateTest):
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
        initialValue = self.page.query_selector("#our-cars-table tr:nth-child(1) td:nth-child(1)").inner_text()

        self.page.evaluate("document.querySelector('#our-cars-table thead tr th:nth-child(1)').click()")

        newValue = self.page.query_selector("#our-cars-table tr:nth-child(1) td:nth-child(1)").inner_text()

        if initialValue == newValue:
            self.fail("Table rows were not sorted")
        else:
            self.assertTrue(True)

if __name__ == "__main__":
    unittest.main(verbosity=2)
