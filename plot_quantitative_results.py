from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from color import acid, brown, dark_peach, dark_purple, green, peach


METRICS = ["CD", "PSNR"]
METRIC_INDICES = {"CD": 0, "F-score": 1, "NC": 2, "PSNR": 3, "SSIM": 4, "LPIPS": 5}
LOWER_IS_BETTER = {"CD", "LPIPS"}
DATASETS = ["Replica", "Scannet++"]
METHODS = ["SimRecon", "SAM3D", "MV-SAM3D", "ShapeR", "ReconViaGen", "Ours"]

COLORS = {
    "SimRecon": peach,
    "SAM3D": dark_peach,
    "MV-SAM3D": brown,
    "ShapeR": acid,
    "ReconViaGen": dark_purple,
    "Ours": green,
}

RESULTS = {
    "Replica": {
        "SimRecon": [17.55, 40.61, 63.25, 18.04, 0.858, 0.152],
        "SAM3D": [10.59, 45.46, 66.33, 18.89, 0.847, 0.143],
        "MV-SAM3D": [12.87, 40.46, 64.19, 18.83, 0.848, 0.142],
        "ShapeR": [6.59, 61.76, 69.09, np.nan, np.nan, np.nan],
        "ReconViaGen": [15.49, 51.02, 68.09, 18.58, 0.861, 0.147],
        "Ours": [3.95, 77.87, 78.85, 24.21, 0.907, 0.114],
    },
    "Scannet++": {
        "SimRecon": [17.11, 36.64, 59.21, 16.40, 0.826, 0.198],
        "SAM3D": [12.75, 32.23, 60.70, 16.46, 0.833, 0.169],
        "MV-SAM3D": [15.35, 26.95, 60.51, 17.41, 0.842, 0.167],
        "ShapeR": [9.77, 52.44, 60.74, np.nan, np.nan, np.nan],
        "ReconViaGen": [11.75, 45.36, 63.58, 17.59, 0.846, 0.186],
        "Ours": [4.34, 77.93, 76.39, 21.71, 0.893, 0.133],
    },
}


def autolabel(ax, bars, values, metric):
    finite_values = [value for value in values if np.isfinite(value)]
    if not finite_values:
        return

    ymax = max(finite_values)
    offset = ymax * 0.018
    for bar, value in zip(bars, values):
        if not np.isfinite(value):
            continue
        label = f"{value:.3f}" if metric in {"SSIM", "LPIPS"} else f"{value:.2f}"
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + offset,
            label,
            ha="center",
            va="bottom",
            fontsize=7,
            rotation=90,
        )


def plot_metric(ax, metric, metric_index):
    x = np.arange(len(DATASETS))
    width = 0.12
    offsets = (np.arange(len(METHODS)) - (len(METHODS) - 1) / 2) * width

    for offset, method in zip(offsets, METHODS):
        values = [RESULTS[dataset][method][metric_index] for dataset in DATASETS]
        bars = ax.bar(
            x + offset,
            values,
            width,
            label=method,
            color=COLORS[method],
            edgecolor="white",
            linewidth=0.8,
        )
        autolabel(ax, bars, values, metric)

    finite_values = [
        RESULTS[dataset][method][metric_index]
        for dataset in DATASETS
        for method in METHODS
        if np.isfinite(RESULTS[dataset][method][metric_index])
    ]
    ax.set_ylim(0, max(finite_values) * 1.22)
    ax.set_xticks(x)
    ax.set_xticklabels(DATASETS, fontsize=10)
    arrow = "↓" if metric in LOWER_IS_BETTER else "↑"
    ax.set_title(f"{metric} ({arrow})", fontsize=12, pad=10)
    ax.grid(axis="y", color="#D8D8D8", linewidth=0.7, alpha=0.75)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)


def main():
    output_dir = Path("figures")
    output_dir.mkdir(exist_ok=True)

    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "axes.titleweight": "bold",
            "axes.labelcolor": "#333333",
            "xtick.color": "#333333",
            "ytick.color": "#333333",
            "figure.facecolor": "white",
        }
    )

    fig, axes = plt.subplots(1, len(METRICS), figsize=(9.2, 3.8), constrained_layout=True)
    for ax, metric in zip(np.atleast_1d(axes), METRICS):
        plot_metric(ax, metric, METRIC_INDICES[metric])

    handles, labels = np.atleast_1d(axes)[0].get_legend_handles_labels()
    fig.legend(
        handles,
        labels,
        loc="upper center",
        ncol=len(METHODS),
        frameon=False,
        bbox_to_anchor=(0.5, 1.04),
        fontsize=10,
    )
    fig.suptitle("Quantitative Comparison on Replica and Scannet++", fontsize=15, fontweight="bold")

    png_path = output_dir / "quantitative_comparison_bars.png"
    pdf_path = output_dir / "quantitative_comparison_bars.pdf"
    fig.savefig(png_path, dpi=300, bbox_inches="tight")
    # fig.savefig(pdf_path, bbox_inches="tight")
    print(f"Saved {png_path}")
    # print(f"Saved {pdf_path}")


if __name__ == "__main__":
    main()