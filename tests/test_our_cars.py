import unittest
from utils import *


class TestOurCars(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # tests

    def testCarsAndVAT(self) -> None:
        vat_button = self.page.query_selector("#vat-button")
        no_vat_button = self.page.query_selector("#no-vat-button")

        self.assertText("Våra bilar")

        # Checks the cars 

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

        # Checks the VAT button
        self.assertTextInAll(["Moms", "Exkl. moms"])

        # Disables VAT
        no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])

        no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])

        # Enables VAT

        vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

        vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

        # Disables VAT

        no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
