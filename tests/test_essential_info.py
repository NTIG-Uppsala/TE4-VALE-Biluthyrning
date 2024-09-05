import unittest
from utils import *


class TestEssentialInfo(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if (self.__class__.__name__ == "TestName"):
            self.fail("Test class name is not correct")

    # tests
    def testName(self) -> None:
        self.assertInText("NTB Biluthyrning")

    def testPhoneNumber(self) -> None:
        self.assertInHtml("tel:+46630555555")
        self.assertInText("+46\xa063‑055\xa055\xa055")

    def testEmail(self) -> None:
        self.assertInHtml("mailto:info@ntbhyr.se")
        self.assertInText("info@ntbhyr.se")

    def testAddress(self) -> None:
        self.assertTextInAll([
            "Fjällgatan 32H",
            "981 39",
            "Kiruna",
        ])
        self.assertInHtml("https://maps.app.goo.gl/5c7N2tctTDWgJgYr7")

    def testSocialMedia(self) -> None:
        self.assertHtmlInAll([
            "https://facebook.com/ntiuppsala",
            "https://instagram.com/ntiuppsala",
            "https://x.com/ntiuppsala",
        ])

    # testing of opening hours is also done in a separate file
    # but those tests test the dynamic opening hours feature,
    # i.e. it tests the thing that says if they're currently open or not
    def testOpeningHours(self) -> None:
        self.assertTextInAll([
            "Måndag - fredag",
            "10:00 - 16:00",
            "Lördag",
            "12:00 - 15:00",
            "Söndag",
            "Stängt",
        ])


if __name__ == "__main__":
    unittest.main(verbosity=2)
