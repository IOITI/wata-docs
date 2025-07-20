---
title: Trading Stats
toc: false
theme: [ alt, wide, dark ]
sql:
  turbo_data_position: ./turbo_data_position.parquet
  trade_performance: ./trade_performance.parquet
---

```sql id=profit_loss_data_full_time
SELECT strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
       COUNT(*) AS trade_number,
       COUNT(CASE WHEN position_total_performance_percent > 0 THEN 1 END) AS profit_count,
       COUNT(CASE WHEN position_total_performance_percent < 0 THEN 1 END) AS loss_count,
       ROUND(
           100.0 * COUNT(CASE WHEN position_total_performance_percent > 0 THEN 1 END) / COUNT(*),
           2
       ) AS profitable_percentage,
       SUM(position_profit_loss) AS profit_loss_sum
FROM turbo_data_position
WHERE position_status = 'Closed'
GROUP BY day_date
ORDER BY day_date DESC;
```

```sql id=cumulative_profit_loss_data_full_time
WITH daily_profit_loss AS (
    SELECT 
        strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
        SUM(position_profit_loss) AS daily_profit_loss_sum
    FROM turbo_data_position
    WHERE position_status = 'Closed'
    GROUP BY day_date
)
SELECT 
    day_date,
    SUM(daily_profit_loss_sum) OVER (ORDER BY day_date) AS cumulative_profit_loss
FROM daily_profit_loss
ORDER BY day_date DESC;
```


```sql id=profit_loss_by_year_flat_tax
SELECT 
    strftime(execution_time_close, '%Y') AS year,
    SUM(position_profit_loss) AS daily_profit_loss_sum,
    CASE 
        WHEN daily_profit_loss_sum > 0 THEN daily_profit_loss_sum * 0.30
        ELSE 0
    END AS french_flat_tax
FROM turbo_data_position
WHERE position_status = 'Closed'
GROUP BY year
```


```sql id=streak_data
WITH profitable_days AS (
    SELECT 
        strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
        CASE WHEN SUM(position_profit_loss) > 0 THEN 1 ELSE 0 END AS is_profitable_day
    FROM turbo_data_position
    WHERE position_status = 'Closed'
    GROUP BY day_date
),
streaks AS (
    SELECT
        day_date,
        is_profitable_day,
        ROW_NUMBER() OVER (ORDER BY day_date) - ROW_NUMBER() OVER (PARTITION BY is_profitable_day ORDER BY day_date) AS streak_id
    FROM profitable_days
),
streak_lengths AS (
    SELECT 
        is_profitable_day,
        streak_id,
        COUNT(*) AS streak_length
    FROM streaks
    WHERE is_profitable_day = 1
    GROUP BY is_profitable_day, streak_id
)
SELECT 
    MAX(streak_length) AS best_streak,
    (SELECT COUNT(*)
     FROM streaks
     WHERE is_profitable_day = 1
       AND day_date >= (SELECT MAX(day_date) 
                        FROM streaks 
                        WHERE is_profitable_day = 0)
    ) AS current_streak
FROM streak_lengths;
```

```sql id=candle_profit_data
WITH daily_profit_loss AS (
    -- Step 1: Calculate cumulative profit/loss for each trade within a day
    SELECT
        strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
        execution_time_close,
        position_profit_loss,
        SUM(position_profit_loss) OVER (PARTITION BY strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') 
                                        ORDER BY execution_time_close) AS intraday_cumulative_profit_loss
    FROM turbo_data_position
    WHERE position_status = 'Closed'
),
daily_intraday_stats AS (
    -- Step 2: Calculate intraday high and low based on cumulative profit/loss for the day
    SELECT 
        day_date,
        MAX(intraday_cumulative_profit_loss) AS intraday_high,
        MIN(intraday_cumulative_profit_loss) AS intraday_low,
        COUNT(*) AS trade_volume
    FROM daily_profit_loss
    GROUP BY day_date
),
daily_totals AS (
    -- Step 3: Calculate total profit/loss for each day
    SELECT 
        strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
        SUM(position_profit_loss) AS daily_profit_loss_sum
    FROM turbo_data_position
    WHERE position_status = 'Closed'
    GROUP BY day_date
),
cumulative_stats AS (
    -- Step 4: Compute cumulative profit/loss over all days
    SELECT
        day_date,
        SUM(daily_profit_loss_sum) OVER (ORDER BY day_date) AS cumulative_profit_loss
    FROM daily_totals
),
final_stats_with_adjustments AS (
    -- Step 5: Combine stats and adjust High/Low based on cumulative profit/loss
    SELECT 
        d.day_date AS Date,
        COALESCE(LAG(c.cumulative_profit_loss, 1) OVER (ORDER BY d.day_date), 0) AS Open,
        c.cumulative_profit_loss AS Close,
        COALESCE(LAG(c.cumulative_profit_loss, 1) OVER (ORDER BY d.day_date), 0) 
            + i.intraday_high AS High,
        COALESCE(LAG(c.cumulative_profit_loss, 1) OVER (ORDER BY d.day_date), 0) 
            + i.intraday_low AS Low,
        i.trade_volume AS Volume
    FROM daily_intraday_stats i
    JOIN cumulative_stats c ON i.day_date = c.day_date
    JOIN daily_totals d ON i.day_date = d.day_date
)
SELECT * FROM final_stats_with_adjustments
ORDER BY Date;
```


```js
const best_streak = streak_data.get(0).best_streak;
const current_streak = streak_data.get(0).current_streak;
```

```js
const profit_loss_data_time_picked = await sql([`WITH recent_trades AS (
    SELECT strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
           position_total_performance_percent,
           position_profit_loss,
           position_status
    FROM turbo_data_position
    WHERE position_status = 'Closed'
)
SELECT day_date,
       COUNT(*) AS trade_number,
       COUNT(CASE WHEN position_total_performance_percent > 0 THEN 1 END) AS profit_count,
       COUNT(CASE WHEN position_total_performance_percent < 0 THEN 1 END) AS loss_count,
       ROUND(
           100.0 * COUNT(CASE WHEN position_total_performance_percent > 0 THEN 1 END) / COUNT(*),
           2
       ) AS profitable_percentage,
       SUM(position_profit_loss) AS profit_loss_sum
FROM recent_trades
WHERE day_date >= (current_date - INTERVAL ${time_picked} DAY)
GROUP BY day_date
ORDER BY day_date DESC;`])

const cumulative_profit_loss_data_time_picked = await sql([`WITH daily_profit_loss AS (
    SELECT 
        strptime(strftime(execution_time_close, '%Y/%m/%d'), '%Y/%m/%d') AS day_date,
        SUM(position_profit_loss) AS daily_profit_loss_sum
    FROM turbo_data_position
    WHERE position_status = 'Closed'
    GROUP BY day_date
)
SELECT 
    day_date,
    SUM(daily_profit_loss_sum) OVER (ORDER BY day_date) AS cumulative_profit_loss
FROM daily_profit_loss
WHERE day_date >= (current_date - INTERVAL ${time_picked} DAY)
ORDER BY day_date DESC;`])

```

```js
function flat_tax_table() {
    return resize((width) => 
        Inputs.table(profit_loss_by_year_flat_tax, {
          width,
          columns: [
            "year",
            "french_flat_tax"
          ],
          header: {
            year: "Year",
            french_flat_tax: "Flat Tax (€)"
          }
        })
    );
}

function graph_cumulative_profit_loss_bar_chart() {
    return resize((width) => 
        Plot.plot({
            width,
            height: 250,
            //title: "Cumulative Profit / Loss in € by Day",
            caption: `Displays cumulative profit/loss for the past ${time_picked} days`,
            x: {label: "Date", grid: true, interval: d3.utcDay},
            y: {label: "Cumulative Profit / Loss (€)", grid: true},
            marks: [
                () => htl.svg`<defs>#ff00cc, #3399ff, #00ffd5
                  <linearGradient id="loss_gradient_1" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="#ee0979" stop-opacity="1" />
                    <stop offset="55%" stop-color="red" stop-opacity="1" />
                    <stop offset="95%" stop-color="#ff6a00" stop-opacity="1" />
                  </linearGradient>
                  <linearGradient id="profit_gradient_1" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="#66ff00" stop-opacity="1" />
                    <stop offset="55%" stop-color="#a8ff78" stop-opacity="1" />
                    <stop offset="95%" stop-color="#93F9B9" stop-opacity="1" />
                  </linearGradient>
                </defs>`,
                Plot.crosshairX(cumulative_profit_loss_data_time_picked, {x: "day_date", y: "cumulative_profit_loss", color: d => d.cumulative_profit_loss >= 0 ? "url(#profit_gradient_1)" : "url(#loss_gradient_1)", opacity: 0.5}),
                Plot.rectY(cumulative_profit_loss_data_time_picked, {
                    x: "day_date",
                    y: "cumulative_profit_loss",
                    r: 2,
                    fill: d => d.cumulative_profit_loss >= 0 ? "url(#profit_gradient_1)" : "url(#loss_gradient_1)",
                    fillOpacity: 0.8,
                    tip: true,
                }),
                Plot.textY(cumulative_profit_loss_data_time_picked, {
                    x: "day_date",
                    y: d => d.cumulative_profit_loss / 2,
                    text: d => `${d.cumulative_profit_loss.toFixed(2)}\n€`,
                    fill: d => d.cumulative_profit_loss >= 0 ? "black" : "white",
                    fontSize: time_picked > 60 ? 0 : 9,
                    textAnchor: "middle"
                })
            ]
        })
    );
}

function graph_profit_loss_bar_chart() {
    return resize((width) => 
        Plot.plot({
            width,
            height: 250,
            title: "Profit / Loss in € by Day",
            caption: `Displays daily profit/loss for the past ${time_picked} days`,
            x: {label: "Date", grid: true, interval: d3.utcDay},
            y: {label: "Profit / Loss (€)", grid: true},
            marks: [
                Plot.crosshairX(profit_loss_data_time_picked, {x: "day_date", y: "profit_loss_sum", color: d => d.profit_loss_sum >= 0 ? "url(#profit_gradient_1)" : "url(#loss_gradient_1)", opacity: 0.5}),
                Plot.rectY(profit_loss_data_time_picked, {
                    x: "day_date",
                    y: "profit_loss_sum",
                    r: 2,
                    fill: d => d.profit_loss_sum >= 0 ? "url(#profit_gradient_1)" : "url(#loss_gradient_1)",
                    fillOpacity: 0.8,
                    tip: true,
                }),
                Plot.textY(profit_loss_data_time_picked, {
                    x: "day_date",
                    y: d => d.profit_loss_sum / 2,
                    text: d => `${d.profit_loss_sum.toFixed(2)}\n€`,
                    fill: d => d.profit_loss_sum >= 0 ? "black" : "white",
                    fontSize: time_picked > 60 ? 0 : 9,
                    textAnchor: "middle"
                })
            ]
        })
    );
}

function candle_profit_loss_over_time() {
    return resize((width) => 
        Plot.plot({
          inset: 6,
          width,
          height: 320,
          grid: true,
          title: "Candle ticks of Profit / Loss in € by Day",
          y: {label: "Profit / Loss (€)"},
          color: {domain: [-1, 0, 1], range: ["#ee0979", "currentColor", "#a8ff78"]},
          marks: [
            Plot.crosshairX(candle_profit_data, {x: "Date", y: "Close", opacity: 0.5}),
            Plot.ruleX(candle_profit_data, {
              x: "Date",
              y1: "Low",
              y2: "High"
            }),
            Plot.ruleX(candle_profit_data, {
              x: "Date",
              y1: "Open",
              y2: "Close",
              stroke: (d) => Math.sign(d.Close - d.Open),
              strokeWidth: 4,
              strokeLinecap: "round",
              channels: {Date: "Date", Open: "Open", Close: "Close", Low: "Low", High: "High", Volume: "Volume",},
              tip: {
                  format: {
                    y1: false,
                    y2: false,
                    Date: true,
                    Open: (d) => `${d.toFixed(3)} €`,
                    Close: (d) => `${d.toFixed(3)} €`,
                    High: (d) => `${d.toFixed(3)} €`,
                    Low: (d) => `${d.toFixed(3)} €`,
                    Volume: (d) => `${d.toFixed(0)} Trade(s)`,
                    stroke: true
                  }
              }
            })
          ]
        })
    );
}
```

```sql id=yearly_performance
SELECT
    date_trunc('year', execution_time_close) as month_date,
    EXTRACT(YEAR FROM date_trunc('year', execution_time_close)) as year,
    (PRODUCT(1 + position_total_performance_percent / 100.0) - 1) * 100 AS year_pl_percentage,
    SUM(position_profit_loss) AS year_money_made
FROM
    turbo_data_position
GROUP BY
    date_trunc('year', execution_time_close)
ORDER BY
    date_trunc('year', execution_time_close);
```

```sql id=monthly_performance
SELECT
    date_trunc('month', execution_time_close) as month_date,
    STRFTIME(date_trunc('month', execution_time_close), '%B %Y') AS month_year,
    EXTRACT(YEAR FROM date_trunc('month', execution_time_close)) as year,
    EXTRACT(MONTH FROM date_trunc('month', execution_time_close)) as month,
    (PRODUCT(1 + position_total_performance_percent / 100.0) - 1) * 100 AS month_pl_percentage,
    SUM(position_profit_loss) AS month_money_made
FROM
    turbo_data_position
GROUP BY
    date_trunc('month', execution_time_close)
ORDER BY
    date_trunc('month', execution_time_close);
```

```sql id=weekly_performance 
SELECT
    date_trunc('week', execution_time_close) as week_date,
    EXTRACT(YEAR FROM date_trunc('week', execution_time_close)) as year,
    -- DuckDB's EXTRACT(WEEK...) is ISO standard (Monday is first day of week)
    EXTRACT(WEEK FROM date_trunc('week', execution_time_close)) as week_of_year, 
    STRFTIME(date_trunc('week', execution_time_close), 'Week %V, %Y') as week_display, -- For tooltips
    (PRODUCT(1 + position_total_performance_percent / 100.0) - 1) * 100 AS week_pl_percentage,
    SUM(position_profit_loss) AS week_money_made
FROM
    turbo_data_position
GROUP BY
    date_trunc('week', execution_time_close)
ORDER BY
    date_trunc('week', execution_time_close) DESC
LIMIT 10; 
```

```js

function yearly_performance_chart() {
    const [minYear, maxYear] = d3.extent(yearly_performance, d => d.year);
    
    return resize((width) => Plot.plot({
        width,
        padding: 0,
        height: 70,
        x: {
            domain: d3.range(minYear, maxYear + 1),
            reverse: true,
            axis: null // This hides the axis line and ticks at the bottom
        },
        color: {
            type: "threshold",
            domain: [0],
            range: ["url(#loss_gradient_1)", "url(#profit_gradient_1)"],
            fillOpacity: 0.9,
            label: "Yearly Performance",
            legend: false
        },
        marks: [
            Plot.cell(yearly_performance, {
                x: d => d.year,       
                fill: "year_pl_percentage",
                inset: 2,
                rx: 8,
                tip: true,
                title: d => `${d.year}\nYearly P/L: ${d.year_money_made.toLocaleString("en-US", {style: "currency", currency: "USD"})}\nYearly %: ${d.year_pl_percentage.toFixed(2)}%`
            }),
            Plot.text(yearly_performance, {
                x: d => d.year,
                text: d => `${d.year.toString()}`, // Display the year
                fill: d => d.year_pl_percentage > 0 ? "black" : "white",
                fontWeight: "bold",
                fontSize: 16,
                dy: -18 // Position it towards the top of the cell
            }),
            Plot.text(yearly_performance, {
                x: d => d.year,
                text: d => `${d.year_pl_percentage.toFixed(2)}%`,
                fontSize: 12,
                fill: d => d.year_pl_percentage > 0 ? "black" : "white",
                fontWeight: "bold",
                dy: 5 // Move down to the center
            }),
            Plot.text(yearly_performance, {
                x: d => d.year,
                text: d => `💶 ${d.year_money_made.toFixed(2)}`, // Removed € to use currency formatting in tip
                fontSize: 10,
                fill: d => d.year_pl_percentage > 0 ? "black" : "white",
                fillOpacity: 0.8,
                dy: 20 // Move down below the percentage
            })
        ]
    }));
}

// Charting function for the Monthly Heatmap
function monthly_performance_chart() {
    const [minYear, maxYear] = d3.extent(monthly_performance, d => d.year);
    
    return resize((width) => Plot.plot({
        width,
        height: (maxYear - minYear + 1) * 90, 
        padding: 0,

        caption: "Each cell shows the performance for that specific month.",
        y: {
            domain: d3.range(minYear, maxYear + 1),
            reverse: true,
            tickFormat: d => d.toString()
        },
        x: {
            domain: d3.range(12),
            tickFormat: i => d3.utcFormat("%b")(new Date(Date.UTC(2000, i, 15))),
            label: null
        },
        color: {
            type: "threshold",
            domain: [0],
            range: ["url(#loss_gradient_1)", "url(#profit_gradient_1)"],
            fillOpacity: 0.9,
            label: "Monthly Performance",
            legend: false
        },
        marks: [
            Plot.cell(monthly_performance, {
                x: d => d.month - 1, 
                y: d => d.year,       
                fill: "month_pl_percentage",
                inset: 2,
                rx: 8,
                tip: true,
                title: d => `${d.month_year}\nMonthly P/L: ${d.month_money_made.toFixed(2)}€\nMonthly %: ${d.month_pl_percentage.toFixed(2)}%`
            }),
            Plot.text(monthly_performance, {
                x: d => d.month - 1,
                y: d => d.year,
                text: d => `${d.month_pl_percentage.toFixed(2)}%`,
                fontSize: 12,
                fill: d => d.month_pl_percentage > 0 ? "black" : "white",
                fontWeight: "bold",
                textAnchor: "middle",
                dy: -8
            }),
            Plot.text(monthly_performance, {
                x: d => d.month - 1,
                y: d => d.year,
                text: d => `💶 ${d.month_money_made.toFixed(2)}€`,
                fontSize: 10,
                fill: d => d.month_pl_percentage > 0 ? "black" : "white",
                fillOpacity: 0.8,
                textAnchor: "middle",
                dy: 8
            })
        ]
    }));
}

// NEW Charting function for the Weekly Heatmap
function weekly_performance_chart() {
    // Determine year range from weekly data
    const [minYear, maxYear] = d3.extent(weekly_performance, d => d.year);

    return resize((width) => Plot.plot({
        width,
        padding: 0,
        marginLeft: 100,
        caption: "Each cell represents the performance for a specific week of the year.",
        x: {
            domain: d3.range(minYear, maxYear + 1),
            reverse: true, // Show most recent year on top
            tickFormat: d => d.toString()
        },
        y: {
            label: "Week of Year",
            reverse: true,
        },
        color: {
            // Re-use the same color scale logic
            type: "threshold",
            domain: [0],
            range: ["url(#loss_gradient_1)", "url(#profit_gradient_1)"],
            fillOpacity: 0.9,
            label: "Weekly Performance",
            legend: false
        },
        marks: [
            Plot.cell(weekly_performance, {
                y: "week_display",
                x: "year",
                fill: "week_pl_percentage",
                inset: 1, // smaller inset for smaller cells
                rx: 4,    // smaller corner radius
                tip: true,
                // Use the new columns for the tooltip
                title: d => `${d.week_display}\nWeekly P/L: ${d.week_money_made.toFixed(2)}€\nWeekly %: ${d.week_pl_percentage.toFixed(2)}%`
            }),
            Plot.text(weekly_performance, {
                y: "week_display",
                x: "year",
                // Weekly cells are smaller, so we only show the percentage.
                // Rounding to one decimal place is often clearer here.
                text: d => d.week_pl_percentage > 0 ? `📈 ${d.week_pl_percentage.toFixed(1)}% | 💶 ${d.week_money_made.toFixed(2)}€` : `📉 ${d.week_pl_percentage.toFixed(1)}% | 💶 ${d.week_money_made.toFixed(2)}€`,
                fontSize: 9, // smaller font for smaller cells
                fill: d => d.week_pl_percentage > 0 ? "black" : "white",
                fontWeight: "bold",
                textAnchor: "middle"
            })
        ]
    }));
}
```

```sql id=current_streak_performance
WITH profitable_days AS (
    SELECT 
        date_trunc('day', execution_time_close) AS day_date,
        CASE WHEN SUM(position_profit_loss) > 0 THEN 1 ELSE 0 END AS is_profitable_day
    FROM turbo_data_position
    WHERE position_status = 'Closed'
    GROUP BY day_date
)
SELECT 
    SUM(position_profit_loss) AS streak_money_made,
    (PRODUCT(1 + position_total_performance_percent / 100.0) - 1) * 100 AS streak_pl_percentage,
    MIN(execution_time_close) AS streak_start_date, -- New: Get the first transaction time of the streak
    MAX(execution_time_close) AS streak_end_date   -- New: Get the last transaction time of the streak
FROM turbo_data_position
WHERE 
    position_status = 'Closed' 
    AND date_trunc('day', execution_time_close) > (
        -- Find the last day that was NOT profitable. The current streak starts the day after.
        -- We use COALESCE to handle the case where there has never been a losing day.
        SELECT COALESCE(MAX(day_date), '1970-01-01'::DATE)
        FROM profitable_days
        WHERE is_profitable_day = 0
    )
```

```js
// --- Data for Current Streak Performance ---
const streak_perf = current_streak_performance.get(0);
const streak_money_made = streak_perf?.streak_money_made ?? 0;
const streak_pl_percentage = streak_perf?.streak_pl_percentage ?? 0;
const streak_start_date = streak_perf?.streak_start_date;
const streak_end_date = streak_perf?.streak_end_date;
```


# ✨ Highlights

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Consecutive Days Without Loss</h2>
        <table>
          <tr>
            <td align="left">Current</td>
            <td align="right">Best</td>
          </tr>
          <tr>
            <td align="left"><span class="big">${current_streak} days</span></td>
            <td align="right"><span class="big">${best_streak} days</span></td>
          </tr>
        </table>
  </div>
  <div class="card">
    <h2>Current Streak P/L (%)</h2>
    <h3><i>${new Date(streak_start_date).toLocaleDateString()} to ${new Date(streak_end_date).toLocaleDateString()}</i></h3>
    <span class="big">${streak_pl_percentage.toFixed(2)}%</span>
  </div>
  <div class="card">
    <h2>Current Streak P/L (€)</h2>
    <h3><i>${new Date(streak_start_date).toLocaleDateString()} to ${new Date(streak_end_date).toLocaleDateString()}</i></h3>
    <span class="big">${streak_money_made.toFixed(2) || 0} €</span>
  </div>
  <div class="card">
    <h2>Current balance</h2>
    <h3><i>${new Date(d3.min(profit_loss_data_full_time, (d) => d.day_date)).toLocaleDateString()} to ${new Date(d3.max(profit_loss_data_full_time, (d) => d.day_date)).toLocaleDateString()}</i></h3>
    <span class="big">${cumulative_profit_loss_data_full_time.slice(0,1).get("").cumulative_profit_loss.toFixed(2) || 0} €</span>
  </div>
</div>


<div class="grid grid-cols-4" style="margin-top: 2rem;">
  <div class="card grid-colspan-3">
    ${candle_profit_loss_over_time()}
  </div>
  <div class="card">
    <h2>Weekly Cumulative Performance Overview</h2>
    <span class="small muted"><i>Shows cumulative performance percentage for each week</i></span>
    ${weekly_performance_chart()}
  </div>
</div>


```js
// Time picker input for day range selection
const time_picked_input = Inputs.range([1, 365], {step: 1});
const time_picked = Generators.input(time_picked_input);
```

---

# 💰/ 💸 Money stats

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Current balance</h2>
    <h3><i>${new Date(d3.min(profit_loss_data_full_time, (d) => d.day_date)).toLocaleDateString()} to ${new Date(d3.max(profit_loss_data_full_time, (d) => d.day_date)).toLocaleDateString()}</i></h3>
    <span class="big">${cumulative_profit_loss_data_full_time.slice(0,1).get("").cumulative_profit_loss.toFixed(2) || 0} €</span>
  </div>
  <div class="card">
    <h2>🇫🇷 Flat Tax by year</h2>
    ${flat_tax_table()}
  </div>
</div>

## General filters

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Number of days to display</h2>
    ${time_picked_input}
    <span class="small muted"><i>Applied only on certain indicator</i></span>
  </div>
</div>

<div class="grid grid-cols-2-3" style="grid-auto-rows: auto;">
  <div class="card">
    <h2>Cumulative Profit / Loss in € by Day</h2>
    ${graph_cumulative_profit_loss_bar_chart()}</div>
  <div class="card">${graph_profit_loss_bar_chart()}</div>
  <div class="card">${candle_profit_loss_over_time()}</div>
</div>

---

# 📈 Performance stats

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Consecutive Days Without Loss</h2>
        <table>
          <tr>
            <td align="left">Current</td>
            <td align="right">Best</td>
          </tr>
          <tr>
            <td align="left"><span class="big">${current_streak} days</span></td>
            <td align="right"><span class="big">${best_streak} days</span></td>
          </tr>
        </table>
  </div>
  <div class="card">
    <h2>Current Streak P/L (%)</h2>
    <h3><i>${new Date(streak_start_date).toLocaleDateString()} to ${new Date(streak_end_date).toLocaleDateString()}</i></h3>
    <span class="big">${streak_pl_percentage.toFixed(2)}%</span>
  </div>
  <div class="card">
    <h2>Current Streak P/L (€)</h2>
    <h3><i>${new Date(streak_start_date).toLocaleDateString()} to ${new Date(streak_end_date).toLocaleDateString()}</i></h3>
    <span class="big">${streak_money_made.toFixed(2) || 0} €</span>
  </div>
  <div class="card">
    <h2>Yearly Performance</h2>
    ${yearly_performance_chart()}
  </div>
</div>

<div class="grid grid-cols-4" style="margin-top: 2rem;">
  <div class="card grid-colspan-3">
    <h2>Monthly Cumulative Performance Overview</h2>
    <span class="small muted"><i>Shows cumulative performance percentage and monthly profit/loss for each month</i></span>
    ${monthly_performance_chart()}
  </div>
  <div class="card">
    <h2>Weekly Cumulative Performance Overview</h2>
    <span class="small muted"><i>Shows cumulative performance percentage for each week</i></span>
    ${weekly_performance_chart()}
  </div>
</div>


```js
function performance_by_day() {
  const start = d3.utcDay.offset(d3.min(profit_loss_data_full_time, (d) => d.day_date));
  const end = d3.utcDay.offset(d3.max(profit_loss_data_full_time, (d) => d.day_date));

  // Helper function to get the start of the month from a date string.
  // This ensures all days in the same month map to the same y-position.
  const getMonth = (dateStr) => d3.utcMonth.floor(new Date(dateStr));

  return resize((width) => Plot.plot({
    width,
    // The height calculation is already correct and will work with this change.
    height: (d3.utcMonth.count(start, end) + 1) * 62,
    padding: 0,
    title: "Trade Performance by Day", // Added a title for clarity
    caption: "Each cell represents the percentage profit or loss for that day.", // Added a caption
    y: { 
      tickFormat: d3.utcFormat("%b %Y"),
      paddingTop: 3,
      paddingBottom: 3
    },
    color: {
        type: "threshold",
        domain: [0],
        range: ["url(#loss_gradient_1)", "url(#profit_gradient_1)"],
        fillOpacity: 0.9,
        label: "Monthly Performance",
        legend: false
    },
    marks: [
      // Cell with color and tooltip based on `perf_day_real`
      Plot.cell(day_performance, Plot.group({ fill: "max" }, {
        x: d => new Date(d["date_day_format"]).getUTCDate(),
        y: d => getMonth(d.date_day_format),
        fill: "perf_day_real",
        inset: 1,
        title: d => `Performance: ${d["perf_day_real"].toFixed(2)}%`, // Added % to tooltip
        fillOpacity: 0.8,
      })),
      
      // Text inside each cell showing `perf_day_real` value
      Plot.text(day_performance, Plot.group({ text: "max" }, {
        x: d => new Date(d["date_day_format"]).getUTCDate(),
        // UPDATED: Use the same time mapping for y.
        y: d => getMonth(d.date_day_format),
        text: d => `${d["perf_day_real"].toFixed(2)}%`,
        fontSize: 8,
        fontWeight: "bold",
        fill: d => d.perf_day_real > 0 ? "black" : "white",
        textAnchor: "middle",
        dy: 0
      }))
    ]
  }));
}


function graph_performance_difference_bar_chart() {
    return resize((width) => 
        Plot.plot({
            width,
            height: 250,
            //title: "Cumulative Profit / Loss in € by Day",
            //caption: `Displays cumulative profit/loss for the past ${time_picked} days`,
            x: {label: "Date", grid: true, interval: d3.utcDay},
            y: {label: "Performance (%)", grid: true},
            marks: [
                Plot.crosshairX(day_performance, {x: "date_day_format", y: "perf_day_real", color: d => d.perf_day_real >= 0 ? "url(#profit_gradient_1)" : "url(#loss_gradient_1)", opacity: 0.5}),
                Plot.rectY(day_performance, {
                    x: "date_day_format",
                    y: "perf_day_real",
                    r: 2,
                    fill: d => d.perf_day_real >= 0 ? "url(#profit_gradient_1)" : "url(#gradient_3)",
                    fillOpacity: 0.8,
                    tip: true,
                }),
                Plot.textY(day_performance, {
                    x: "date_day_format",
                    y: d => d.perf_day_real / 2,
                    text: d => `${d.perf_day_real.toFixed(2)}\n€`,
                    fill: "white",
                    fontSize: time_picked > 0 ? 0 : 9,
                    textAnchor: "middle"
                })
            ]
        })
    );
}
```

<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${performance_by_day()}</div>
</div>

<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${graph_performance_difference_bar_chart()}</div>
</div>

---


# 📊 Trade postions stats

```sql id=trade_count_by_action 
SELECT action, COUNT(*) AS trade_count, SUM(position_profit_loss) AS profit_loss_sum
FROM turbo_data_position 
WHERE position_status = 'Closed'
GROUP BY action
```

```sql id=day_performance
SELECT strptime(strftime(date_day, '%Y/%m/%d'), '%Y/%m/%d') AS date_day_format,
       strftime(date_day, '%Y/%m/%d') AS date_day_string,
       perf_day_real
FROM trade_performance
WHERE trade_number_real != 0
```

```sql id=avg_per_week
SELECT week(date_day) AS week_number, avg(perf_day_real) FROM trade_performance GROUP BY week_number ORDER BY week_number DESC
```

```sql id=avg_52_week
SELECT 
    AVG(perf_day_real) AS avg_52_week_performance
FROM 
    trade_performance
WHERE 
    date_day >= (current_date - INTERVAL '52 weeks')
```

```sql id=avg_4_week
SELECT 
    AVG(perf_day_real) AS avg_4_week_performance
FROM 
    trade_performance
WHERE 
    date_day >= (current_date - INTERVAL '4 weeks')
```


```js
// Convert Arrow table to a key-value map for easier access
const tradeCounts = Object.fromEntries(
  trade_count_by_action.toArray().map(row => [row.action, row])
);
```

```js
function performance_card() {    
    // Access the last and second-to-last week performance
    const lastWeek = avg_per_week.at(0); // The most recent week
    const secondLastWeek = avg_per_week.at(1); // The week before the most recent one

    // Make sure the data exists before calculating
    if (lastWeek && secondLastWeek) {
        const diff1 = lastWeek["avg(perf_day_real)"] - secondLastWeek["avg(perf_day_real)"]; // Compare average performance between weeks
        const range = d3.extent(day_performance.slice(-52), (d) => d["perf_day_real"]); // Range of last 52 weeks


        return html.fragment`
        <h2>Week average performance per day</h2>
        <h1 style="color: ${lastWeek["avg(perf_day_real)"] >= 0 ? "var(--wata-color-profit)" : "var(--wata-color-loss)"}">${formatPercent(lastWeek["avg(perf_day_real)"])}</h1>
        <table>
          <tr>
            <td>1-week change</td>
            <td align="right">${formatPercent(diff1, {signDisplay: "always"})}</td>
            <td>${trend(diff1)}</td>
          </tr>
          <tr>
            <td>4-week average</td>
            <td align="right">${formatPercent(avg_4_week.at(0)["avg_4_week_performance"])}</td>
          </tr>
          <tr>
            <td>52-week average</td>
            <td align="right">${formatPercent(avg_52_week.at(0)["avg_52_week_performance"])}</td>
          </tr>
        </table>
        ${resize((width) =>
          Plot.plot({
            width,
            height: 40,
            axis: null,
            x: {inset: 40},
            marks: [
              Plot.tickX(day_performance.slice(-52), {
                x: "perf_day_real",
                strokeOpacity: 0.5,
                insetTop: 10,
                insetBottom: 10,
                title: (d) => `${d["date_day_string"]}: ${d["perf_day_real"].toFixed(2)}%`,
                tip: {anchor: "bottom"}
              }),
              Plot.text([`${Math.round(range[0])}%`], {frameAnchor: "left"}),
              Plot.text([`${Math.round(range[1])}%`], {frameAnchor: "right"})
            ]
          })
        )}
        <span class="small muted">52-week range</span>
        `;
    } else {
        return html.fragment`<p>Data not available</p>`;
    }
}

function formatPercent(value, format) {
  return value == null
    ? "N/A"
    : (value / 100).toLocaleString("en-US", {minimumFractionDigits: 2, style: "percent", ...format});
}

function trend(v) {
  return v >= 0.005 ? html`<span class="url(#profit_gradient_1)">↗︎</span>`
    : v <= -0.005 ? html`<span class="url(#loss_gradient_1)">↘︎</span>`
    : "→";
}
```

```sql id=trade_profitability_by_price_range_data
CREATE OR REPLACE TEMP TABLE trade_profitability AS
SELECT
    FLOOR(position_open_price / 2) * 2 AS price_bin_start,
    (COUNT_IF(position_profit_loss > 0) * 100.0 / COUNT(*)) AS profitability_percentage,
    (COUNT_IF(position_profit_loss <= 0) * 100.0 / COUNT(*)) AS loss_percentage,
    COUNT(*) AS total_trades,
FROM turbo_data_position
WHERE position_status = 'Closed'
GROUP BY price_bin_start
ORDER BY price_bin_start;

SELECT
    price_bin_start,
    total_trades,
    CONCAT(price_bin_start, '€ - ', price_bin_start + 2, '€') as price_range,
    ROUND(profitability_percentage, 0) AS profitability_percentage,
    loss_percentage
FROM trade_profitability;
```

```js
// Function to create a bar chart for trade profitability by price range
function trade_profitability_by_price_range() {
    return resize((width) => 
        Plot.plot({
            width,
          axis: null,
          label: null,
          height: 260,
          marginTop: 20,
          marginBottom: 70,
          //title: "Trade Profitability by Price Range",
          marks: [
            () => htl.svg`<defs>
              <linearGradient id="gradient_3" gradientTransform="rotate(125)">
                <stop offset="1%" stop-color="#fd0" stop-opacity="1" />
                <stop offset="40%" stop-color="#ff3864" stop-opacity="1" />
                <stop offset="90%" stop-color="#6a0dad" stop-opacity="1" />
              </linearGradient>
            </defs>`,
            Plot.axisFx(trade_profitability_by_price_range_data, {fx: "price_bin_start", text: (d) => `${d.total_trades} trades`, frameAnchor: "top", lineAnchor: "top", dy: 2, fill: "url(#gradient_3)", fontSize: 24, fontWeight: "bold", }),
            Plot.waffleY({length: 1}, {y: 100, fillOpacity: 0.4, rx: 3, dy: 20}),
            Plot.waffleY(trade_profitability_by_price_range_data, {fx: "price_bin_start", y: "profitability_percentage", rx: 3, fill: "url(#gradient_3)", fillOpacity: 0.9, dy: 20}),
            Plot.text(trade_profitability_by_price_range_data, {fx: "price_bin_start", text: (d) => `${d.profitability_percentage}% 📈`, frameAnchor: "bottom", lineAnchor: "top", dy: 26, fill: "url(#gradient_3)", fontSize: 24, fontWeight: "bold"}),
            Plot.axisFx(trade_profitability_by_price_range_data, {fx: "price_bin_start", lineWidth: 10, anchor: "bottom", dy: 42, fontSize: 14, fontWeight: "bold", fillOpacity: 0.6, text: (d) => `${d.price_range}`})
          ]
        })
    );
}
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Long 📈</h2>
    <span class="big">${tradeCounts.long?.trade_count || 0}</span>
    <span class="muted"> / ${(tradeCounts.long?.trade_count || 0) + (tradeCounts.short?.trade_count || 0)}</span>
    <br><br>
    <span class="muted">Total Profit / Loss : ${(tradeCounts.long?.profit_loss_sum || 0).toFixed(3)}€</span>
  </div>
  <div class="card grid-rowspan-2">${performance_card()}</div>
  <div class="card">
    <h2>Short 📉</h2>
    <span class="big">${tradeCounts.short?.trade_count || 0}</span>
    <span class="muted"> / ${(tradeCounts.long?.trade_count || 0) + (tradeCounts.short?.trade_count || 0)}</span>
    <br><br>
    <span class="muted">Total Profit / Loss : ${(tradeCounts.short?.profit_loss_sum || 0).toFixed(3)}€</span>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h2>Trade Profitability by Price Range</h2>
    <span class="small muted"><i>Bar chart showing trade profitability percentage by price range.</i></span>
    ${trade_profitability_by_price_range()}
  </div>
</div>



```js
function winrate_by_day() {
  const start = d3.utcDay.offset(d3.min(profit_loss_data_full_time, (d) => d.day_date));
  const end = d3.utcDay.offset(d3.max(profit_loss_data_full_time, (d) => d.day_date));
  
  // A helper function to get the start of the month from a date string
  const getMonth = (dateStr) => d3.utcMonth.floor(new Date(dateStr));

  return resize((width) => Plot.plot({
    width,
    height: (d3.utcMonth.count(start, end) + 1) * 62,
    padding: 0,
    title: `Trade Win-rate by Day`,
    caption: "For each cell, Primary value is trade Win-rate by day, The second value is profit made on this day.",
    y: { 
      tickFormat: d3.utcFormat("%b %Y"),
      paddingTop: 3,
      paddingBottom: 3
    },
    color: {
      type: "linear",
      legend: true,
      scheme: "GnBu",
      label: "Trade Win rate (%)"
    },
    marks: [
      // Cell with color and tooltip
      Plot.cell(profit_loss_data_full_time, Plot.group({ fill: "max" }, {
        x: d => new Date(d["day_date"]).getUTCDate(),
        y: d => getMonth(d.day_date),
        fill: d => Math.round(d["profitable_percentage"]),
        fillOpacity: 0.8,
        inset: 1,
        tip: true,
        title: d => `Profitability: ${Math.round(d["profitable_percentage"])}%\nProfitable Trades: ${d["profit_count"]}\nLoss Trades: ${d["loss_count"]}`
      })),
      
      // Text for profitable_percentage
      Plot.text(profit_loss_data_full_time, Plot.group({ text: "max" }, {
        x: d => new Date(d["day_date"]).getUTCDate(),
        y: d => getMonth(d.day_date),
        text: d => `${Math.round(d["profitable_percentage"])}%`,
        fontSize: 13,
        fill: d => (Math.round(d["profitable_percentage"]) <= 70) ? "black" : "white",
        textAnchor: "middle",
        dy: -6
      })),
      
      // Text for perf_day_real
      Plot.text(day_performance, Plot.group({ text: "max" }, {
        x: d => new Date(d["date_day_format"]).getUTCDate(),
        y: d => getMonth(d.date_day_format),
        text: d => `${d["perf_day_real"].toFixed(2)}%`,
        fill: "white",
        textAnchor: "middle",
        fillOpacity: 0.6,
        dy: 8
      }))
    ]
  }));
}
```

<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${winrate_by_day()}</div>
</div>

```sql id=position_duration_data
SELECT 
    position_open_price,
    execution_time_open,
    execution_time_close,
    EXTRACT(epoch FROM (execution_time_close - execution_time_open)) / 60 AS open_duration, -- in minutes
    CASE WHEN position_profit_loss > 0 THEN 'Profitable' ELSE 'Non-Profitable' END AS profitability
FROM turbo_data_position
WHERE position_status = 'Closed'
```

```js
// Define the scatter plot with color based on profitability
function graph_position_duration_scatter() {
    return resize((width) => 
        Plot.plot({
            width,
            height: 400,
            //title: "Position Open Price vs. Duration by Profitability",
            x: { label: "Position Open Price (€)", grid: true },
            y: { label: "Duration Open (minutes)", type: "log", grid: true },
            color: { legend: true, scheme: "set1" }, // Using a color scheme for profitability distinction
            marks: [
                Plot.dot(position_duration_data, {
                    x: "position_open_price",
                    y: "open_duration",
                    stroke: "profitability",
                    fill: "profitability",
                    fillOpacity: 0.6,
                    strokeWidth: 1.5,
                    tip: true,
                    r: 5, // radius of the dots for better visibility
                })
            ]
        })
    );
}
```

<div class="grid grid-cols-1">
  <div class="card">
    <h2>Position Open Price vs. Duration by Profitability</h2>
    <span class="small muted"><i>Scatter plot showing position open price vs. open duration, colourl(#loss_gradient_1) by profitability.</i></span>
    ${graph_position_duration_scatter()}
  </div>
</div>

# 📑 Data Tables

Raw data tables for detailed analysis.
## Position

<!-- Display full table from parquet -->

```sql id=turbo_data_position_table display
SELECT * FROM turbo_data_position WHERE execution_time_open >= DATE '2024-11-04';
```

## Trade Performance

```sql id=trade_performance_table display
SELECT * FROM trade_performance WHERE date_day >= DATE '2024-11-04';
```

---

<div class="warning">
  <p><strong>⚠️ Note</strong>, this dashboard:</p>
  <ul>
    <li>⚡ Uses client-side WASM DuckDB for real-time data processing</li>
    <li>🖥️ Is optimized for desktop viewing</li>
  </ul>
</div>



<!-- Custom styling -->
<style>

:root {
  /* Funky Primary Colors */
  --ifm-color-primary: #6a0dad;
  --ifm-color-primary-dark: #5c0c93;
  --ifm-color-primary-darker: #4c0a7a;
  --ifm-color-primary-darkest: #3c0861;
  --ifm-color-primary-light: #7c0fc8;
  --ifm-color-primary-lighter: #8f14e0;
  --ifm-color-primary-lightest: #a01ff7;

  /* Vibrant Accent Colors */
  --wata-color-profit: #a8ff78;  /* Neon url(#profit_gradient_1) */
  --wata-color-loss: #ee0979;    /* Hot Pink */
  --wata-color-neutral: #c5b4e3; /* Lavender */

  /* Funky Accents */
  --wata-color-accent-1: #ffae00; /* Electric Yellow */
  --wata-color-accent-2: #ff00cc; /* Magenta */
  --wata-color-accent-3: #00eddb; /* Cyan */
  --wata-color-accent-4: #b967ff; /* Purple */

  /* UI Elements */
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(106, 13, 173, 0.1);

  --ifm-navbar-background-color: rgba(0, 0, 0, 0.8);
  --ifm-navbar-background-hover-color: rgba(0, 0, 0, 0.8);
  --ifm-navbar-link-hover-color: var(--wata-color-accent-2);
  
  --ifm-footer-background-color: #120458;
  --ifm-footer-title-color: #ffffff;
  --ifm-footer-link-color: #d1d1d1;

  /* Typography */
  --ifm-font-family-base: 'Archivo', sans-serif;
  --ifm-heading-font-family: 'Poppins', sans-serif;
  --ifm-heading-font-weight: 700;

  /* Card & UI Component Styling */
  --ifm-card-background-color: rgba(255, 255, 255, 0.8);
  --ifm-card-border-radius: 16px;
  --ifm-global-radius: 8px;
  --ifm-global-shadow-md: 0 8px 20px rgba(106, 13, 173, 0.15);

  --ifm-alert-border-radius: 12px;
  --ifm-alert-padding-vertical: 1rem;

  /* Funky Extras */
  --wata-gradient-primary: linear-gradient(45deg, #6a0dad, #ff3864, #fd0);
  --wata-gradient-text: linear-gradient(to right, #ff00cc, #3399ff, #00ffd5);
  --wata-gradient-secondary: linear-gradient(45deg, #ff00cc, #3399ff, #00ffd5);
  --wata-button-shadow: 5px 5px 0px rgba(0,0,0,0.2);
  --wata-skew-angle: -5deg;
  
  /* Set proper z-index values */
  --ifm-z-index-dropdown: 100;
  --ifm-z-index-fixed: 200;
  --ifm-z-index-overlay: 400;
}


.card {
  border: 0.2px solid transparent;
  border-radius: 15px;
  background:
    linear-gradient(var(--ifm-navbar-background-color)) padding-box,
    var(--wata-gradient-primary) border-box;
  transition: all 0.3s;
  filter: drop-shadow(0 0 40px rgba(255, 0, 204, 0.1)) drop-shadow(0 0 40px rgba(255, 234, 0, 0.1));
}

.card:hover {
  border: 4px solid transparent;
  background:
    linear-gradient(var(--ifm-navbar-background-hover-color)) padding-box,
    var(--wata-gradient-secondary) border-box;
      filter: drop-shadow(0 0 40px rgba(255, 0, 204, 0.2)) drop-shadow(0 0 40px rgba(0, 255, 213, 0.2));
}

h1, h2, h3 {
  position: relative;
}

</style>