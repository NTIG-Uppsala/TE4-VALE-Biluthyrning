import unittest
from utils import *


class HamburgerMenu(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="public/se/kiruna/index.html")
        self.page.set_viewport_size({"width": 375, "height": 812})

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # tests

    def testHamburgerMenuDropdown(self) -> None:
        # Check that the dropdown menu switches between visible and hidden when the hamburger menu button is clicked
        hamburgerMenuButton = self.page.query_selector(".hamburger-menu")

        self.assertFalse(self.page.is_visible(".dropdown-menu"))

        hamburgerMenuButton.click()

        self.assertTrue(self.page.is_visible(".dropdown-menu"))

        hamburgerMenuButton.click()

        self.assertFalse(self.page.is_visible(".dropdown-menu"))

    def testHamburgerMenuLinks(self) -> None:
        # Check that the hamburger menu links are correct

        hamburgerMenuButton = self.page.query_selector(".hamburger-menu")
        hamburgerMenuLinks = self.page.query_selector_all(".dropdown-menu a")

        hamburgerMenuButton.click()

        self.assertEqual(len(hamburgerMenuLinks), 4)

        self.assertEqual(hamburgerMenuLinks[0].inner_text(), "Öppettider")
        self.assertEqual(hamburgerMenuLinks[1].inner_text(), "Våra bilar")
        self.assertEqual(hamburgerMenuLinks[2].inner_text(), "Utkörning")
        self.assertEqual(hamburgerMenuLinks[3].inner_text(), "Avvikande tider")

    def testHamburgerMenuLinkClick(self) -> None:
        # Check that the hamburger menu links navigate to the correct sections
        hamburgerMenuButton = self.page.query_selector(".hamburger-menu")
        hamburgerMenuLinks = self.page.query_selector_all(".dropdown-menu a")

        # Open the hamburger menu
        hamburgerMenuButton.click()

        # Click the first link and verify the section title is in the viewport
        hamburgerMenuLinks[0].click()

        # Check that the url ends with #open-hours-section
        self.assertTrue(self.page.url.endswith("#open-hours-section"))

        # Check if the element is within the viewport using JavaScript
        openHoursTitle = self.page.query_selector("#open-hours-section h2")
        self.assertTrue(openHoursTitle.is_visible())
        isInViewport = self.page.evaluate("""
            (element) => {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }
        """, openHoursTitle)
        self.assertTrue(isInViewport)

        # Open the hamburger menu again
        hamburgerMenuButton.click()

        # Click the fourth link and verify the section title is in the viewport
        hamburgerMenuLinks[3].click()

        # Check that the url ends with #closed-dates-container
        self.assertTrue(self.page.url.endswith("#closed-dates-container"))

        # Check if the element is within the viewport using JavaScript
        closedDatesTitle = self.page.query_selector("#closed-dates-container h2")
        self.assertTrue(closedDatesTitle.is_visible())
        isInViewport = self.page.evaluate("""
            (element) => {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }
        """, closedDatesTitle)
        self.assertTrue(isInViewport)


if __name__ == "__main__":
    unittest.main(verbosity=2)
