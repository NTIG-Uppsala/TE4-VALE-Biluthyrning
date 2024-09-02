import unittest
from playwright.sync_api import sync_playwright
from os import path

class TestIndex(unittest.TestCase):
    """
    TestIndex class contains unit tests for the index page of the NTB Biluthyrning website.
    Methods:
    - setUpClass: Set up the test class by launching the browser and creating a new page.
    - tearDownClass: Tear down the test class by closing the browser and stopping the playwright.
    - setUp: Set up each individual test by navigating to the index.html page and waiting for a specific selector to be attached.
    - tearDown: Tear down each individual test by navigating to about:blank.
    - helpSetCustomTime: Helper method to set a custom time for testing purposes.
    - helpTestMultiple: Helper method to test multiple matches in the page content.
    - helpTestCustomTime: Helper method to test custom time matches in the page content.
    - testBrowserExists: Test if the browser exists.
    - testPageExists: Test if the page has completed loading.
    - testName: Test if the page content contains the name "NTB Biluthyrning".
    - testPhoneNumber: Test if the page content contains the phone number.
    - testEmail: Test if the page content contains the email address.
    - testAddress: Test if the page content contains the address.
    - testSocialMedia: Test if the page content contains the social media links.
    - testOpeningHours: Test if the page content contains the opening hours.
    - testHolidays: Test if the page content contains the holidays.
    - testJsCompleted: Test if the JavaScript for checking opening hours completion is present.
    - testNoMissing: Test if the page content does not contain the word "Missing".
    - testChristmasEve: Test the opening hours on Christmas Eve.
    - testChristmasDay: Test the opening hours on Christmas Day.
    - testBoxingDay: Test the opening hours on Boxing Day.
    - testAfternoonBeforeNewYear: Test the opening hours on the afternoon before New Year's Day.
    - testNewYear: Test the opening hours on New Year's Eve.
    - testNewYearDay: Test the opening hours on New Year's Day.
    - testEpiphany: Test the opening hours on Epiphany.
    - testFirstOfMay: Test the opening hours on the first of May.
    - testNationalDay: Test the opening hours on National Day.
    - testMonday: Test the opening hours on a Monday.
    - testTuesday: Test the opening hours on a Tuesday.
    - testWednesday: Test the opening hours on a Wednesday.
    - testThursday: Test the opening hours on a Thursday.
    - testFriday: Test the opening hours on a Friday.
    - testSaturday: Test the opening hours on a Saturday.
    - testSunday: Test the opening hours on a Sunday.
    - testZIPCode: Test the ZIP code input functionality.
    """

    @classmethod
    def setUpClass(self: "TestIndex") -> None:
        self.playwright = sync_playwright().start()
        browser_type = self.playwright.chromium
        launch_options = {"headless": True}
        self.browser = browser_type.launch(**launch_options)
        self.context = self.browser.new_context()
        self.page = self.context.new_page()

    @classmethod
    def tearDownClass(self: "TestIndex") -> None:
        self.context.close()
        self.browser.close()
        self.playwright.stop()

    def setUp(self: "TestIndex") -> None:
        self.page.goto(f"file://{path.abspath(path.join(path.dirname(__file__), "..", "index.html"))}")
        self.page.wait_for_selector("#checkOpeningHoursJsCompleted", state="attached")

    def tearDown(self: "TestIndex") -> None:
        self.page.goto("about:blank")

    def helpSetCustomTime(
        self: "TestIndex", year: int, month: int, day: int, hour: int
    ) -> None:
        self.page.evaluate(
            f"""
            now.setFullYear({year}, {month - 1}, {day});
            now.setHours({hour});
            refreshDynamicOpenStatus();
        """
        )

    def helpTestMultiple(self: "TestIndex", matches: list[str]) -> None:
        for match in matches:
            self.assertIn(match, self.page.content())

    def helpTestCustomTime(
        self: "TestIndex",
        year: int,
        month: int,
        day: int,
        hour: int,
        matches: list[str],
    ) -> None:
        self.helpSetCustomTime(year, month, day, hour)
        self.helpTestMultiple(matches)

    def testBrowserExists(self: "TestIndex") -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self: "TestIndex") -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testName(self: "TestIndex") -> None:
        self.assertIn("NTB Biluthyrning", self.page.content())

    def testPhoneNumber(self: "TestIndex") -> None:
        self.assertIn("+46&nbsp;63‑055&nbsp;55&nbsp;55", self.page.content())

    def testEmail(self: "TestIndex") -> None:
        self.assertIn("info@ntbhyr.se", self.page.content())

    def testAddress(self: "TestIndex") -> None:
        self.helpTestMultiple(
            [
                "Fjällgatan 32H",
                "981 39",
                "Kiruna",
            ]
        )

    def testSocialMedia(self: "TestIndex") -> None:
        self.helpTestMultiple(
            [
                "https://facebook.com/ntiuppsala",
                "https://instagram.com/ntiuppsala",
                "https://x.com/ntiuppsala",
            ]
        )

    def testOpeningHours(self: "TestIndex") -> None:
        self.helpTestMultiple(
            [
                "Måndag - fredag",
                "10-16",
                "Lördag",
                "12-15",
                "Söndag",
                "Stängt",
            ]
        )

    def testHolidays(self: "TestIndex") -> None:
        self.helpTestMultiple(
            [
                "1 januari",
                "6 januari",
                "1 maj",
                "6 juni",
                "24 december",
                "25 december",
                "26 december",
                "31 december",
            ]
        )

    def testJsCompleted(self: "TestIndex") -> None:
        self.assertIsNotNone(self.page.query_selector("#checkOpeningHoursJsCompleted"))

    def testNoMissing(self: "TestIndex") -> None:
        self.assertNotIn("Missing", self.page.content())

    def testChristmasEve(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 12, 24, 12, ["Julafton", "fredag", "10:00"])

    def testChristmasDay(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 12, 25, 12, ["Juldagen", "fredag", "10:00"])

    def testBoxingDay(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 12, 26, 12, ["Annandag jul", "fredag", "10:00"])

    def testAfternoonBeforeNewYear(self: "TestIndex") -> None:
        self.helpTestCustomTime(
            2024, 12, 30, 17, ["stängt", "öppnar", "torsdag", "10:00"]
        )

    def testNewYear(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 12, 31, 12, ["Nyårsafton", "torsdag", "10:00"])

    def testNewYearDay(self: "TestIndex") -> None:
        self.helpTestCustomTime(2025, 1, 1, 12, ["Nyårsdagen", "torsdag", "10:00"])

    def testEpiphany(self: "TestIndex") -> None:
        self.helpTestCustomTime(2025, 1, 6, 12, ["Tretton", "tisdag", "10:00"])

    def testFirstOfMay(self: "TestIndex") -> None:
        self.helpTestCustomTime(2025, 5, 1, 12, ["Första maj", "fredag", "10:00"])

    def testNationalDay(self: "TestIndex") -> None:
        self.helpTestCustomTime(2025, 6, 6, 12, ["Nationaldagen", "lördag", "12:00"])

    def testMonday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 8, 26, 9, ["öppnar", "10:00", "idag"])
        self.helpTestCustomTime(2024, 8, 26, 12, ["öppet", "stänger", "16:00"])
        self.helpTestCustomTime(
            2024, 8, 26, 17, ["stängt", "öppnar", "tisdag", "10:00"]
        )

    def testTuesday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 8, 27, 9, ["öppnar", "10:00", "idag"])
        self.helpTestCustomTime(2024, 8, 27, 12, ["öppet", "stänger", "16:00"])
        self.helpTestCustomTime(
            2024, 8, 27, 17, ["stängt", "öppnar", "onsdag", "10:00"]
        )

    def testWednesday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 8, 28, 9, ["öppnar", "10:00", "idag"])
        self.helpTestCustomTime(2024, 8, 28, 12, ["öppet", "stänger", "16:00"])
        self.helpTestCustomTime(
            2024, 8, 28, 17, ["stängt", "öppnar", "torsdag", "10:00"]
        )

    def testThursday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 8, 29, 9, ["öppnar", "10:00", "idag"])
        self.helpTestCustomTime(2024, 8, 29, 12, ["öppet", "stänger", "16:00"])
        self.helpTestCustomTime(
            2024, 8, 29, 17, ["stängt", "öppnar", "fredag", "10:00"]
        )

    def testFriday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 8, 30, 9, ["öppnar", "10:00", "idag"])
        self.helpTestCustomTime(2024, 8, 30, 12, ["öppet", "stänger", "16:00"])
        self.helpTestCustomTime(
            2024, 8, 30, 17, ["stängt", "öppnar", "lördag", "12:00"]
        )

    def testSaturday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 8, 31, 9, ["öppnar", "12:00", "idag"])
        self.helpTestCustomTime(2024, 8, 31, 12, ["öppet", "stänger", "15:00"])
        self.helpTestCustomTime(
            2024, 8, 31, 17, ["stängt", "öppnar", "måndag", "10:00"]
        )

    def testSunday(self: "TestIndex") -> None:
        self.helpTestCustomTime(2024, 9, 1, 9, ["stängt", "öppnar", "måndag", "10:00"])
        self.helpTestCustomTime(2024, 9, 1, 12, ["stängt", "öppnar", "måndag", "10:00"])
        self.helpTestCustomTime(2024, 9, 1, 17, ["stängt", "öppnar", "måndag", "10:00"])

    def testZIPCode(self: "TestIndex") -> None:
        zip_input = self.page.query_selector(".delivery-section>.input-container>input")
        zip_button = self.page.query_selector(".delivery-section>.input-container>button")
        zip_output = self.page.query_selector("#delivery-status-tag")
        available_zips = [
            "98138",
            "98140",
            "98141",
            "98144",
            "98145",
            "98146",
            "98147",
        ]
        self.assertIsNotNone(zip_input)
        self.assertIsNotNone(zip_button)
        self.assertIsNotNone(zip_output)
        self.assertEqual("", zip_input.input_value())
        self.assertNotEqual("", zip_output.text_content())
        zip_input.fill("74431")
        zip_button.click()
        self.assertIn("levererar inte", zip_output.text_content())
        zip_input.fill("9814")
        zip_button.click()
        self.assertIn("5", zip_output.text_content())
        zip_input.fill("")
        zip_button.click()
        self.assertIn("ange ett postnummer", zip_output.text_content())
        for zip_code in available_zips:
            zip_input.fill(zip_code)
            zip_button.click()
            self.assertIn("levererar till", zip_output.text_content())

if __name__ == "__main__":
    unittest.main(verbosity=2)
