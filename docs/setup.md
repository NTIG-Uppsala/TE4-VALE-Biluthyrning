# Setup
## Internal installations and setup

To properly setup and configure everything the following commands needs to be run:

```bash
npm install
```

```bash
pip install pytest-playwright playwright pytest-json-report python-dotenv
```

```bash
playwright install
```

The repository does not track a required `.env`-file due to security reasons. The file can be found [here](https://drive.google.com/file/d/1lmhCGe8ItjaIrP0iR04PWg-1RiKhOH2k/view?usp=drive_link). Download it and place it in the root-directory of the project.


## Maintaining the code

The following commands are either required or recommended to be run to ensure functionality of the project:

To install or update dependencies changed by others:

```bash
npm install
```

To update dependencies and write it to `package.json`:

```bash
npm update -save
```

To remove unnecessary dependencies in `package-lock.json`

```bash
npm prune
```
