# Definition of Done 4.0

#### Before moving a post-it to done, make sure you have:

- Written documentation if possible.
  
- Removed any placeholders.
  
- Removed debug code like **console.log()** or **print()** or commented blocks of code.

- Passed all tests.

- Looked at generated screenshots.

- Reviewed code:
  - Someone should've read the code without any explanations and understood it.
  - Make sure every team member has an understanding of the code. At least at an overview level.

- Yellow post-it:
  - Pushed changes to its feature branch.
  - Documented the changes for the sprint review.

- Blue post-it:
  - Gone through all the yellow post-its to make sure nothing has been missed.
  - Incremented the version number in the **package.json** file.
  - Squash merged it to main.
  - Deleted the feature branch.
  - Cleaned up the documentation from the yellow post-its to present at the sprint review. Make it concise.
  - Created a tag in git.
  - Created a release from the tag in GitHub.