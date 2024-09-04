import unittest
from utils import *


class TestName(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    # new test function goes here


if __name__ == "__main__":
    unittest.main(verbosity=2)
