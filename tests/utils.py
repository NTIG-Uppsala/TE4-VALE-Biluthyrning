import unittest
import datetime
import dotenv
import re
from playwright.sync_api import sync_playwright
from os import path


#
#  Test class template
#
class TemplateTest(unittest.TestCase):
    @classmethod
    def setUpClass(self) -> None:
        self.playwright = sync_playwright().start()
        browserType = self.playwright.chromium
        launchOptions = {"headless": True}
        self.browser = browserType.launch(**launchOptions)
        contextOptions = {"locale": "sv"}
        self.context = self.browser.new_context(**contextOptions)
        self.page = self.context.new_page()

    @classmethod
    def tearDownClass(self) -> None:
        self.context.close()
        self.browser.close()
        self.playwright.stop()

    def setUp(self) -> None:
        self.page.goto("http://localhost:4000/")

        # a certain js script loads last and makes this element
        # so we check for it to make sure other scripts have loaded
        self.page.wait_for_selector("#checkJsCompleted", state="attached")

    def tearDown(self) -> None:
        self.page.goto("about:blank")

    # ------------------------------
    # Helper functions
    # ------------------------------

    # Sets the time by generating a timestamp and setting it as a query parameter which the server reads and sets the time to
    def setTime(self, year: int, month: int, day: int, hour: int, minute: int) -> None:

        # Generates a string in unix epoch milliseconds for the given time
        time = str(int(datetime.datetime(year, month, day, hour, minute, tzinfo=datetime.datetime.now().astimezone().tzinfo).timestamp()) * 1000)
    
        # Get the debug key from the .env file
        debugKey = dotenv.get_key(path.join(path.dirname(__file__), "..", ".env"), "DEBUG_KEY")
        self.page.goto(f"http://localhost:4000/?debugTime={time}&debugKey={debugKey}")
        self.page.wait_for_selector("#checkJsCompleted", state="attached")

    # Sets the time and checks for the expected text content
    def setAndTestTime(self, year: int, month: int, day: int, hour: int, minute: int, expected: list[str]) -> None:
        self.setTime(year, month, day, hour, minute)
        self.assertInAllTextContent(expected)

    # run assertIn for every string in the list
    def assertInAll(self, matches: list[str]) -> None:
        for match in matches:
            self.assertIn(match, self.page.content())

    # run assertIn for every string in the list for the visible text
    def assertInAllTextContent(self, matches: list[str]) -> None:
        for match in matches:
            self.assertIn(match, self.page.text_content("body"))

    # run assertIn for the visible text
    def assertInTextContent(self, match: str) -> None:
        self.assertIn(match, self.page.text_content("body"))
