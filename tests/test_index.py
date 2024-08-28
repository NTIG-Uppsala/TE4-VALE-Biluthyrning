import unittest
from playwright.sync_api import sync_playwright
from os import path, getcwd


class TestIndex(unittest.TestCase):
    """
    A test case class for testing the functionality of the index page.
    Methods:
    - setUpClass(self: "TestIndex") -> None: Set up the test class.
    - tearDownClass(self: "TestIndex") -> None: Tear down the test class.
    - setUp(self: "TestIndex") -> None: Set up the test method.
    - tearDown(self: "TestIndex") -> None: Tear down the test method.
    - helpSetCustomTime(self: "TestIndex", year: int, month: int, day: int, hour: int) -> None: Helper method to set a custom time.
    - helpTestMultiple(self: "TestIndex", matches: list[str]) -> None: Helper method to test multiple matches.
    - helpTestCustomTime(self: "TestIndex", year: int, month: int, day: int, hour: int, matches: list[str]) -> None: Helper method to test custom time.
    - testBrowserExists(self: "TestIndex") -> None: Test if the browser exists.
    - testPageExists(self: "TestIndex") -> None: Test if the page exists.
    - testName(self: "TestIndex") -> None: Test the name on the page.
    - testPhoneNumber(self: "TestIndex") -> None: Test the phone number on the page.
    - testEmail(self: "TestIndex") -> None: Test the email on the page.
    - testAddress(self: "TestIndex") -> None: Test the address on the page.
    - testSocialMedia(self: "TestIndex") -> None: Test the social media links on the page.
    - testOpeningHours(self: "TestIndex") -> None: Test the opening hours on the page.
    - testHolidays(self: "TestIndex") -> None: Test the holidays on the page.
    - testJsCompleted(self: "TestIndex") -> None: Test if the JavaScript is completed on the page.
    - testNoMissing(self: "TestIndex") -> None: Test if there are no missing elements on the page.
    - testChristmasEve(self: "TestIndex") -> None: Test the behavior on Christmas Eve.
    - testChristmasDay(self: "TestIndex") -> None: Test the behavior on Christmas Day.
    - testBoxingDay(self: "TestIndex") -> None: Test the behavior on Boxing Day.
    - testAfternoonBeforeNewYear(self: "TestIndex") -> None: Test the behavior on the afternoon before New Year.
    - testNewYear(self: "TestIndex") -> None: Test the behavior on New Year's Eve.
    - testNewYearDay(self: "TestIndex") -> None: Test the behavior on New Year's Day.
    - testEpiphany(self: "TestIndex") -> None: Test the behavior on Epiphany.
    - testFirstOfMay(self: "TestIndex") -> None: Test the behavior on the first of May.
    - testNationalDay(self: "TestIndex") -> None: Test the behavior on National Day.
    - testMonday(self: "TestIndex") -> None: Test the behavior on a Monday.
    - testTuesday(self: "TestIndex") -> None: Test the behavior on a Tuesday.
    - testWednesday(self: "TestIndex") -> None: Test the behavior on a Wednesday.
    - testThursday(self: "TestIndex") -> None: Test the behavior on a Thursday.
    - testFriday(self: "TestIndex") -> None: Test the behavior on a Friday.
    - testSaturday(self: "TestIndex") -> None: Test the behavior on a Saturday.
    - testSunday(self: "TestIndex") -> None: Test the behavior on a Sunday.
    - testZIPCode(self: "TestIndex") -> None: Test the ZIP code functionality on the page.
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
        self.page.goto(f"file://{path.join(getcwd(), 'index.html')}")
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
                "Söndagar Stängt",
                "Måndagar 10:00 - 16:00",
                "Tisdagar 10:00 - 16:00",
                "Onsdagar 10:00 - 16:00",
                "Torsdagar 10:00 - 16:00",
                "Fredagar 10:00 - 16:00",
                "Lördagar 12:00 - 15:00",
            ]
        )

    def testHolidays(self: "TestIndex") -> None:
        self.helpTestMultiple(
            [
                "1 Januari",
                "6 Januari",
                "1 Maj",
                "6 Juni",
                "24 December",
                "25 December",
                "26 December",
                "31 December",
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
        zip_input = self.page.query_selector("#zip-input")
        zip_button = self.page.query_selector("#zip-button")
        zip_output = self.page.query_selector("#zip-response")
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
        self.assertEqual("", zip_output.text_content())
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
