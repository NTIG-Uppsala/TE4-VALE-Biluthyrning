import unittest
from utils import *


class TestEssentialInfo(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="public/se/kiruna/index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if (self.__class__.__name__ == "TestName"):
            self.fail("Test class name is not correct")

    # tests
    def testName(self) -> None:
        self.assertInTextContent("NTB Biluthyrning")

    def testPhoneNumber(self) -> None:
        self.assertIn("tel:+46630555555", self.page.content())
        self.assertInTextContent("+46 63-055 55 55")

    def testEmail(self) -> None:
        self.assertIn("mailto:info@ntbhyr.se", self.page.content())
        self.assertInTextContent("info@ntbhyr.se")

    def testAddress(self) -> None:
        self.assertInAllTextContent([
            "Fjällgatan 32H",
            "981 39",
            "Kiruna",
        ])
        self.assertIn("https://maps.app.goo.gl/5c7N2tctTDWgJgYr7", self.page.content())

    def testSocialMedia(self) -> None:
        self.assertInAll([
            "https://facebook.com/ntiuppsala",
            "https://instagram.com/ntiuppsala",
            "https://x.com/ntiuppsala",
        ])

    # testing of open hours is also done in a separate file
    # but those tests test the dynamic open hours feature,
    # i.e. it tests the thing that says if they're currently open or not
    def testOpenHours(self) -> None:
        self.assertInAllTextContent([
            "Måndag - fredag",
            "10:00 - 16:00",
            "Lördag",
            "11:00 - 15:00",
            "Söndag",
            "Stängt",
        ])


if __name__ == "__main__":
    unittest.main(verbosity=2)
