import unittest
from playwright.sync_api import sync_playwright
from os import path


#
# I have started to migrate the tests to a new structure.
# the methods of the testIndex class 
#

class TestIndex(unittest.TestCase):

    def testOurCarsAndVat(self: "TestIndex") -> None:
        self.assertIn("Våra bilar", self.page.content())
        cars = [
            {"name": "Audi A6", "year": "2011", "price": "800 kr"},
            {"name": "Audi S3", "year": "2015", "price": "450 kr"},
            {"name": "Cadillac Escalade", "year": "1999", "price": "500 kr"},
            {"name": "Kia Carens", "year": "2022", "price": "400 kr"},
            {"name": "Kia Soul", "year": "2020", "price": "400 kr"},
            {"name": "Mitsubishi Outlander", "year": "2018", "price": "450 kr"},
            {"name": "Renault Kadjar", "year": "2020", "price": "250 kr"},
            {"name": "Subaru Outback", "year": "2020", "price": "300 kr"},
            {"name": "Volvo XC40", "year": "2018", "price": "800 kr"},
            {"name": "VW Polo", "year": "2022", "price": "300 kr"},
        ]
        vat = 1.25

        our_cars_table = self.page.query_selector(".our-cars-section>table")
        self.assertIsNotNone(our_cars_table)

        trs = our_cars_table.query_selector("tbody").query_selector_all("tr")
        for index, tr in enumerate(trs):
            self.assertEqual(cars[index]["name"], tr.query_selector_all("td")[
                0].text_content())
            self.assertEqual(cars[index]["year"], tr.query_selector_all("td")[
                1].text_content())
            self.assertEqual(cars[index]["price"], tr.query_selector_all("td")[
                2].text_content())

        buttonContainer = self.page.query_selector(
            ".our-cars-section>.vat-container")
        self.assertIsNotNone(buttonContainer)
        self.assertIn("Moms", buttonContainer.text_content())
        self.assertIn("Exkl. moms", buttonContainer.text_content())

        vatButton = buttonContainer.query_selector_all("button")[1]
        vatButton.click()

        for index, tr in enumerate(trs):
            self.assertEqual(cars[index]["name"], tr.query_selector_all("td")[
                0].text_content())
            self.assertEqual(cars[index]["year"], tr.query_selector_all("td")[
                1].text_content())
            self.assertNotEqual(
                cars[index]["price"], tr.query_selector_all("td")[2].text_content())
            priceInt = int(int(cars[index]["price"].split(" ")[0]) / vat)
            self.assertEqual(str(priceInt) + " kr",
                             tr.query_selector_all("td")[2].text_content())


if __name__ == "__main__":
    unittest.main(verbosity=2)
