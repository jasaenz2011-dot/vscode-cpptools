"""Allow ``python -m dlg`` as well as the installed ``dlg`` entry point."""

from .cli import main

if __name__ == "__main__":
    raise SystemExit(main())
