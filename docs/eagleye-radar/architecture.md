# Architecture

EAGLEYE RADAR system architecture and components.

## System Overview

```
┌──────────────────────────────────────┐
│   Network Devices                    │
│   (Routers, Switches, Firewalls)     │
└──────────────────┬───────────────────┘
                   ↓ SNMP/ARP/LLDP
┌──────────────────────────────────────┐
│   RADAR Scanner (Python)             │
│   - Device Discovery                 │
│   - Topology Mapping                 │
│   - OS Detection                     │
└──────────────────┬───────────────────┘
                   ↓ JSONL
┌──────────────────────────────────────┐
│   Data Files (Append-only)           │
│   - raw_data_streaming.jsonl         │
│   - scan_devices.jsonl               │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│   Fluentd (Log Processor)            │
│   - File Tailing                     │
│   - Data Transformation              │
│   - Buffering & Retry                │
└──────────────────┬───────────────────┘
                   ↓ HTTPS
┌──────────────────────────────────────┐
│   OpenSearch Cluster                 │
│   - radar-devices index              │
│   - radar-scans index                │
└──────────────────┬───────────────────┘
                   ↓ REST API
┌──────────────────────────────────────┐
│   Backend (Node.js/Express)          │
│   - SSH Tunnels                      │
│   - API Endpoints                    │
└──────────────────┬───────────────────┘
                   ↓ WebSocket
┌──────────────────────────────────────┐
│   Frontend (React/Vite)              │
│   - Topology Visualization           │
│   - Device Inventory                 │
│   - Real-time Metrics                │
└──────────────────────────────────────┘
```

## Components

### 1. RADAR Scanner
- **Language**: Python 3.8+
- **Protocols**: SNMP v1/v2c/v3, LLDP, CDP, ARP, DHCP, mDNS
- **Threading**: 50 parallel threads
- **Rate Limiting**: 5 SNMP queries/sec
- **Output**: JSONL format

### 2. Data Pipeline
- **Format**: Append-only JSONL (streaming-friendly)
- **Location**: `/opt/eagleyeradar/scan/`
- **Files**:
  - `raw_data_streaming.jsonl` - Scan metadata
  - `scan_devices.jsonl` - Device records
  - `network_scan.db` - SQLite database
  - `network_topology.png` - Graphviz diagram

### 3. Fluentd Service
- **Input Sources**: Local JSONL files
- **Processing**: Timestamp normalization, MD5 doc IDs
- **Buffering**: File-based, persistent
- **Output**: OpenSearch bulk API

### 4. Rsyslog Service
- **Input Ports**: UDP:514, TCP:514, RELP:20514
- **Output**: `/var/log/fct-fw/fct-fw.log`
- **Purpose**: Syslog collection from network devices

### 5. OpenSearch
- **Indexes**:
  - `radar-devices-demo` - Device records
  - `radar-scans-demo` - Scan metadata
  - `firewall-logs` - Syslog events

### 6. Web UI
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **Technologies**: React, Vite, TailwindCSS

## Data Flow Timeline

```
T+0s   : Systemd triggers scan
T+120s : Scanner completes, writes JSONL
T+125s : Fluentd detects new data
T+130s : Fluentd sends to OpenSearch
T+140s : OpenSearch indexes complete
T+143s : Backend queries OpenSearch
T+145s : Frontend renders dashboard
T+600s : Next scan begins
```

## Security Architecture

```
┌─────────────────┐
│  Local Machine  │
│  (SSH Tunnels)  │
└────────┬────────┘
         │ SSH Tunnel Port 9200
         ↓
┌─────────────────┐
│   OpenSearch    │
│   (TLS/HTTPS)   │
└─────────────────┘
┌─────────────────┐
│  Firewall Rules │
│  (Ingress/IP)   │
└─────────────────┘
```

## Failure Recovery

- **Systemd**: Auto-restart service on failure
- **Fluentd**: Exponential backoff retry (17 attempts)
- **RADAR**: Checkpoint resume for multi-network scans
- **OpenSearch**: Replica shards for data redundancy

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Scan Time | 2-5 minutes (depends on device count) |
| Scan Interval | 10 minutes (configurable) |
| Max Devices | 10,000+ per site |
| Data Retention | 1+ years in OpenSearch |
| Indexing Lag | 5-10 seconds |
| Query Latency | <500ms (P95) |
| Storage Required | ~1GB per 1000 devices |

## See Also

- [Configuration](configuration.md)
- [Usage Guide](usage.md)
- [Troubleshooting](troubleshooting.md)
