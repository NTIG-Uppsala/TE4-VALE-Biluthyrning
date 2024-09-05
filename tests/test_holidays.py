import unittest
import re
from utils import *


class TestHolidays(TemplateTest):
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

    def setTimeAndGetClosedDatesTable(self, year: int, month: int, day, hour: int, minute: int) -> list[list[str]]:
        self.setPageTimeTo(year, month, day, hour, minute)

        closed_dates_table = self.page.query_selector(".closed-dates-table").inner_html().split("</tr>")

        # Use regex to remove all HTML tags and strip whitespace
        closed_dates_table = [row.split("</td>") for row in closed_dates_table]
        closed_dates_table = [[re.sub(r"<.*?>", "", cell).strip() for cell in row] for row in closed_dates_table]

        # Remove empty cells and rows
        closed_dates_table = [[cell for cell in row if cell] for row in closed_dates_table]
        closed_dates_table = [row for row in closed_dates_table if row]

        return closed_dates_table

    # tests
    def testHolidays(self) -> None:
        self.setAndTestTime(2024, 12, 24, 12, 37, ["Julafton", "fredag", "10:00"])
        self.setAndTestTime(2024, 12, 25, 12, 37, ["Juldagen", "fredag", "10:00"])
        self.setAndTestTime(2024, 12, 26, 12, 37, ["Annandag jul", "fredag", "10:00"])
        self.setAndTestTime(2024, 12, 30, 17, 37, ["stängt", "öppnar", "torsdag", "10:00"])
        self.setAndTestTime(2024, 12, 31, 12, 37, ["Nyårsafton", "torsdag", "10:00"])
        self.setAndTestTime(2025, 1, 1, 12, 37, ["Nyårsdagen", "torsdag", "10:00"])
        self.setAndTestTime(2025, 1, 6, 12, 37, ["Trettondedag jul", "tisdag", "10:00"])
        self.setAndTestTime(2025, 5, 1, 12, 37, ["Första maj", "fredag", "10:00"])
        self.setAndTestTime(2025, 6, 6, 12, 37, ["Nationaldagen", "lördag", "12:00"])

    def testHolidaySortingChristmasEve(self) -> None:
        closed_dates_table = self.setTimeAndGetClosedDatesTable(2024, 12, 24, 19, 16)
        self.assertEqual(closed_dates_table[0][0], "24 december")
        self.assertEqual(closed_dates_table[0][1], "Julafton")
        self.assertEqual(closed_dates_table[0][2], "Stängt")

        self.assertEqual(closed_dates_table[3][0], "31 december")
        self.assertEqual(closed_dates_table[3][1], "Nyårsafton")
        self.assertEqual(closed_dates_table[3][2], "Stängt")

        self.assertEqual(closed_dates_table[7][0], "6 juni")
        self.assertEqual(closed_dates_table[7][1], "Nationaldagen")
        self.assertEqual(closed_dates_table[7][2], "Stängt")

    def testHolidaySortingNewYearsDay(self) -> None:
        closed_dates_table = self.setTimeAndGetClosedDatesTable(2025, 1, 1, 19, 16)
        self.assertEqual(closed_dates_table[0][0], "1 januari")
        self.assertEqual(closed_dates_table[0][1], "Nyårsdagen")
        self.assertEqual(closed_dates_table[0][2], "Stängt")

        self.assertEqual(closed_dates_table[2][0], "1 maj")
        self.assertEqual(closed_dates_table[2][1], "Första maj")
        self.assertEqual(closed_dates_table[2][2], "Stängt")

        self.assertEqual(closed_dates_table[6][0], "26 december")
        self.assertEqual(closed_dates_table[6][1], "Annandag jul")
        self.assertEqual(closed_dates_table[6][2], "Stängt")

    def testHolidaySortingNationalDay(self) -> None:
        closed_dates_table = self.setTimeAndGetClosedDatesTable(2025, 6, 6, 19, 16)
        self.assertEqual(closed_dates_table[0][0], "6 juni")
        self.assertEqual(closed_dates_table[0][1], "Nationaldagen")
        self.assertEqual(closed_dates_table[0][2], "Stängt")

        self.assertEqual(closed_dates_table[2][0], "25 december")
        self.assertEqual(closed_dates_table[2][1], "Juldagen")
        self.assertEqual(closed_dates_table[2][2], "Stängt")

        self.assertEqual(closed_dates_table[6][0], "6 januari")
        self.assertEqual(closed_dates_table[6][1], "Trettondedag jul")
        self.assertEqual(closed_dates_table[6][2], "Stängt")



if __name__ == "__main__":
    unittest.main(verbosity=2)
