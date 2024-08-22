# scripts/validate_css.py

import sys
import json


def main():
    try:
        data = json.load(sys.stdin)
        errors = len(data.get("cssvalidation", {}).get("errors", []))
        warnings = len(data.get("cssvalidation", {}).get("warnings", []))
        # Output error count (errors + warnings) for the shell script to use
        print(errors + warnings)
        # Exit with error if any errors or warnings are present
        if errors + warnings > 0:
            sys.exit(1)
        else:
            sys.exit(0)
    except json.JSONDecodeError:
        # Exit with error if JSON is malformed
        sys.exit(1)


if __name__ == "__main__":
    main()
