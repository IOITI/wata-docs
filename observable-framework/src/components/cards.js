import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {html} from "htl";

/**
 * Renders a generic performance card with a title, main value, comparison table, and sparkline chart.
 * @param {object} options - The configuration for the card.
 * @param {function} options.resize - The resize function from the Observable environment.
 * @param {string} options.title - The main title for the card.
 * @param {Array<object>} options.mainData - The primary data array, sorted descending by date.
 * @param {string} options.valueColumn - The name of the column in mainData holding the performance value.
 * @param {number} options.comparison4WeekValue - The numeric value for the 4-week comparison.
 * @param {number} options.comparison52WeekValue - The numeric value for the 52-week comparison.
 * @param {boolean} [options.isAverage=false] - If true, adds "average" to the comparison labels.
 * @param {string} [options.suffix=""] - A string to append to the main h1 metric (e.g., "per day").
 * @param {string} [options.dateColumn="week_date"] - The name of the date column for the x-axis.
 * @param {string} [options.displayColumn="week_display"] - The name of the column for the tooltip.
 */
export function GenericPerformanceCard({
  resize,
  title,
  mainData,
  valueColumn,
  comparison4WeekValue,
  comparison52WeekValue,
  isAverage = false,
  suffix = "",
  dateColumn = "week_date",
  displayColumn = "week_display"
}) {
  if (!resize) throw new Error("GenericPerformanceCard requires the 'resize' function to be passed in.");

  const lastWeek = mainData?.at(0);
  const secondLastWeek = mainData?.at(1);

  if (lastWeek && secondLastWeek) {
    const lastWeekValue = lastWeek[valueColumn];
    const secondLastWeekValue = secondLastWeek[valueColumn];
    const diff1 = lastWeekValue - secondLastWeekValue;
    const range = d3.extent(mainData.slice(-52), (d) => d[valueColumn]);
    const chartData = mainData.slice(-52);

    return html.fragment`
         <style>
            .metric-container {
              display: flex;
              align-items: baseline; /* Aligns text of different sizes nicely */
              gap: 0.5em; /* Adds a bit of space between the metric and suffix */
            }
            .metric-suffix {
              font-size: 1.1rem; /* Smaller than h1 */
              font-weight: 400;  /* Normal font weight */
              color: var(--theme-foreground-muted); /* A less prominent color */
            }
            .card-table {
              width: 100%; /* This makes the table span the full width */
              max-width: 100%; /* Optional: limits the width of the table */
              margin-top: 1em; /* Adds some space above the table */
              margin: 1em auto; /* Centers the table horizontally */
              border-spacing: 0 0.5px; /* Adds a little vertical space between rows */
              border-collapse: separate;
            }
            .card-table td {
              padding-bottom: 0.2rem;
              border-bottom: 1px solid rgb(54, 52, 50); /* The gray line */
            }
            .card-table tr:last-child td {
              border-bottom: none;
            }
            .text-right {
              text-align: right;
            }
        </style>
        <h2>${title}</h2>
        <div class="metric-container">
            <h1 style="margin: 0; color: ${lastWeekValue >= 0 ? "var(--wata-color-profit)" : "var(--wata-color-loss)"}">
              ${formatPercent(lastWeekValue)}
            </h1>
            ${suffix ? html`<span class="metric-suffix">${suffix}</span>` : ""}
        </div>
        <table class="card-table">
            <tbody>
              <tr>
                <td>1-week before & change</td>
                <!-- MODIFICATION: Replaced align="right" with class="text-right" -->
                <td class="text-right">
                    ${formatPercent(secondLastWeekValue, {signDisplay: "always"})} <span style="
                        background-color: #6a0dad; padding: 2px 6px; border-radius: 10px;
                        font-size: 1em; margin-left: 0.25em;">
                        ${formatPercent(diff1, {signDisplay: "always"})} ${trend(diff1)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>${isAverage ? '4-week average' : '4-week'}</td>
                <td class="text-right">${formatPercent(comparison4WeekValue)}</td>
              </tr>
              <tr>
                <td>${isAverage ? '52-week average' : '52-week'}</td>
                <td class="text-right">${formatPercent(comparison52WeekValue)}</td>
              </tr>
            </tbody>
        </table>

        ${resize((width) =>
          Plot.plot({
            width,
            height: 80,
            marginTop: 5, marginBottom: 5, axis: null,
            x: { type: "time", domain: d3.extent(chartData, d => d[dateColumn])},
            y: { label: "Performance (%)", nice: true, grid: true, inset: 0},
            marks: [
              Plot.ruleY([0], { stroke: "green", strokeWidth: 1, strokeDasharray: "4,4" }),
              Plot.ruleX(chartData, Plot.pointerX({x: dateColumn, py: valueColumn, stroke: d => d[valueColumn] >= 0 ? "var(--wata-color-profit)" : "var(--wata-color-loss)"})),
              Plot.dot(chartData, Plot.pointerX({x: dateColumn, y: valueColumn, stroke: d => d[valueColumn] >= 0 ? "var(--wata-color-profit)" : "var(--wata-color-loss)"})),
              Plot.linearRegressionY(chartData, { x: dateColumn, y: valueColumn, stroke: "var(--theme-foreground-muted)", strokeWidth: 1.5, strokeDasharray: "2,2" }),
              Plot.line(chartData, { x: dateColumn, y: valueColumn, stroke: "var(--theme-foreground)", strokeWidth: 1.5 }),
              Plot.dot([lastWeek], { x: dateColumn, y: valueColumn, fill: lastWeekValue >= 0 ? "var(--wata-color-profit)" : "var(--wata-color-loss)" }),
              Plot.tip(chartData, Plot.pointerX({ x: dateColumn, y: valueColumn, title: (d) => `${d[displayColumn]}: ${d[valueColumn].toFixed(2)}%`, format: {y: d => formatPercent(d)} }))
            ]
          })
        )}
        ${resize((width) =>
          Plot.plot({
            width, height: 40, axis: null, x: {inset: 40},
            marks: [
              Plot.tickX(chartData, { x: valueColumn, strokeOpacity: 0.5, insetTop: 10, insetBottom: 10, title: (d) => `${d[displayColumn]}: ${d[valueColumn].toFixed(2)}%`, tip: {anchor: "bottom"}, stroke: d => d[valueColumn] >= 0 ? "var(--wata-color-profit)" : "var(--wata-color-loss)"}),
              Plot.text([`${Math.round(range[0])}%`], {frameAnchor: "left"}),
              Plot.text([`${Math.round(range[1])}%`], {frameAnchor: "right"})
            ]
          })
        )}
        <span class="small muted">52-week performance with trend line</span>
    `;
  } else {
    return html.fragment`<p>Insufficient data to display performance card for "${title}".</p>`;
  }
}

export function formatPercent(value, format) {
  return value == null
    ? "N/A"
    : (value / 100).toLocaleString("en-US", {minimumFractionDigits: 2, style: "percent", ...format});
}

export function trend(v) {
  return v >= 0.005 ? html`<span>↗︎</span>`
    : v <= -0.005 ? html`<span>↘︎</span>`
    : "→";
}