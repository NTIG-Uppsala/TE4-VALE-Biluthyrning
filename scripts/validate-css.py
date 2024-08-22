# scripts/validate_css.py

import sys
import json

def main():
    try:
        data = json.load(sys.stdin)
        errors = len(data.get("cssvalidation", {}).get("errors", []))
        warnings = len(data.get("cssvalidation", {}).get("warnings", []))
        # Output error count (errors + warnings) for debugging
        print(errors + warnings)
    except json.JSONDecodeError:
        # Exit with error if JSON is malformed
        sys.exit(1)

if __name__ == "__main__":
    main()
