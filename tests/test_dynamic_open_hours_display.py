import unittest
import datetime
from utils import *


class TestOpenHours(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="public/se/kiruna/index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # helpers
    def setPageTimeTo(self, year: int, month: int, day: int, hour: int, minute: int) -> None:
        self.page.evaluate(
            f"""
            now.setFullYear({year}, {month - 1}, {day});
            now.setHours({hour});
            now.setMinutes({minute});
            refreshDynamicOpenStatus();
        """
        )

    def setAndTestTime(self, year: int, month: int, day: int, hour: int, minute: int, expected: list[str]) -> None:
        self.setPageTimeTo(year, month, day, hour, minute)
        self.assertInAllTextContent(expected)
    
    def currentYear(self) -> int:
        return datetime.datetime.now().year

    # tests
    def testWeekdays(self) -> None:
        openAtHourWeekdays = ""
        openAtHourSaturday = ""
        if datetime.datetime.now().month == 7:
            openAtHourWeekdays = "12:00"
            openAtHourSaturday = "12:00"
        else:
            openAtHourWeekdays = "10:00"
            openAtHourSaturday = "10:00"

        # monday before open. we expect the open time to show
        self.setAndTestTime(self.currentYear(), 9, 2, 9, 58, expected=["öppnar", openAtHourWeekdays])

        # monday after open. we expect the closing time to show
        self.setAndTestTime(self.currentYear(), 9, 2, 12, 37, expected=["öppet", "16:00"])

        # monday after closing
        self.setAndTestTime(self.currentYear(), 9, 2, 16, 1, expected=["stängt", "öppnar", "tisdag", openAtHourWeekdays])

        # friday before open
        self.setAndTestTime(self.currentYear(), 9, 6, 9, 58, expected=["öppnar", openAtHourWeekdays])

        # friday after open
        self.setAndTestTime(self.currentYear(), 9, 6, 12, 37, expected=["öppet", "16:00"])

        # friday after closing
        self.setAndTestTime(self.currentYear(), 9, 6, 16, 1, expected=["stängt", "öppnar", "lördag", openAtHourSaturday])

        # saturday before open
        self.setAndTestTime(self.currentYear(), 9, 7, 10, 58, expected=["öppnar", openAtHourSaturday])

        # saturday after open
        self.setAndTestTime(self.currentYear(), 9, 7, 12, 37, expected=["öppet", "15:00"])

        # saturday after closing
        self.setAndTestTime(self.currentYear(), 9, 7, 15, 1, expected=["stängt", "öppnar", "måndag", openAtHourWeekdays])

        # sunday early morning
        self.setAndTestTime(self.currentYear(), 9, 8, 7, 58, expected=["stängt", "öppnar", "måndag", openAtHourWeekdays])

        # sunday mid day
        self.setAndTestTime(self.currentYear(), 9, 8, 13, 37, expected=["stängt", "öppnar", "måndag", openAtHourWeekdays])

        # sunday late
        self.setAndTestTime(self.currentYear(), 9, 8, 23, 59, expected=["stängt", "öppnar", "måndag", openAtHourWeekdays])


if __name__ == "__main__":
    unittest.main(verbosity=2)
