# math-tools

Empty package scaffold for shared mathematical implementations.

```text
pyproject.toml
README.md
src/math_tools/__init__.py    Empty package marker
```

Future implementations belong under `src/math_tools/`.
Declare dependencies in this package's `pyproject.toml`. This is a local uv
workspace package and is not published to a package registry.

The distribution is named `math-tools` and imports as `math_tools`.
