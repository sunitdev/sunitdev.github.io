# Sunit — blog and AI playground

A place where I try out AI ideas, work through the maths, and build little apps.
I use notebooks and shared Python packages to explore, with make and Docker to run things.
Some experiments become blog posts; the rest stay in the playground.

## Notebook-first simulations

Write the simulation, inputs, layouts, validation, and callbacks in the `.ipynb`.
Use standard `ipywidgets` such as `IntSlider`, `FloatSlider`, `Text`, `IntText`,
`Checkbox`, `Dropdown`, `Button`, `VBox`, and `Output`. Python reads the widget's
`.value`; register button callbacks with `.on_click` or reactive callbacks with
`.observe`. The website uses the official Jupyter widget renderer and forwards
widget messages to Python running in the visitor's browser.

```python
import ipywidgets as widgets
from IPython.display import display

steps = widgets.IntSlider(value=100, min=10, max=1000, description="Steps")
name = widgets.Text(value="Experiment", description="Name")
button = widgets.Button(description="Run simulation")
output = widgets.Output()


def run_simulation(_):
    with output:
        output.clear_output(wait=True)
        print(f"{name.value}: running {steps.value} steps")


button.on_click(run_simulation)
display(widgets.VBox([steps, name, button, output]))
```

Run `make notebook` to work in JupyterLab. Enable **Settings → Save Widget State
Automatically** before executing and saving, so widget views and their saved state
stay together. You can also execute and save from the terminal with
`make notebook-run NOTEBOOK=notebooks/my-simulation.ipynb`. Saved widget state
provides a preview on the website; see the [official widget embedding guide](https://ipywidgets.readthedocs.io/en/latest/embedding.html).
Visitors use **Run all** to create
live widgets and connect their callbacks to Python. The first run downloads Python
and widget dependencies. Stop clears the Python session; Run all reconnects it.
The same widget definitions run in Jupyter without a website-specific cell or tag.
Use packages supported by Pyodide for browser simulations; third-party custom widget
JavaScript modules are not loaded automatically.

## Publish a notebook

Put the notebook anywhere under `notebooks/`, and add `journal` to its notebook
metadata using JupyterLab's notebook metadata editor:

```json
{
  "journal": {
    "published": true,
    "slug": "my-simulation",
    "title": "My simulation",
    "description": "What this notebook explores.",
    "topic": "Experiment",
    "label": "Notebook",
    "featured": false
  }
}
```

The build discovers these notebooks and creates `/blog/my-simulation/`, the journal
entry, and the `.ipynb` download. New notebooks and simulations require no JavaScript
or HTML edits. Only `published: true` notebooks are published; checkpoints and
symlinks are excluded. Optionally set `previewImage` with `alt` and `caption` in the
same metadata to use a saved figure in the journal listing.

Run `make website` for a local preview, restarting it after adding a new notebook.
Run `make website-check` to validate and export the website and `make notebook-check`
to test the widget bridge with the π notebook and another simulation.
