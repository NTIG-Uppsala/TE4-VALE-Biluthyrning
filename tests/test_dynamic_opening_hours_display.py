import unittest
from utils import *


class TestOpeningHours(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

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
        self.assertTextInAll(expected)

    # tests
    def testWeekdays(self) -> None:
        # monday before opening. we expect the opening time to show
        self.setAndTestTime(2024, 9, 2, 9, 58, expected=["öppnar", "10:00"])

        # monday after opening. we expect the closing time to show
        self.setAndTestTime(2024, 9, 2, 12, 37, expected=["öppet", "16:00"])

        # monday after closing
        self.setAndTestTime(2024, 9, 2, 16, 1, expected=["stängt", "öppnar", "tisdag", "10:00"])

        # friday before opening
        self.setAndTestTime(2024, 9, 6, 9, 58, expected=["öppnar", "10:00"])

        # friday after opening
        self.setAndTestTime(2024, 9, 6, 12, 37, expected=["öppet", "16:00"])

        # friday after closing
        self.setAndTestTime(2024, 9, 6, 16, 1, expected=["stängt", "öppnar", "lördag", "12:00"])

        # saturday before opening
        self.setAndTestTime(2024, 9, 7, 11, 58, expected=["öppnar", "12:00"])

        # saturday after opening
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
