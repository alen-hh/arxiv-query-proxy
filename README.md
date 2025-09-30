# ArXiv Query Proxy API

A serverless API proxy for querying ArXiv papers with structured JSON responses. Built with TypeScript and Vercel Functions.

## Features

- 🔍 **Search ArXiv papers** with flexible query parameters
- 📊 **Structured JSON output** with clean data extraction
- 🚀 **Serverless deployment** ready for Vercel
- 📝 **TypeScript support** with full type safety
- 🎯 **Filtered data** - extracts only essential paper information

## API Endpoints

### `/api/arxiv-query`

Query ArXiv papers and get structured JSON responses.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search_query` | string | **required** | ArXiv search query |
| `sortBy` | string | `submittedDate` | Sort field (`submittedDate`, `relevance`, etc.) |
| `sortOrder` | string | `descending` | Sort order (`ascending` or `descending`) |
| `start` | number | `0` | Starting index for pagination |
| `max_results` | number | `10` | Maximum number of results to return |

#### Response Format

```json
{
  "success": true,
  "total_results": 2,
  "entries": [
    {
      "title": "Paper Title",
      "summary": "Paper abstract/summary...",
      "pdf_link": "http://arxiv.org/pdf/paper-id.pdf",
      "authors": ["Author 1", "Author 2"],
      "categories": ["cs.AI", "cs.LG"]
    }
  ]
}
```

## Usage Examples

### Basic Search
```bash
curl "https://your-domain.vercel.app/api/arxiv-query?search_query=machine+learning"
```

### Advanced Search with Date Range
```bash
curl "https://your-domain.vercel.app/api/arxiv-query?search_query=AI+AND+submittedDate:[202509290000+TO+202509300000]&sortBy=submittedDate&sortOrder=descending&max_results=5"
```

### Search by Category
```bash
curl "https://your-domain.vercel.app/api/arxiv-query?search_query=cat:cs.AI&max_results=3"
```

## Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Vercel CLI (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd arxiv-query-proxy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally with Vercel CLI**
   ```bash
   npm install -g vercel
   vercel dev
   ```
   
   The API will be available at `http://localhost:3000`

### Testing

Test the API endpoints:

```bash
# Test hello endpoint
curl "http://localhost:3000/api/hello?name=Test"

# Test ArXiv query
curl "http://localhost:3000/api/arxiv-query?search_query=neural+networks&max_results=2"
```

## Deployment

### Deploy to Vercel

1. **One-Click Deploy**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/arxiv-query-proxy)

2. **Manual Deploy**
   ```bash
   vercel --prod
   ```

## Project Structure

```
arxiv-query-proxy/
├── api/
│   ├── arxiv-query.ts    # Main ArXiv proxy API
│   └── hello.ts          # Simple hello world endpoint
├── package.json          # Dependencies and scripts
├── README.md            # This file
└── .gitignore           # Git ignore rules
```

## ArXiv Query Syntax

The `search_query` parameter supports ArXiv's query syntax:

- **Basic search**: `machine learning`
- **Author search**: `au:Smith`
- **Category search**: `cat:cs.AI`
- **Date range**: `submittedDate:[202401010000 TO 202412312359]`
- **Combined**: `AI AND cat:cs.LG AND submittedDate:[202401010000 TO 202412312359]`

For more details, see [ArXiv API Documentation](https://arxiv.org/help/api/user-manual).

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing required parameters)
- `405` - Method Not Allowed (non-GET requests)
- `500` - Internal Server Error (ArXiv API issues)

## License

MIT License - feel free to use this project for your own applications.
