import unittest
from playwright.sync_api import sync_playwright
from os import path, getcwd


class TestHemsida(unittest.TestCase):

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
        # Adjust path to index.html if necessary
        self.page.goto(f"file://{path.join(getcwd(), 'index.html')}")

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
