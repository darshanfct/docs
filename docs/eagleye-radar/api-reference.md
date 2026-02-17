# API Reference

EAGLEYE RADAR REST API endpoints.

## Base URL

```
http://localhost:3001/api
```

## Authentication

API requests require authentication:

```bash
# Get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Use token in requests
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/devices
```

## Endpoints

### Latest Scan

```
GET /api/v1/latest-scan
```

Returns the most recent scan metadata.

**Response**:
```json
{
  "scan_id": "2026-02-17T10:30:00Z",
  "scan_start": "2026-02-17T10:30:00Z",
  "scan_end": "2026-02-17T10:32:15Z",
  "devices_discovered": 42,
  "networks_scanned": ["192.168.1.0/24"],
  "timestamp": "2026-02-17T10:32:20Z"
}
```

### Device List

```
GET /api/v1/devices?limit=100&offset=0
```

Get all discovered devices.

**Parameters**:
- `limit` (int) - Results to return (default: 100)
- `offset` (int) - Pagination offset (default: 0)
- `type` (string) - Filter by device type (router, switch, etc)

**Response**:
```json
{
  "devices": [
    {
      "device_id": "192.168.1.1",
      "ip": "192.168.1.1",
      "mac": "aa:bb:cc:dd:ee:ff",
      "hostname": "core-switch-01",
      "device_type": "switch",
      "manufacturer": "Cisco",
      "model": "Catalyst 3750",
      "os": "IOS 15.2"
    }
  ],
  "total": 42,
  "page": 1
}
```

### Device Details

```
GET /api/v1/devices/{device_id}
```

**Response**:
```json
{
  "device_id": "192.168.1.1",
  "ip": "192.168.1.1",
  "mac": "aa:bb:cc:dd:ee:ff",
  "ports": [
    {
      "port": "GigabitEthernet1/0/1",
      "status": "up",
      "speed": "1000Mbps"
    }
  ],
  "neighbors": [
    {
      "port": "GigabitEthernet1/0/24",
      "neighbor_ip": "192.168.1.2"
    }
  ]
}
```

### Topology

```
GET /api/v1/topology
```

Get network topology data.

**Response**:
```json
{
  "nodes": [
    {"id": "192.168.1.1", "label": "core-switch", "type": "switch"},
    {"id": "192.168.1.2", "label": "access-switch", "type": "switch"}
  ],
  "links": [
    {"source": "192.168.1.1", "target": "192.168.1.2"}
  ]
}
```

### Scans

```
GET /api/v1/scans?limit=10
```

Get scan history.

**Response**:
```json
{
  "scans": [
    {
      "scan_id": "2026-02-17T10:30:00Z",
      "devices": 42,
      "timestamp": "2026-02-17T10:32:20Z",
      "duration": 140
    }
  ]
}
```

### Statistics

```
GET /api/v1/stats
```

Get system statistics.

**Response**:
```json
{
  "total_devices": 425,
  "device_types": {
    "switch": 45,
    "router": 12,
    "firewall": 8
  },
  "manufacturers": {
    "Cisco": 35,
    "Arista": 12,
    "Fortinet": 8
  },
  "last_scan": "2026-02-17T10:32:20Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid parameter",
  "message": "limit must be > 0"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Device not found"
}
```

### 500 Internal Error
```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```

## Rate Limiting

- **Limit**: 1000 requests/minute
- **Headers**:
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 999`
  - `X-RateLimit-Reset: 1613563200`

## Webhook Events

Subscribe to events:

```
POST /api/v1/webhooks
```

**Events**:
- `scan.complete` - Scan finished
- `device.discovered` - New device found
- `device.removed` - Device offline
- `alert.triggered` - Alert condition met

## SDKs

### Python
```bash
pip install eagleye-radar
```

```python
from eagleye import Client

client = Client(
    host='localhost:3001',
    token='your-token'
)

devices = client.get_devices()
latest_scan = client.get_latest_scan()
```

### JavaScript
```bash
npm install eagleye-radar
```

```javascript
const { Client } = require('eagleye-radar');

const client = new Client({
    host: 'localhost:3001',
    token: 'your-token'
});

const devices = await client.getDevices();
```

## See Also

- [Usage Guide](usage.md)
- [Configuration](configuration.md)
- [Troubleshooting](troubleshooting.md)
