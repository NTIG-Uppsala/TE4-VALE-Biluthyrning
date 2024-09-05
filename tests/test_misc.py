import unittest
from utils import *


class TestMisc(TemplateTest):
    def setUp(self) -> None:
        super().setUp(fileToTest="index.html")

    def testBrowserExists(self) -> None:
        self.assertIsNotNone(self.page)

    def testPageExists(self) -> None:
        self.assertEqual("complete", self.page.evaluate("document.readyState"))

    def testSelfName(self) -> None:
        if (self.__class__.__name__ == "TestName"):
            self.fail("Test class name is not correct")

    # tests
    def testNoMissing(self) -> None:
        # we have used missing as a placeholder before so this test checks that
        self.assertNotInContent("Missing")

    def testNoMergeConflicts(self) -> None:
        # we have run into merge conflict elements remaining in our code somehow
        self.assertNotInContent("<<<<<<<")
        self.assertNotInContent("=======")
        self.assertNotInContent(">>>>>>>")


if __name__ == "__main__":
    unittest.main(verbosity=2)
