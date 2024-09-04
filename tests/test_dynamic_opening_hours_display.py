import unittest
from utils import *


class TestOpeningHours(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

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
        self.assertInAll(expected)

    # tests
    def testWeekdays(self) -> None:
        # monday before opening. we expect the opening time to show
        self.setAndTestTime(2024, 9, 2, 7, 58, expected=["stängt", "10:00"])
        
        # monday after opening. we expect the closing time to show
        self.setAndTestTime(2024, 9, 2, 12, 37, expected=["öppet", "16:00"])
        
        # monday after closing
        self.setAndTestTime(2024, 12, 23, 17, 37, expected=["stängt", "öppnar", "tisdag", "10:00"])

        # friday before opening

        # friday after opening
        
        # friday after closing
        
        # saturday before opening
        
        # saturday after opening
        
        # saturday after closing
        
        # sunday before opening
        
        # sunday after opening
        
        # sunday after closing

if __name__ == "__main__":
    unittest.main(verbosity=2)
