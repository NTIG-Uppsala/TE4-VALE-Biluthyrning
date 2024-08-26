import unittest
from playwright.sync_api import sync_playwright
from os import path, getcwd


class TestIndex(unittest.TestCase):
    """
    TestIndex class contains unit tests for the index.html page of the NTB Biluthyrning website.
    Methods:
    - setUpClass: Set up the test class by launching the browser and creating a new page.
    - tearDownClass: Tear down the test class by closing the context, browser, and playwright.
    - setUp: Set up each individual test by navigating to the index.html page and waiting for a specific selector.
    - tearDown: Tear down each individual test by navigating to a blank page.
    - set_custom_date: Set a custom date in the page's JavaScript environment.
    - set_custom_time: Set a custom time in the page's JavaScript environment.
    - testBrowserExists: Test if the page object is not None.
    - testPageExists: Test if the document's readyState is "complete".
    - testName: Test if the page content contains the name "NTB Biluthyrning".
    - testPhoneNumber: Test if the page content contains the phone number "0630-55 55 55".
    - testEmail: Test if the page content contains the email address "info@ntbhyr.se".
    - testAddress: Test if the page content contains the address "Fjällgatan 32H", postal code "98139", and city "Kiruna".
    - testSocialMedia: Test if the page content contains the social media links for Facebook, Instagram, and X.
    - testOpeningHours: Test if the page content contains the opening hours for each day of the week.
    - testHolidays: Test if the page content contains the holidays.
    - testJsCompleted: Test if the page contains an element with the id "checkOpeningHoursJsCompleted".
    - testNoMissing: Test if the page content does not contain the word "Missing".
    - testSpecificDates: Test specific dates and check if the page content reflects the expected information.
    - testSpecificTimes: Test specific times and check if the page content reflects the expected information.
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
        self.page.wait_for_selector("#checkOpeningHoursJsCompleted", state="attached")

    def tearDown(self):
        self.page.goto("about:blank")

    def set_custom_date(self, year, month, day):
        self.page.evaluate(
            f"""
            now.setFullYear({year}, {month - 1}, {day});            
            refreshDynamicOpenStatus();
        """
        )

    def set_custom_time(self, hours):
        self.page.evaluate(
            f"""
            now.setHours({hours});            
            refreshDynamicOpenStatus();
        """
        )

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

    def testJsCompleted(self):
        self.assertIsNotNone(self.page.query_selector("#checkOpeningHoursJsCompleted"))

    def testNoMissing(self):
        self.assertNotIn("Missing", self.page.content())

    def testSpecificDates(self):
        self.set_custom_date(2024, 12, 24)
        self.assertIn("Julafton", self.page.content())
        self.assertIn("fredag kl. 10:00", self.page.content())
        self.set_custom_date(2024, 9, 1)
        self.assertIn("Vi har stängt idag.", self.page.content())

    def testSpecificTimes(self):
        self.set_custom_date(2024, 8, 26)
        self.set_custom_time(9)
        self.assertIn("öppnar kl. 10:00 idag", self.page.content())
        self.set_custom_time(12)
        self.assertIn("öppet nu", self.page.content())
        self.assertIn("stänger kl. 16:00", self.page.content())
        self.set_custom_time(17)
        self.assertIn("stängt för dagen", self.page.content())
        self.assertIn("öppnar igen", self.page.content())
        self.assertIn("tisdag kl. 10:00", self.page.content())

    def testTemporaryRedTest(self):
        self.set_custom_date(2024, 12, 24)
        self.assertIn("öppet nu", self.page.content())


if __name__ == "__main__":
    unittest.main(verbosity=2)
