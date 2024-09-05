import unittest
from utils import *


class TestHolidays(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if (self.__class__.__name__ == "TestName"):
            self.fail("Test class name is not correct")

    # helpers
    def setPageTimeTo(self, year: int, month: int, day: int, hour: int, minute: int) -> None:
        self.page.evaluate(f"""
            now.setFullYear({year}, {month - 1}, {day});
            now.setHours({hour});
            now.setMinutes({minute});
            refreshDynamicOpenStatus();
        """)

    def setAndTestTime(self, year: int, month: int, day: int, hour: int, minute: int, expected: list[str]) -> None:
        self.setPageTimeTo(year, month, day, hour, minute)
        self.assertTextInAll(expected)

    # tests
    def testHolidays(self) -> None:
        self.setAndTestTime(2024, 12, 24, 12, 37, ["Julafton", "fredag", "10:00"])
        self.setAndTestTime(2024, 12, 25, 12, 37, ["Juldagen", "fredag", "10:00"])
        self.setAndTestTime(2024, 12, 26, 12, 37, ["Annandag jul", "fredag", "10:00"])
        self.setAndTestTime(2024, 12, 30, 17, 37, ["stängt", "öppnar", "torsdag", "10:00"])
        self.setAndTestTime(2024, 12, 31, 12, 37, ["Nyårsafton", "torsdag", "10:00"])
        self.setAndTestTime(2025, 1, 1, 12, 37, ["Nyårsdagen", "torsdag", "10:00"])
        self.setAndTestTime(2025, 1, 6, 12, 37, ["Tretton", "tisdag", "10:00"])
        self.setAndTestTime(2025, 5, 1, 12, 37, ["Första maj", "fredag", "10:00"])
        self.setAndTestTime(2025, 6, 6, 12, 37, ["Nationaldagen", "lördag", "12:00"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
