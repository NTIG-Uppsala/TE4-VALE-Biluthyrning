import unittest
from playwright.sync_api import sync_playwright
from os import path, getcwd


class TestIndex(unittest.TestCase):
    """
    TestIndex class for testing the index.html page.
    Methods:
    - setUpClass: Set up the test class by launching the browser and creating a new page.
    - tearDownClass: Tear down the test class by closing the browser and stopping the playwright.
    - setUp: Set up the test case by navigating to the index.html page and waiting for certain elements to load.
    - tearDown: Tear down the test case by navigating to a blank page.
    - testBrowserExists: Test if the page object is not None.
    - testPageExists: Test if the document is in a complete state.
    - testName: Test if the page content contains the name "NTB Biluthyrning".
    - testPhoneNumber: Test if the page content contains the phone number "0630-55 55 55".
    - testEmail: Test if the page content contains the email address "info@ntbhyr.se".
    - testAddress: Test if the page content contains the address "Fjällgatan 32H", postal code "98139", and city "Kiruna".
    - testSocialMedia: Test if the page content contains the social media links for Facebook, Instagram, and X.
    - testOpeningHours: Test if the page content contains the opening hours for each day of the week.
    - testHolidays: Test if the page content contains the holidays.
    - testNoMissing: Test if the page content does not contain the word "Missing".
    """

    keepBrowserAlive = False
    hiddenWindow = True

    @classmethod
    def setUpClass(self):
        self.playwright = sync_playwright().start()
        browser_type = self.playwright.chromium
        launch_options = {"headless": self.hiddenWindow}
        self.browser = browser_type.launch(**launch_options)
        self.context = self.browser.new_context()
        self.page = self.context.new_page()

    @classmethod
    def tearDownClass(self):
        self.context.close()
        self.browser.close()
        self.playwright.stop()

    def setUp(self):
        self.page.goto(f"file://{path.join(getcwd(), 'index.html')}")
        self.page.add_init_script(path=path.join(getcwd(), "js/index.js"))
        # self.page.wait_for_function(
        #     "document.querySelector('.insert-open-hours-in').innerHTML.trim().length > 0"
        # )

    def tearDown(self):
        self.page.goto("about:blank")

    def testBrowserExists(self):
        self.assertIsNotNone(self.page)

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
        self.assertIn("Söndagar Stängt", self.page.content())
        self.assertIn("Måndagar 10:00 - 16:00", self.page.content())
        self.assertIn("Tisdagar 10:00 - 16:00", self.page.content())
        self.assertIn("Onsdagar 10:00 - 16:00", self.page.content())
        self.assertIn("Torsdagar 10:00 - 16:00", self.page.content())
        self.assertIn("Fredagar 10:00 - 16:00", self.page.content())
        self.assertIn("Lördagar 12:00 - 15:00", self.page.content())

    def testHolidays(self):
        self.assertIn("1 Januari", self.page.content())
        self.assertIn("6 Januari", self.page.content())
        self.assertIn("1 Maj", self.page.content())
        self.assertIn("6 Juni", self.page.content())
        self.assertIn("24 December", self.page.content())
        self.assertIn("25 December", self.page.content())
        self.assertIn("26 December", self.page.content())
        self.assertIn("31 December", self.page.content())

    def testNoMissing(self):
        self.assertNotIn("Missing", self.page.content())


if __name__ == "__main__":
    unittest.main(verbosity=2)
