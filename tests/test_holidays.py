import unittest
import re
from utils import *


class TestHolidays(TemplateTest):
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

    def setTimeAndGetClosedDatesTable(self, year: int, month: int, day: int, hour: int, minute: int) -> list[list[str]]:
        self.setPageTimeTo(year, month, day, hour, minute)

        closedDatesTable = self.page.query_selector(".closed-dates-table").inner_html().split("</tr>")

        # Use regex to remove all HTML tags and strip whitespace
        closedDatesTable = [row.split("</td>") for row in closedDatesTable]
        closedDatesTable = [[re.sub(r"<.*?>", "", cell).strip() for cell in row] for row in closedDatesTable]

        # Remove empty cells and rows
        closedDatesTable = [[cell for cell in row if cell] for row in closedDatesTable]
        closedDatesTable = [row for row in closedDatesTable if row]

        return closedDatesTable

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
        closedDatesTable = self.setTimeAndGetClosedDatesTable(2024, 12, 24, 19, 16)
        self.assertEqual(closedDatesTable[0][0], "24 december")
        self.assertEqual(closedDatesTable[0][1], "Julafton")
        self.assertEqual(closedDatesTable[0][2], "Stängt")

        self.assertEqual(closedDatesTable[3][0], "31 december")
        self.assertEqual(closedDatesTable[3][1], "Nyårsafton")
        self.assertEqual(closedDatesTable[3][2], "Stängt")

        self.assertEqual(closedDatesTable[7][0], "6 juni")
        self.assertEqual(closedDatesTable[7][1], "Nationaldagen")
        self.assertEqual(closedDatesTable[7][2], "Stängt")

    def testHolidaySortingNewYearsDay(self) -> None:
        closedDatesTable = self.setTimeAndGetClosedDatesTable(2025, 1, 1, 19, 16)
        self.assertEqual(closedDatesTable[0][0], "1 januari")
        self.assertEqual(closedDatesTable[0][1], "Nyårsdagen")
        self.assertEqual(closedDatesTable[0][2], "Stängt")

        self.assertEqual(closedDatesTable[2][0], "1 maj")
        self.assertEqual(closedDatesTable[2][1], "Första maj")
        self.assertEqual(closedDatesTable[2][2], "Stängt")

        self.assertEqual(closedDatesTable[6][0], "26 december")
        self.assertEqual(closedDatesTable[6][1], "Annandag jul")
        self.assertEqual(closedDatesTable[6][2], "Stängt")

    def testHolidaySortingNationalDay(self) -> None:
        closedDatesTable = self.setTimeAndGetClosedDatesTable(2025, 6, 6, 19, 16)
        self.assertEqual(closedDatesTable[0][0], "6 juni")
        self.assertEqual(closedDatesTable[0][1], "Nationaldagen")
        self.assertEqual(closedDatesTable[0][2], "Stängt")

        self.assertEqual(closedDatesTable[2][0], "25 december")
        self.assertEqual(closedDatesTable[2][1], "Juldagen")
        self.assertEqual(closedDatesTable[2][2], "Stängt")

        self.assertEqual(closedDatesTable[6][0], "6 januari")
        self.assertEqual(closedDatesTable[6][1], "Trettondedag jul")
        self.assertEqual(closedDatesTable[6][2], "Stängt")



if __name__ == "__main__":
    unittest.main(verbosity=2)
