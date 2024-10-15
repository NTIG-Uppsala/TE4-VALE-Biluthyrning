# Testing

## Setup

1. Follow [backend-setup.md](backend-setup.md) on how to setup the backend.

2. Run the following commands:

```bash
pip install pytest-playwright playwright pytest-json-report python-dotenv
```

```bash
playwright install
```

## Running tests

1. To run the tests the server needs to be running. To do this open a command line in the root of the project and run:

```bash
npm run start
```

2. Following that run either each python file starting with `test_` manually or by opening the Testing-view in VSCode and running the tests from there.

3. After the tests have finished press `CTRL + C`. Then enter `Y` when asked to terminate the server.

---

[Back to README.](/README.md)
