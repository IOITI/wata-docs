import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import {html} from "htl";

// REFACTOR: All plotting functions are moved here.
// They now accept data and options (like width) as arguments, making them pure and reusable.

export function graph_cumulative_profit_loss(data, sim_data, {width, time_picked, simulated}) {
    return Plot.plot({
        width,
        height: 300,
        caption: `Displays cumulative profit/loss for the past ${time_picked} days.`,
        x: {label: "Date", grid: true},
        y: {label: "Cumulative Profit / Loss (€)", grid: true, tickFormat: "s"},
        marks: [
            Plot.ruleY([0]),
            simulated ? Plot.line(sim_data, {x: "date", y: "money", stroke: "steelblue", tip: true, strokeDasharray: "2,4"}) : null,
            Plot.line(data, {
                x: "day_date",
                y: "cumulative_profit_loss",
                stroke: "green",
                tip: true
            }),
            Plot.areaY(data, {
                x: "day_date",
                y: "cumulative_profit_loss",
                fill: "green",
                fillOpacity: 0.1
            })
        ]
    });
}

export function graph_profit_loss_bar_chart(data, {width, time_picked}) {
    // REFACTOR: Using Plot.barY is simpler and more idiomatic for bar charts.
    // Text positioning is now more robust (dy attribute).
    return Plot.plot({
        width,
        height: 300,
        caption: `Displays daily profit/loss for the past ${time_picked} days.`,
        x: {label: "Date", grid: true},
        y: {label: "Profit / Loss (€)", grid: true},
        marks: [
            Plot.ruleY([0]),
            Plot.barY(data, {
                x: "day_date",
                y: "profit_loss_sum",
                fill: d => d.profit_loss_sum >= 0 ? "var(--theme-foreground-positive)" : "var(--theme-foreground-negative)",
                tip: true,
            }),
            Plot.text(data, {
                x: "day_date",
                y: "profit_loss_sum",
                text: d => d.profit_loss_sum.toFixed(0),
                dy: d => d.profit_loss_sum >= 0 ? -8 : 8,
                fill: d => d.profit_loss_sum >= 0 ? "var(--theme-foreground-positive)" : "var(--theme-foreground-negative)",
                fontSize: time_picked > 90 ? 0 : 10, // Hide text if too many days
            })
        ]
    });
}

export function graph_position_duration_scatter(data, {width}) {
    // REFACTOR: Added a richer tooltip for better UX.
    return Plot.plot({
        width,
        height: 400,
        grid: true,
        x: { label: "Position Open Price (€)" },
        y: { label: "Duration Open (minutes)", type: "log" },
        color: { legend: true, domain: ["Profitable", "Non-Profitable"], range: ["#4daf4a", "#e41a1c"] },
        marks: [
            Plot.dot(data, {
                x: "position_open_price",
                y: "open_duration",
                stroke: "profitability",
                r: 4,
                fillOpacity: 0.7,
                tip: {
                    format: {
                        x: {label: "Open Price", style: "currency", currency: "EUR"},
                        y: {label: "Duration (min)", value: (d) => d.toFixed(1)},
                        stroke: {label: "Result"}
                    }
                }
            })
        ]
    });
}

export function winrate_by_day(data, {width}) {
    const [start, end] = d3.extent(data, d => d.day_date);
    return Plot.plot({
        width,
        height: (d3.utcMonth.count(start, end) + 1) * 62,
        padding: 0,
        y: { tickFormat: Plot.formatMonth("en", "short"), paddingTop: 3, paddingBottom: 3 },
        color: { type: "linear", legend: true, scheme: "RdYlGn", label: "Trade Win rate (%)" },
        marks: [
            Plot.cell(data, {
                x: d => d3.utcDay. D.utcDay(d.day_date),
                y: d => d3.utcMonth. D.utcMonth(d.day_date),
                fill: "profitable_percentage",
                inset: 0.5,
                tip: true
            }),
            Plot.text(data, {
                x: d => d3.utcDay. D.utcDay(d.day_date),
                y: d => d3.utcMonth. D.utcMonth(d.day_date),
                text: d => `${Math.round(d.profitable_percentage)}%`,
                fontSize: 13,
                fill: d => (d.profitable_percentage > 30 && d.profitable_percentage < 70) ? "black" : "white",
                dy: -6
            }),
            Plot.text(data, {
                x: d => d3.utcDay. D.utcDay(d.day_date),
                y: d => d3.utcMonth. D.utcMonth(d.day_date),
                text: d => d.profit_loss_sum.toFixed(0),
                fontSize: 9,
                fill: "black",
                fillOpacity: 0.7,
                dy: 8
            })
        ]
    });
}


export function performance_by_day(data, {width}) {
    const [start, end] = d3.extent(data, d => new Date(d.date_day_format));
    return Plot.plot({
      width,
      height: (d3.utcMonth.count(start, end) + 1) * 62,
      padding: 0,
      y: { tickFormat: Plot.formatMonth("en", "short"), paddingTop: 3, paddingBottom: 3 },
      color: { type: "diverging", scheme: "PiYG", legend: true, label: "Performance %" },
      marks: [
        Plot.cell(data, {
          x: d => d3.utcDay. D.utcDay(new Date(d.date_day_format)),
          y: d => d3.utcMonth. D.utcMonth(new Date(d.date_day_format)),
          fill: "perf_day_real",
          inset: 0.5,
          tip: true
        }),
        Plot.text(data, {
          x: d => d3.utcDay. D.utcDay(new Date(d.date_day_format)),
          y: d => d3.utcMonth. D.utcMonth(new Date(d.date_day_format)),
          text: d => d.perf_day_real.toFixed(1) + "%",
          fontSize: 10,
          fill: "black"
        })
      ]
    });
}