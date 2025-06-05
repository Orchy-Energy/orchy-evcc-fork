import axios from "axios";

interface QueryResult {
  records: Record<string, any>[];
  error?: string;
}

export async function executeQuery(query: string): Promise<QueryResult> {
  try {
    const response = await axios.post("/api/influx/query", { query });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      records: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
} 
