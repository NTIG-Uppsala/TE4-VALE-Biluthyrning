# Setup
## Internal installations and setup

To properly setup and configure everything the following commands needs to be run:

```bash
npm install
```

```bash
pip install pytest-playwright playwright pytest-json-report
```

```bash
playwright install
```

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
