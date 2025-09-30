import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ArxivEntry {
  title: string;
  summary: string;
  pdf_link: string;
  authors: string[];
  categories: string[];
}

interface ArxivQueryParams {
  search_query: string;
  sortBy?: string;
  sortOrder?: string;
  start?: number;
  max_results?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      search_query,
      sortBy = "submittedDate",
      sortOrder = "descending",
      start = 0,
      max_results = 10,
    } = req.query as ArxivQueryParams & { [key: string]: string };

    if (!search_query) {
      return res
        .status(400)
        .json({ error: "search_query parameter is required" });
    }

    // Build ArXiv API URL
    const arxivUrl = new URL("https://export.arxiv.org/api/query");
    arxivUrl.searchParams.set("search_query", search_query);
    arxivUrl.searchParams.set("sortBy", sortBy);
    arxivUrl.searchParams.set("sortOrder", sortOrder);
    arxivUrl.searchParams.set("start", start.toString());
    arxivUrl.searchParams.set("max_results", max_results.toString());

    // Fetch data from ArXiv API
    const response = await fetch(arxivUrl.toString());

    if (!response.ok) {
      throw new Error(
        `ArXiv API returned ${response.status}: ${response.statusText}`
      );
    }

    const xmlData = await response.text();

    // Parse XML and extract entries
    const entries = parseArxivXML(xmlData);

    return res.json({
      success: true,
      total_results: entries.length,
      entries,
    });
  } catch (error) {
    console.error("Error fetching ArXiv data:", error);
    return res.status(500).json({
      error: "Failed to fetch ArXiv data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function parseArxivXML(xmlData: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];

  // Simple XML parsing using regex (for production, consider using a proper XML parser)
  const entryMatches = xmlData.match(/<entry>[\s\S]*?<\/entry>/g);

  if (!entryMatches) {
    return entries;
  }

  for (const entryXml of entryMatches) {
    try {
      // Extract title
      const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : "";

      // Extract summary
      const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
      const summary = summaryMatch
        ? summaryMatch[1].trim().replace(/\s+/g, " ")
        : "";

      // Extract PDF link
      const pdfLinkMatch = entryXml.match(/<link title="pdf" href="([^"]*)"/);
      const pdf_link = pdfLinkMatch ? pdfLinkMatch[1] : "";

      // Extract authors
      const authorMatches = entryXml.match(
        /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g
      );
      const authors: string[] = [];
      if (authorMatches) {
        for (const authorMatch of authorMatches) {
          const nameMatch = authorMatch.match(/<name>(.*?)<\/name>/);
          if (nameMatch) {
            authors.push(nameMatch[1].trim());
          }
        }
      }

      // Extract categories
      const categoryMatches = entryXml.match(/<category term="([^"]*)"/g);
      const categories: string[] = [];
      if (categoryMatches) {
        for (const categoryMatch of categoryMatches) {
          const termMatch = categoryMatch.match(/term="([^"]*)"/);
          if (termMatch) {
            categories.push(termMatch[1]);
          }
        }
      }

      entries.push({
        title,
        summary,
        pdf_link,
        authors,
        categories,
      });
    } catch (error) {
      console.error("Error parsing entry:", error);
      // Continue with other entries even if one fails
    }
  }

  return entries;
}
