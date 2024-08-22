from unittest import TestCase, main

from selenium import webdriver

from selenium.webdriver.chrome.options import Options

from os import path


class TestHemsida(TestCase):

    keepBrowserAlive = False
    hiddenWindow = True

    # setUpClass runs BEFORE FIRST test
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()

        chrome_options.add_argument("--disable-search-engine-choice-screen")

        if cls.keepBrowserAlive:

            chrome_options.add_experimental_option("detach", True)

        if cls.hiddenWindow:

            chrome_options.add_argument("--headless")

        cls.browser = webdriver.Chrome(options=chrome_options)

    # tearDownClass runs AFTER LAST test
    @classmethod
    def tearDownClass(cls):

        pass

    # setUp runs BEFORE EACH test
    def setUp(self):
        self.browser.get(path.join(path.dirname(__file__), '../index.html'))
        pass

    # tearDown runs AFTER EACH test
    def tearDown(self):

        # go to about:blank to clear the page
        self.browser.get('about:blank')

    # tests:
    def testName(self):
        self.assertIn("======Missing======", self.browser.page_source)

    def testPhoneNumber(self):
        self.assertIn("======Missing======", self.browser.page_source)

    def testEmail(self):
        self.assertIn("======Missing======", self.browser.page_source)

    def testAddress(self):
        self.assertIn("======Missing======", self.browser.page_source)

    def testSocialMedia(self):
        self.assertIn("======Missing======", self.browser.page_source)

    def testOpeningHours(self):
        self.assertIn("======Missing======", self.browser.page_source)


# in case this file is run directly this runs the tests
if __name__ == '__main__':
    main(verbosity=2)
