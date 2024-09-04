import unittest
from utils import *


class TestMisc(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    # tests
    def testNoMissing(self) -> None:
        # we've used missing as a placeholder before so this test checks that
        self.assertNotIn("Missing", self.page.content())


if __name__ == "__main__":
    unittest.main(verbosity=2)
