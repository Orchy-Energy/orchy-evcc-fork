package influx

// QueryRequest represents an InfluxDB query request
type QueryRequest struct {
	Query string `json:"query"`
}

// QueryResult represents the result of an InfluxDB query
type QueryResult struct {
	Records []map[string]interface{} `json:"records"`
	Error   string                   `json:"error,omitempty"`
}

// API defines the interface for InfluxDB operations
type API interface {
	ExecuteQuery(query string) (*QueryResult, error)
} 
