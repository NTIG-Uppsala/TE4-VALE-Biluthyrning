from utils import *


class TestZIPCodes(TemplateTest):
    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if self.__class__.__name__ == "TestName":
            self.fail("Test class name is not correct")

    # Helper functions
    def submitAndTestZIPCode(self, zipCode: str, match: str) -> None:
        zipInput = self.page.locator("#zip-input")
        zipButton = self.page.locator("#zip-button")
        zipInput.fill(zipCode)
        zipButton.click()
        self.page.wait_for_timeout(200)
        self.assertInTextContent(match)

    # tests
    def testEmptyZIPCode(self) -> None:
        self.submitAndTestZIPCode("", "Du måste ange ett postnummer i rutan")

    def testInvalidZIPCode(self) -> None:
        self.submitAndTestZIPCode("1234", "Postnumret måste vara fem siffror")

    def testZIPCodeNotDeliveredTo(self) -> None:
        self.submitAndTestZIPCode("12345", "Vi kör inte ut till postnummer 12345")
        self.submitAndTestZIPCode("54321", "Vi kör inte ut till postnummer 54321")

    def testZIPCodeDeliveredTo(self) -> None:
        self.submitAndTestZIPCode("98138", "Vi kör ut till postnummer 98138 för 199 kr")
        self.submitAndTestZIPCode("98144", "Vi kör ut till postnummer 98144 för 299 kr")
        self.submitAndTestZIPCode("98147", "Vi kör ut till postnummer 98147 för 299 kr")

    def testOnEnterKey(self) -> None:
        zipInput = self.page.query_selector("#zip-input")
        zipInput.fill("98138")
        zipInput.press("Enter")
        self.page.wait_for_timeout(200)

        self.assertInTextContent("Vi kör ut till postnummer 98138 för 199 kr")

    def testOnBlur(self) -> None:
        zipInput = self.page.query_selector("#zip-input")
        zipInput.fill("98138")
        self.page.evaluate(
            """
            (element) => element.blur();
            """,
            zipInput,
        )
        self.page.wait_for_timeout(200)

        self.assertInTextContent("Vi kör ut till postnummer 98138 för 199 kr")


if __name__ == "__main__":
    unittest.main(verbosity=2)
