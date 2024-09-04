import unittest
from utils import *


class TestEssentialInfo(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    # tests
    def testName(self) -> None:
        self.assertIn("NTB Biluthyrning", self.page.content())

    def testPhoneNumber(self) -> None:
        print(self)
        self.assertIn("+46&nbsp;63‑055&nbsp;55&nbsp;55", self.page.content())

    def testEmail(self) -> None:
        self.assertIn("info@ntbhyr.se", self.page.content())

    def testAddress(self) -> None:
        self.assertInAll([
            "Fjällgatan 32H",
            "981 39",
            "Kiruna",
        ])

    def testSocialMedia(self) -> None:
        self.assertInAll([
            "https://facebook.com/ntiuppsala",
            "https://instagram.com/ntiuppsala",
            "https://x.com/ntiuppsala",
        ])

    def testOpeningHours(self) -> None:
        self.assertInAll([
            "Måndag - fredag",
            "10:00 - 16:00",
            "Lördag",
            "12:00 - 15:00",
            "Söndag",
            "Stängt",
        ])


if __name__ == "__main__":
    unittest.main(verbosity=2)
