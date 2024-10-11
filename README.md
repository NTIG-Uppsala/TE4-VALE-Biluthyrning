# Car Rental Website for NTB Car Rental

###### This is a TE4 project by the group VALE. Original group members: Viggo Ström, Axel Thornberg, Eskil Tornberg. Former maintainers: Ivar Bjerling, Tim Kelso, David Cavalli-Björkman. Current maintainers: Jesper Cejie, Carl Eriksson Skogh, Joel Jansson, Viggo Ström och Axel Thornberg.

## Documents

-   [Definition of Done](/docs/definition-of-done.md)
-   [Coding Standard](/docs/coding-standard.md)
-   [Development Environment](/docs/development-environment.md)
-   [Programming Languages](/docs/programming-languages.md)

-   [Connecting to Our Servers](/docs/connecting-to-our-servers.md)
-   [How to Set Up a New Web Server](/docs/web-server-setup.md)
-   [Backend Setup](/docs/backend-setup.md)
-   [Running the Backend Locally](/docs/running-the-backend.md)
-   [Running Tests](/docs/testing.md)
-   [Maintaining the Codebase](/docs/maintenance.md)

## Flag Icons

We use a customized version of the [flag-icons](https://github.com/lipis/flag-icons) project to integrate inline flag icons for the language selection dropdown in the website's nav-bar. In the [flag-icons folder](public/css/flag-icons/) of our project there are two folders, [css](public/css/flag-icons/css) and [flags](public/css/flag-icons/flags). The [css folder](public/css/flag-icons/css) contains a minified [CSS file](public/css/flag-icons/css/flag-icons.min.css) which gets imported in [index.hbs](views/index.hbs). The [flags folder](public/css/flag-icons/flags) contains the flag icons used, which are imported through said CSS file. Beware that you have to add a new flag icon to the [flags folder](public/css/flag-icons/flags) if you want to add more flag icons to the project. This can be done through downloading the [flag-icons](https://github.com/lipis/flag-icons) project and adding the desired flag icons.

To place an inline icon on the page add the language name and code to the `languages`-variable in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

## Changing Information on the page.

-   Phone numbers are changed in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

-   Changing which cars are available is done in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

-   To change the VAT tax, simply change the value of the "vat_on_cars" in [lulea.yml](data/lulea.yml) and [kiruna.yml](data/kiruna.yml).

-   To change which ZIP codes are delivered to and their price, change the value of the `zip_codes`-key in [kiruna.yml](data/kiruna.yml) or [lulea.yml](data/lulea.yml).

-   To change the E-mail, change the `mail`-variable in [kiruna.yml](data/kiruna.yml) or [lulea.yml](data/lulea.yml).

-   To change the address, change the `address`- and `zip_code`-variables in [kiruna.yml](data/kiruna.yml) or [lulea.yml](data/lulea.yml).

-   To change holidays where one or more stores are closed, change the value of the `closed_dates`-key in [kiruna.yml](data/kiruna.yml) and [lulea.yml](data/lulea.yml). The `date`-key is in the following format: `MMDD` where Janauary is month 0 and December is month 11.

-   To change the hours which the store is open, change the value of the `open_hours`-key in [kiruna.yml](data/kiruna.yml) and [lulea.yml](data/lulea.yml). The `index`-key is an integer for which day of the week the object refers to with Sunday as day 0 and Saturday as day 6.

-   There is also an object `special_open_hours` which allows for differing hours during a specific month. It consists of two keys: `month` which indicates which month this applies to (January is month 0 and December is month 11.) and `open_hours` which follows the same structure as mentioned previously.

_When making changes to any of the above files also make sure to add that change to its correlating python testing file._
