# Generate Dashboard JSON

The user wants to visualize data as a dashboard. `$ARGUMENTS` may be a file path, a data snippet, a description, or anything else — read and understand whatever is provided, then generate a dashboard JSON that best represents the data visually.

## Your Task

1. Understand the data in `$ARGUMENTS` (file path, raw data, description — whatever it is)
2. If it's a file path, read the file first
3. Identify what the data represents and what insights would be useful to show
4. Choose the best combination of widget types
5. Generate a single valid JSON object and save it to `~/Desktop/llm-auto-dashboard/dashboards/<slug>.json`

---

## Output Schema

```
{
  "meta": {
    "title": "Descriptive title",
    "description": "One-line summary (optional)",
    "generated_at": "<current ISO8601 datetime>",
    "version": "1.0"
  },
  "layout": { "columns": 12, "gap": 16 },
  "widgets": [ ...widget objects... ]
}
```

### Every widget must have:

```
{
  "id": "unique-kebab-case-id",
  "type": "<see types below>",
  "title": "Widget title",
  "span": { "cols": 6 },
  "config": { ... },
  "data": { ... }
}
```

`span.cols` is 1–12. Widgets in the same row should sum to 12.

---

## Widget Types

### `kpi` — Headline numbers
```
"data": {
  "items": [
    { "label": "Revenue", "value": 1200000, "change": 5.2, "prefix": "$", "suffix": "", "format": "number", "badge": "Q1" }
  ]
}
```
- `change`: % change shown as ▲/▼ (optional)
- `badge`: small label pill (optional)

---

### `line` | `bar` | `area` | `composed`
```
"config": { "xKey": "date", "yKeys": ["revenue", "cost"], "smooth": true, "dot": false, "areaFill": false, "gradient": false, "stacked": false },
"data": { "series": [ { "date": "Jan", "revenue": 120000, "cost": 80000 } ] }
```

---

### `pie`
```
"config": { "nameKey": "category", "valueKey": "amount", "donut": true },
"data": { "series": [ { "category": "Product A", "amount": 45 } ] }
```

---

### `radar`
```
"config": { "nameKey": "metric", "dataKeys": ["Product A", "Product B"] },
"data": { "series": [ { "metric": "Quality", "Product A": 80, "Product B": 65 } ] }
```

---

### `scatter`
```
"config": { "xKey": "price", "yKey": "rating", "nameKey": "product", "sizeKey": "sales" },
"data": { "series": [ { "product": "Widget X", "price": 29.99, "rating": 4.5, "sales": 1200 } ] }
```

---

### `candlestick`
```
"config": { "dateKey": "date", "openKey": "open", "highKey": "high", "lowKey": "low", "closeKey": "close" },
"data": { "series": [ { "date": "03/14", "open": 82.5, "high": 85.1, "low": 81.2, "close": 84.3 } ] }
```

---

### `gauge`
```
"config": { "min": 0, "max": 100, "thresholds": [25, 50, 75], "labels": ["Low", "Medium", "High", "Critical"] },
"data": { "value": 68 }
```
`labels` must have `thresholds.length + 1` entries.

---

### `table`
```
"config": {
  "columns": [
    { "key": "name", "label": "Name", "width": 150, "sortable": true },
    { "key": "value", "label": "Value", "width": 100, "format": "number", "sortable": true, "colorCode": false, "bar": false }
  ],
  "pageSize": 10,
  "searchable": true
},
"data": { "rows": [ { "name": "Item A", "value": 42 } ] }
```
- `format`: `"currency"` | `"percent"` | `"number"`
- `colorCode`: red/green coloring for numeric values
- `bar`: background bar proportional to value
- Omit `columns` to auto-generate from row keys

---

### `treemap`
```
"config": { "nameKey": "name", "valueKey": "size", "colorKey": "change" },
"data": { "series": [ { "name": "Category A", "size": 400, "change": 2.1 } ] }
```

---

### `markdown`
```
"data": { "content": "### Notes\n\n- Key insight\n- **Bold point**\n> Important quote" }
```

---

### `json`
```
"data": { "content": { "raw": "data", "for": "inspection" } }
```

---

## Widget Selection Guide

| Data shape | Best widget |
|---|---|
| A few key numbers to highlight | `kpi` |
| Values over time | `line` or `area` |
| Category comparison | `bar` |
| Stock / OHLC prices | `candlestick` |
| Parts of a whole / shares | `pie` |
| Multi-dimension scores | `radar` |
| Two numeric variables correlated | `scatter` |
| Size-by-value hierarchy | `treemap` |
| Rows of structured data | `table` |
| One number in a range | `gauge` |
| Commentary / summary text | `markdown` |

## Layout Rules

- Row widths must sum to **12**
- `kpi` and `table`: use `"cols": 12`
- `gauge`: use `"cols": 3` or `"cols": 4`
- Side-by-side charts: 6+6 or 8+4

## Output Rules

- Output **only** the raw JSON — no markdown fences, no explanations
- Widget `id` values must be unique kebab-case strings
- Use only real values from the input — never fabricate data
- `meta.generated_at` should be the current datetime in ISO8601 format
- Save the JSON to `~/Desktop/llm-auto-dashboard/dashboards/<slug>.json`
