from unittest import TestCase, main
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from os import path


class TestHemsida(TestCase):

    keepBrowserAlive = False
    hiddenWindow = True

    @classmethod
    def setUpClass(cls):
        firefox_options = Options()
        if cls.hiddenWindow:
            firefox_options.add_argument("--headless")
        cls.browser = webdriver.Firefox(options=firefox_options)

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()

    def setUp(self):
        self.browser.get(path.join(path.dirname(__file__), "../index.html"))

    def tearDown(self):
        self.browser.get("about:blank")

    def testBrowserExists(self):
        self.assertIsNotNone(self.browser)

    def testPageExists(self):
        self.assertEqual(
            "complete", self.browser.execute_script("return document.readyState")
        )

    def testName(self):
        self.assertIn("NTB Biluthyrning", self.browser.page_source)

    def testPhoneNumber(self):
        self.assertIn("0630-55 55 55", self.browser.page_source)

    def testEmail(self):
        self.assertIn("info@ntbhyr.se", self.browser.page_source)

    def testAddress(self):
        self.assertIn("Fjällgatan 32H", self.browser.page_source)
        self.assertIn("98139", self.browser.page_source)
        self.assertIn("Kiruna", self.browser.page_source)

    def testSocialMedia(self):
        self.assertIn("https://facebook.com/ntiuppsala", self.browser.page_source)
        self.assertIn("https://instagram.com/ntiuppsala", self.browser.page_source)
        self.assertIn("https://x.com/ntiuppsala", self.browser.page_source)

    def testOpeningHours(self):
        self.assertIn("Måndagar 10-16", self.browser.page_source)
        self.assertIn("Tisdagar 10-16", self.browser.page_source)
        self.assertIn("Onsdagar 10-16", self.browser.page_source)
        self.assertIn("Torsdagar 10-16", self.browser.page_source)
        self.assertIn("Fredagar 10-16", self.browser.page_source)
        self.assertIn("Lördagar 12-15", self.browser.page_source)
        self.assertIn("Söndagar Stängt", self.browser.page_source)

    def testHolidays(self):
        self.assertIn("1 Januari", self.browser.page_source)
        self.assertIn("6 Januari", self.browser.page_source)
        self.assertIn("1 Maj", self.browser.page_source)
        self.assertIn("6 Juni", self.browser.page_source)
        self.assertIn("24 December", self.browser.page_source)
        self.assertIn("25 December", self.browser.page_source)
        self.assertIn("26 December", self.browser.page_source)
        self.assertIn("31 December", self.browser.page_source)


if __name__ == "__main__":
    main(verbosity=2)
