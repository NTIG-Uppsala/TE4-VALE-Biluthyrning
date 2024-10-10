from utils import *


class HamburgerMenu(TemplateTest):
    def setUp(self) -> None:
        super().setUp()
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
        hamburgerMenuButton = self.page.locator("header > section > button")

        self.assertFalse(self.page.is_visible("header > section > nav"))

        hamburgerMenuButton.hover()

        self.assertTrue(self.page.is_visible("header > section > nav"))

        self.page.mouse.move(0, 812)

        self.assertFalse(self.page.is_visible("header > section > nav"))

    def testHamburgerMenuLinks(self) -> None:
        # Check that the hamburger menu links are correct

        hamburgerMenuButton = self.page.locator("header > section > button")
        hamburgerMenuLinks = self.page.locator("header > section > nav > a").all()

        hamburgerMenuButton.hover()

        self.assertEqual(len(hamburgerMenuLinks), 4)

        self.assertEqual(hamburgerMenuLinks[0].inner_text(), "Öppettider")
        self.assertEqual(hamburgerMenuLinks[1].inner_text(), "Våra bilar")
        self.assertEqual(hamburgerMenuLinks[2].inner_text(), "Utkörning")
        self.assertEqual(hamburgerMenuLinks[3].inner_text(), "Avvikande tider")

    def testHamburgerMenuLinkClick(self) -> None:
        # Check that the hamburger menu links navigate to the correct sections
        hamburgerMenuButton = self.page.locator("header > section > button")
        hamburgerMenuLinks = self.page.locator("header > section > nav > a").all()

        # Open the hamburger menu
        hamburgerMenuButton.hover()

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
        hamburgerMenuButton.hover()

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
