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

    def testSectionTitle(self) -> None:
        self.assertInText("Våra bilar")

    def testVATButtons(self) -> None:
        self.assertTextInAll(["Moms", "Exkl. moms"])

    def testCarsWithVAT(self) -> None:
        vat_button = self.page.query_selector("#vat-button")

        vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

    def testCarsWithoutVAT(self) -> None:
        no_vat_button = self.page.query_selector("#no-vat-button")

        no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])

    def testDoubleVATButtons(self) -> None:
        vat_button = self.page.query_selector("#vat-button")

        vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

        vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

    def testDoubleNoVATButtons(self) -> None:
        no_vat_button = self.page.query_selector("#no-vat-button")

        no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])

        no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])

    def testSpamVATButton(self) -> None:
        vat_button = self.page.query_selector("#vat-button")

        for _ in range(10):
            vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "800 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "450 kr"])
        self.assertTextInAll(["VW Polo", "2022", "300 kr"])

    def testSpamNoVATButton(self) -> None:
        no_vat_button = self.page.query_selector("#no-vat-button")

        for _ in range(10):
            no_vat_button.click()

        self.assertTextInAll(["Audi A6", "2011", "640 kr"])
        self.assertTextInAll(["Mitsubishi Outlander", "2018", "360 kr"])
        self.assertTextInAll(["VW Polo", "2022", "240 kr"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
