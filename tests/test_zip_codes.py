import unittest
import time
from utils import *


class TestZIPCodes(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # Helper functions
    def fillAndSubmit(self, zip_code: str) -> None:
        zip_input = self.page.query_selector("#zip-input")
        zip_button = self.page.query_selector("#zip-button")
        zip_input.fill(zip_code)
        zip_button.click()
        time.sleep(0.2)

    # tests
    def testEmptyZIPCode(self) -> None:
        self.fillAndSubmit("")
        self.assertText("Du måste ange ett postnummer i rutan")

    def testInvalidZIPCode(self) -> None:
        self.fillAndSubmit("1234")
        self.assertText("Postnumret måste vara fem siffror")

    def testZIPCodeNotDeliveredTo(self) -> None:
        self.fillAndSubmit("12345")
        self.assertText("Vi kör inte ut till postnummer 12345")
        self.fillAndSubmit("54321")
        self.assertText("Vi kör inte ut till postnummer 54321")

    def testZIPCodeDeliveredTo(self) -> None:
        self.fillAndSubmit("98138")
        self.assertText("Vi kör ut till postnummer 98138 för 199 kr")
        self.fillAndSubmit("98144")
        self.assertText("Vi kör ut till postnummer 98144 för 299 kr")
        self.fillAndSubmit("98147")
        self.assertText("Vi kör ut till postnummer 98147 för 299 kr")


if __name__ == "__main__":
    unittest.main(verbosity=2)
