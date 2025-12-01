# Chart Generator

A simple, client-side web application for creating beautiful charts from CSV files or manual data entry. No database, no account required - just pure chart generation!

## Features

- **Multiple Chart Types**: Create line, bar, pie, and donut charts
- **CSV Upload**: Import data directly from CSV files
- **Manual Entry**: Add and edit data points through an intuitive table interface
- **Real-time Preview**: See your chart update as you modify the data
- **SVG Export**: Download or copy charts as SVG for use anywhere
- **No Backend Required**: Everything runs in your browser
- **Instant Results**: No loading times or server requests

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **CSV Parsing**: Papa Parse
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

That's it! No database setup required.

## Usage

### Creating a Chart

1. Enter a chart name (e.g., "Monthly Sales")
2. Select a chart type (line, bar, pie, or donut)
3. Either:
   - **Upload a CSV file** with label and value columns
   - **Manually add data** using the "Add Row" button
4. See your chart preview update in real-time
5. Export as SVG when ready

### Exporting Charts

- **Download SVG**: Click to save the chart as an SVG file
- **Copy SVG**: Click to copy the SVG code to your clipboard

### CSV Format

Your CSV file should have columns for labels and values. The app automatically detects columns named:
- **Labels**: "label", "name", "category" (or uses the first column)
- **Values**: "value", "amount", "count" (or uses the second column)

Example CSV:
```csv
label,value
January,100
February,150
March,200
April,175
May,220
```

A sample CSV file (`sample-data.csv`) is included in the project for testing.

## Project Structure

```
charts/
├── app/
│   ├── layout.tsx         # Root layout with Toaster
│   └── page.tsx           # Main chart generator page
├── components/
│   ├── chart/
│   │   ├── ChartRenderer.tsx     # Recharts display component
│   │   ├── ChartTypeSelector.tsx # Chart type picker
│   │   ├── DataTable.tsx         # Editable data table
│   │   ├── CSVUploader.tsx       # CSV upload component
│   │   └── ChartExporter.tsx     # SVG export functionality
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── chart-utils.ts    # CSV parsing & SVG utilities
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # General utilities
├── types/
│   └── chart.ts          # TypeScript types
└── sample-data.csv       # Example CSV file
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment

Deploy to Vercel, Netlify, or any static hosting platform:

```bash
npm run build
```

Since there's no database, deployment is straightforward - just deploy the built static files!

## Why No Database?

This app is designed to be simple and privacy-focused:
- **No data collection**: Your data never leaves your browser
- **No accounts needed**: Start creating charts immediately
- **Offline capable**: Can work offline once loaded
- **Fast**: No server round-trips for generating charts
- **Portable**: Easy to deploy anywhere

## Future Enhancements

- Local storage for saving charts in browser
- More chart types (scatter, area, radar)
- Export to PNG/JPG
- Chart themes and color customization
- Multiple datasets on one chart
- Chart animation options
- Print-friendly layouts

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.
