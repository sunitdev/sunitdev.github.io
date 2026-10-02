"""Exercise the browser bridge with real ipywidgets and notebook-defined callbacks."""

import json
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
outputs = []
bridge = types.ModuleType("notebook_bridge")
bridge.emit = lambda value: outputs.append(json.loads(value))
sys.modules["notebook_bridge"] = bridge
worker = (ROOT / "apps/blog/public/notebook-worker.mjs").read_text()
bootstrap = worker.split("const bootstrap = String.raw`", 1)[1].split("`;", 1)[0]
namespace = {}
exec(bootstrap, namespace)


def message(widget, data):
    return namespace["_widget_message"](
        json.dumps({"modelId": widget.model_id, "data": data, "buffers": []})
    )


notebook = json.loads((ROOT / "notebooks/estimating-pi.ipynb").read_text())
for cell in notebook["cells"]:
    if cell["cell_type"] == "code":
        assert namespace["_execute"]("".join(cell["source"]))
state = namespace["_shell"].user_ns
assert state["simulate_pi"](10_000, 42)[1] == 3.126
assert state["simulate_pi"](100, 7) == state["simulate_pi"](100, 7)
for count, seed in [(100, 0), (100_000, 2_147_483_647)]:
    points, estimate = state["simulate_pi"](count, seed)
    assert len(points) == count and 0 <= estimate <= 4
    assert state["plot_points"](points).data.count("<circle ") == min(800, count)
assert message(state["sample_slider"], {"method": "update", "state": {"value": 100}})
assert message(state["seed_input"], {"method": "update", "state": {"value": "7"}})
assert message(state["run_button"], {"method": "custom", "content": {"event": "click"}})
rendered = state["simulation_output"].outputs
assert "Points: 100\nSeed: 7\n" in rendered[0]["text"]
assert rendered[1]["data"]["image/svg+xml"].count("<circle ") == 100
assert message(state["seed_input"], {"method": "update", "state": {"value": "42"}})
assert message(state["run_button"], {"method": "custom", "content": {"event": "click"}})
assert "Seed: 42" in state["simulation_output"].outputs[0]["text"]
assert "Seed: 7" not in state["simulation_output"].outputs[0]["text"]
assert len(state["simulation_output"].outputs) == len(rendered)
for seed in ["", "1.5", "-1", "2147483648"]:
    assert message(state["seed_input"], {"method": "update", "state": {"value": seed}})
    assert state["run_button"].disabled
namespace["_reset"]()

# A different simulation and different controls require no renderer changes.
assert namespace["_execute"]("""
import ipywidgets as widgets
from IPython.display import display
rate = widgets.FloatSlider(value=2.5, min=0.5, max=5.0, step=0.5, description="Rate")
count = widgets.IntText(value=4, description="Count")
mode = widgets.Dropdown(options=["add", "multiply"], value="multiply", description="Mode")
label = widgets.Text(value="Result", description="Label")
enabled = widgets.Checkbox(value=True, description="Enabled")
button = widgets.Button(description="Calculate")
result = widgets.Output()
def calculate(_):
    with result:
        result.clear_output(wait=True)
        value = rate.value * count.value if mode.value == "multiply" else rate.value + count.value
        print(f"{label.value}: {value if enabled.value else 0}")
button.on_click(calculate)
display(widgets.VBox([rate, count, mode, label, enabled, button, result]))
""")
state = namespace["_shell"].user_ns
assert message(state["rate"], {"method": "update", "state": {"value": 3.5}})
assert message(state["count"], {"method": "update", "state": {"value": 6}})
assert message(state["button"], {"method": "custom", "content": {"event": "click"}})
assert state["result"].outputs[0]["text"] == "Result: 21.0\n"
assert message(state["mode"], {"method": "update", "state": {"index": 0}})
assert message(state["enabled"], {"method": "update", "state": {"value": False}})
assert message(state["button"], {"method": "custom", "content": {"event": "click"}})
assert state["result"].outputs[0]["text"] == "Result: 0\n"
assert json.loads(namespace["_widget_state"]())["state"]
namespace["_reset"]()
print(
    "Notebook widget checks passed: Python values, callbacks, validation, plots, "
    "output replacement, and a second simulation."
)
