import unittest
import datetime
import dotenv
from os import path
from utils import *


class TestOpenHours(TemplateTest):
    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # helpers
    def setPageTimeTo(self, year: int, month: int, day: int, hour: int, minute: int) -> None:
        pass        

    def setAndTestTime(self, year: int, month: int, day: int, hour: int, minute: int, expected: list[str]) -> None:
        # Convert the given time to unix time
        time = str(int(datetime.datetime(year, month, day, hour, minute, tzinfo=datetime.datetime.now().astimezone().tzinfo).timestamp()) * 1000)
        debugKey = dotenv.get_key(path.join(path.dirname(__file__), "..", ".env"), "DEBUG_KEY")
        self.page.goto(f"http://localhost:4000/?debugTime={time}&debugKey={debugKey}")
        self.page.wait_for_selector("#checkJsCompleted", state="attached")
        self.assertInAllTextContent(expected)

    def currentYear(self) -> int:
        return datetime.datetime.now().year

    # tests
    def testWeekdays(self) -> None:
        # monday before open. we expect the open time to show
        self.setAndTestTime(2024, 9, 2, 9, 58, expected=["öppnar", "10:00"])

        # monday after open. we expect the closing time to show
        self.setAndTestTime(2024, 9, 2, 12, 37, expected=["öppet", "16:00"])

        # monday after closing
        self.setAndTestTime(2024, 9, 2, 16, 1, expected=["stängt", "öppnar", "tisdag", "10:00"])

        # friday before open
        self.setAndTestTime(2024, 9, 6, 9, 58, expected=["öppnar", "10:00"])

        # friday after open
        self.setAndTestTime(2024, 9, 6, 12, 37, expected=["öppet", "16:00"])

        # friday after closing
        self.setAndTestTime(2024, 9, 6, 16, 1, expected=["stängt", "öppnar", "lördag", "11:00"])

        # saturday before open
        self.setAndTestTime(2024, 9, 7, 10, 58, expected=["öppnar", "11:00"])

        # saturday after open
        self.setAndTestTime(2024, 9, 7, 12, 37, expected=["öppet", "15:00"])

        # saturday after closing
        self.setAndTestTime(2024, 9, 7, 15, 1, expected=["stängt", "öppnar", "måndag", "10:00"])

        # sunday early morning
        self.setAndTestTime(2024, 9, 8, 7, 58, expected=["stängt", "öppnar", "måndag", "10:00"])

        # sunday mid day
        self.setAndTestTime(2024, 9, 8, 13, 37, expected=["stängt", "öppnar", "måndag", "10:00"])

        # sunday late
        self.setAndTestTime(2024, 9, 8, 23, 59, expected=["stängt", "öppnar", "måndag", "10:00"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
