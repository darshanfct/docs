# API Reference

Complete API documentation for Eagleye Radar.

## Authentication

All API endpoints require authentication via bearer token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:9000/api/endpoint
```

### Obtain Token

```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

## Base URL

```
http://localhost:9000/api/v1
```

## Health Check

### Get System Health

```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "uptime": 3600,
  "components": {
    "database": "healthy",
    "scanner": "healthy",
    "cache": "healthy"
  }
}
```

## Network Flows

### List Flows

```
GET /flows
```

Query Parameters:
- `limit` (int) - Results per page (default: 100, max: 10000)
- `offset` (int) - Pagination offset (default: 0)
- `source_ip` (string) - Filter by source IP
- `dest_ip` (string) - Filter by destination IP
- `protocol` (string) - Filter by protocol (tcp, udp, icmp)
- `start_time` (ISO8601) - Start time filter
- `end_time` (ISO8601) - End time filter

Example:
```bash
curl 'http://localhost:9000/api/v1/flows?limit=50&protocol=tcp' \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "flows": [
    {
      "id": "flow_001",
      "source": {
        "ip": "192.168.1.100",
        "port": 54321
      },
      "destination": {
        "ip": "10.0.0.5",
        "port": 443
      },
      "protocol": "tcp",
      "packets": 125,
      "bytes": 567890,
      "duration": 45,
      "start_time": "2026-02-17T10:30:00Z",
      "end_time": "2026-02-17T10:30:45Z"
    }
  ],
  "total": 5432,
  "page": 1,
  "pages": 55
}
```

### Get Flow Details

```
GET /flows/{flow_id}
```

Example:
```bash
curl http://localhost:9000/api/v1/flows/flow_001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Packet Capture

### Start Capture

```
POST /scanner/capture
```

Request Body:
```json
{
  "interface": "eth0",
  "filter": "tcp port 80 or tcp port 443",
  "duration": 3600,
  "packet_count": null,
  "snap_length": 65535
}
```

Response:
```json
{
  "capture_id": "cap_001",
  "status": "running",
  "started_at": "2026-02-17T10:30:00Z",
  "packets_captured": 0
}
```

### Stop Capture

```
POST /scanner/capture/{capture_id}/stop
```

Response:
```json
{
  "capture_id": "cap_001",
  "status": "stopped",
  "packets_captured": 15234,
  "bytes_captured": 5432100,
  "duration": 120
}
```

### Get Capture Status

```
GET /scanner/capture/{capture_id}
```

## Metrics

### Get Network Metrics

```
GET /metrics/network
```

Query Parameters:
- `interval` (string) - Aggregation interval (1m, 5m, 1h, 1d)
- `metric` (string) - Specific metric to fetch

Example:
```bash
curl 'http://localhost:9000/api/v1/metrics/network?interval=5m' \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "metrics": [
    {
      "timestamp": "2026-02-17T10:30:00Z",
      "packets_per_sec": 5234,
      "bytes_per_sec": 2123456,
      "flows_active": 432,
      "loss_percent": 0.01
    }
  ]
}
```

### Get Protocol Statistics

```
GET /metrics/protocols
```

Response:
```json
{
  "protocols": {
    "tcp": {
      "packets": 1534321,
      "bytes": 543125678,
      "flows": 4321,
      "percent": 75.2
    },
    "udp": {
      "packets": 392341,
      "bytes": 234512341,
      "flows": 2341,
      "percent": 19.3
    },
    "icmp": {
      "packets": 112341,
      "bytes": 1234123,
      "flows": 341,
      "percent": 5.5
    }
  }
}
```

## Alerts

### List Alerts

```
GET /alerts
```

Query Parameters:
- `severity` (string) - critical, high, medium, low, info
- `status` (string) - open, acknowledged, resolved
- `limit` (int) - Results per page

Response:
```json
{
  "alerts": [
    {
      "id": "alert_001",
      "title": "High traffic detected",
      "description": "Traffic exceeded threshold",
      "severity": "high",
      "status": "open",
      "created_at": "2026-02-17T10:30:00Z",
      "triggered_by": "rule_high_traffic"
    }
  ],
  "total": 23
}
```

### Create Alert Rule

```
POST /alerts/rules
```

Request Body:
```json
{
  "name": "high_traffic_alert",
  "description": "Alert when traffic exceeds 1Gbps",
  "condition": "bytes_per_sec > 1000000000",
  "window": "5m",
  "severity": "high",
  "enabled": true,
  "actions": [
    {
      "type": "email",
      "targets": ["admin@company.com"]
    }
  ]
}
```

## Users & Management

### List Users

```
GET /users
```

Response:
```json
{
  "users": [
    {
      "id": "user_001",
      "username": "admin",
      "email": "admin@company.com",
      "role": "admin",
      "created_at": "2026-02-01T00:00:00Z"
    }
  ]
}
```

### Create User

```
POST /users
```

Request Body:
```json
{
  "username": "john_doe",
  "email": "john@company.com",
  "role": "operator",
  "password": "secure_password"
}
```

### Update User

```
PATCH /users/{user_id}
```

### Delete User

```
DELETE /users/{user_id}
```

## Configuration

### Get Configuration

```
GET /config
```

### Update Configuration

```
PATCH /config
```

Request Body:
```json
{
  "setting_name": "new_value"
}
```

### Validate Configuration

```
POST /config/validate
```

Request Body: Configuration object to validate

Response:
```json
{
  "valid": true,
  "errors": []
}
```

## Data Queries

### Query Language (QL)

Execute complex queries:

```
POST /query
```

Request Body:
```json
{
  "query": "SELECT source_ip, COUNT(*) as count FROM flows WHERE protocol='tcp' GROUP BY source_ip LIMIT 10"
}
```

Response:
```json
{
  "results": [
    {
      "source_ip": "192.168.1.100",
      "count": 5432
    }
  ],
  "execution_time_ms": 234
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid parameter: limit",
    "details": {
      "parameter": "limit",
      "reason": "must be between 1 and 10000"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Permission denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

API rate limits apply to all endpoints:

- **Default**: 1000 requests per minute
- **Per-user**: Configurable in settings

Response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1613563200
```

## Pagination

For endpoints returning lists:

```bash
# Get page 2 with 50 results per page
curl 'http://localhost:9000/api/v1/flows?page=2&limit=50'
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 5432,
    "pages": 109
  }
}
```

## Webhooks

Register webhooks for events:

```
POST /webhooks
```

Request Body:
```json
{
  "name": "High Alert Webhook",
  "url": "https://your-server.com/webhook",
  "events": ["alert.created", "alert.resolved"],
  "secret": "webhook_secret"
}
```

## SDKs

Official SDKs available:

- **Python**: `pip install eagleye-sdk`
- **Node.js**: `npm install eagleye-sdk`
- **Go**: `go get github.com/eagleye-radar/go-sdk`
- **Java**: Available on Maven Central

## See Also

- [Configuration](configuration.md)
- [Installation](installation.md)
- [Troubleshooting](troubleshooting.md)

---

**API Version**: v1  
**Last Updated**: February 2026
