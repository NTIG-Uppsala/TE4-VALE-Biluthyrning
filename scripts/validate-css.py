import sys
import json


def main():
    try:
        data = json.load(sys.stdin)
        # Print the JSON data for debugging
        # print(json.dumps(data, indent=2), file=sys.stderr)

        # Adjust the keys based on the actual JSON response structure
        errors = len(data.get("errors", []))
        warnings = len(data.get("warnings", []))

        total_issues = errors + warnings
        print(total_issues)

        if total_issues > 0:
            sys.exit(1)
        else:
            sys.exit(0)
    except json.JSONDecodeError:
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
