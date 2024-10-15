# Coding Standards

## General

#### Naming

-   Code language: _English_.
-   Comment language: _English_.
-   Documentation language: _English_.
-   Git branches: _camelCase_.
-   File names: _kebab-case_
-   Default case if not specified: _camelCase_.
-   No one-letter variable names.
-   Prefer longer, clearer variable names over short, unclear ones.

#### Syntax

-   Indent size: _4 spaces_.
-   Double quotes over single quotes. `"` > `'`.

#### Motivations

-   Longer variable names can helpful by describing their purpose. With modern IDEs, typing long variable names is not a problem and modern screens are large enough to display them. Given that, it isn't always the best way to go but that's why we have comments. In any case, avoid one-letter variable names (`index` > `i`) or really short abbreviations since they usually only lead to confusion.
-   Single quotes are not quotes and should only be used when required like in nested strings but never as the default. Double quotes are the standard in most programming languages and should be used as the default. This is to avoid confusion with single quotes in English text and general readability.
-   Default case is camelCase simply because it is good to have a default case. It is the most common case in programming and is readable enough.

## HTML & CSS

#### Naming

-   Classes: _kebab-case_.
-   Ids: _kebab-case_.

#### Syntax

-   Nested CSS is encouraged.
-   Semantic HTML tags are preferable over `div` tags.

#### Motivations

-   Nested selectors in CSS are encouraged since HTML is a tree structure and CSS should reflect that. This makes it easier to understand the structure of the page and to find the right selector. It also makes it easier to see which elements are nested inside each other.
-   Semantic HTML tags are preferable over `div` tags since they are more descriptive and make the code more readable. For instance, using a `header` or `section` tag instead of a `div` tag. It makes it clearer what the purpose of the element is both for developers and web indexers.

## JavaScript

#### Naming

-   Classes: _PascalCase_.
-   Functions: _camelCase_.
-   Variables: _camelCase_.
-   Consts: _camelCase_.

#### Syntax

-   `const` over `let`. Never `var`.
-   `() => {}` over `function() {}`.
-   Space between `//` and comment text.
-   `===` over `==`.
-   `;` at the end of each statement.

#### Motivations

-   `const` is the default choice for variables since it is the most secure and readable. If a variable needs to be reassigned, `let` should be used. `var` is outdated and should never be used since it hoists variables to the top of their scope which leads to silent errors with `undefined` showing up.
    -   Keep in mind that `const` is not immutable. It only means that the reference to the variable cannot be changed. For instance: `const obj = {}; obj.key = "value"; console.log(obj.key); // Returns "value" and not undefined`.
-   When declaring functions, arrow function expressions are the preferred way since they are more concise and have a more predictable behavior with `this`. To avoid confusion, always use arrow function expressions when declaring functions. To declare an arrow function, use `() => {}` instead of `function() {}` so `function myFunction() {};` becomes `const myFunction = () => {};`. Don't forget callback functions either, like `setTimeout(() => { // Function body }, 1000);` instead of `setTimeout(function() { // Function body }, 1000);`.

#### Examples

Good

```javascript
const myVariable = "newValue";
const myObject = { value: "value" };

const myFunction = () => {
    myObject.value = myVariable;
};

myFunction();

console.log(myObject.value); // Returns "newValue"

console.log(myLet); // Throws ReferenceError

let myLet = "newValue";
```

Bad

```javascript
let myVariable = "newValue";
let myObject = { value: "value" };

function myFunction() {
    myObject.value = myVariable;
}

myFunction();

console.log(myObject.value); // Returns "newValue" but myObject should be a const

console.log(myVar); // Returns undefined instead of throwing an error

var myVar = "newValue";
```

## Python

#### Naming

-   Classes: _PascalCase_.
-   Functions: _camelCase_.
-   Variables: _camelCase_.

## Shellscript (Bash)

#### Naming

-   Functions: _lower_case_.
-   Variables: _lower_case_.
-   Constants: _UPPER_CASE_.

---

[Back to README.](/README.md)
