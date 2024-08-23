import unittest
from playwright.sync_api import sync_playwright
from os import path, getcwd


class TestIndex(unittest.TestCase):
    """
    Test case for the TestIndex class.
    Methods:
    - setUpClass: Set up the test class by starting the playwright, launching the browser, and creating a new page.
    - tearDownClass: Tear down the test class by closing the context, browser, and stopping the playwright.
    - setUp: Set up the test method by navigating to the index.html file.
    - tearDown: Tear down the test method by navigating to about:blank.
    - testBrowserExists: Test if the page object is not None.
    - testPageExists: Test if the document.readyState is "complete".
    - testName: Test if "NTB Biluthyrning" is in the page content.
    - testPhoneNumber: Test if "0630-55 55 55" is in the page content.
    - testEmail: Test if "info@ntbhyr.se" is in the page content.
    - testAddress: Test if "Fjällgatan 32H", "98139", and "Kiruna" are in the page content.
    - testSocialMedia: Test if "https://facebook.com/ntiuppsala", "https://instagram.com/ntiuppsala", and "https://x.com/ntiuppsala" are in the page content.
    - testOpeningHours: Test if the opening hours are in the page content.
    - testHolidays: Test if the holidays are in the page content.
    """

    keepBrowserAlive = False
    hiddenWindow = True

    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        browser_type = cls.playwright.chromium
        launch_options = {"headless": cls.hiddenWindow}
        cls.browser = browser_type.launch(**launch_options)
        cls.context = cls.browser.new_context()
        cls.page = cls.context.new_page()

    @classmethod
    def tearDownClass(cls):
        cls.context.close()
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.page.goto(f"file://{path.join(getcwd(), 'index.html')}")

    def tearDown(self):
        self.page.goto("about:blank")

    def testBrowserExists(self):
        self.assertIsNotNone(self.page)
        # Fail test
        self.assertIsNone(self.page)

    def testPageExists(self):
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testName(self):
        self.assertIn("NTB Biluthyrning", self.page.content())

    def testPhoneNumber(self):
        self.assertIn("0630-55 55 55", self.page.content())

    def testEmail(self):
        self.assertIn("info@ntbhyr.se", self.page.content())

    def testAddress(self):
        self.assertIn("Fjällgatan 32H", self.page.content())
        self.assertIn("98139", self.page.content())
        self.assertIn("Kiruna", self.page.content())

    def testSocialMedia(self):
        self.assertIn("https://facebook.com/ntiuppsala", self.page.content())
        self.assertIn("https://instagram.com/ntiuppsala", self.page.content())
        self.assertIn("https://x.com/ntiuppsala", self.page.content())

    def testOpeningHours(self):
        self.assertIn("Måndagar 10-16", self.page.content())
        self.assertIn("Tisdagar 10-16", self.page.content())
        self.assertIn("Onsdagar 10-16", self.page.content())
        self.assertIn("Torsdagar 10-16", self.page.content())
        self.assertIn("Fredagar 10-16", self.page.content())
        self.assertIn("Lördagar 12-15", self.page.content())
        self.assertIn("Söndagar Stängt", self.page.content())

    def testHolidays(self):
        self.assertIn("1 Januari", self.page.content())
        self.assertIn("6 Januari", self.page.content())
        self.assertIn("1 Maj", self.page.content())
        self.assertIn("6 Juni", self.page.content())
        self.assertIn("24 December", self.page.content())
        self.assertIn("25 December", self.page.content())
        self.assertIn("26 December", self.page.content())
        self.assertIn("31 December", self.page.content())


if __name__ == "__main__":
    unittest.main(verbosity=2)
