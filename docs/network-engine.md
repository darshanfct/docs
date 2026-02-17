# Network Engine

The **Network Engine** is the intelligent data processing and storage layer of Eagleye Radar. It provides real-time analytics, storage, and querying capabilities for network data.

## Overview

The Network Engine handles:

- **Real-time Data Processing** - Process millions of events per second
- **Distributed Storage** - Scalable time-series database
- **Advanced Querying** - Fast, complex queries on network data
- **Machine Learning** - Pattern detection and anomaly detection
- **Data Archival** - Long-term storage with compression

## Architecture

The Network Engine consists of several subsystems:

### Data Pipeline

```
Packet Data → Time-Series DB → indexing → Query Engine
                                  ↓
                            Cache Layer
                                  ↓
                           Query Results
```

### Storage Layers

| Layer | Purpose | Retention |
|-------|---------|-----------|
| **Hot** | Last 24 hours | Real-time querying |
| **Warm** | Last 30 days | Fast queries |
| **Cold** | Beyond 30 days | Archive storage |

## Configuration

### Database Setup

Configure PostgreSQL or TimescaleDB for storage:

```json
{
  "storage": {
    "type": "timescaledb",
    "host": "postgres.local",
    "port": 5432,
    "database": "network_data",
    "retention_hot": "24h",
    "retention_warm": "30d",
    "compression_enabled": true
  }
}
```

### Query Optimization

Enable query caching:

```json
{
  "caching": {
    "enabled": true,
    "ttl": 300,
    "max_size": "1GB"
  }
}
```

## Data Model

### Network Event Schema

Each network event contains:

```json
{
  "timestamp": "2026-02-17T10:30:00Z",
  "source": {
    "ip": "192.168.1.100",
    "port": 54321,
    "mac": "aa:bb:cc:dd:ee:ff",
    "geo": {
      "country": "US",
      "city": "San Francisco"
    }
  },
  "destination": {
    "ip": "10.0.0.5",
    "port": 443,
    "mac": "11:22:33:44:55:66"
  },
  "protocol": "tcp",
  "packets": 125,
  "bytes": 567890,
  "duration": 45,
  "flags": {
    "syn": true,
    "ack": true,
    "fin": false
  }
}
```

## Querying Data

### Via Dashboard

1. Navigate to **Analytics** → **Queries**
2. Select time range
3. Choose data type (flows, packets, threats)
4. Apply filters and build query
5. View results in real-time

### Via API

```bash
# Get network flows
curl 'http://localhost:9000/api/flows' \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "source_ip": "192.168.1.0/24",
      "time_range": {
        "start": "2026-02-17T00:00:00Z",
        "end": "2026-02-17T23:59:59Z"
      }
    },
    "limit": 1000
  }'
```

Response:
```json
{
  "flows": [
    {
      "id": "flow_001",
      "source": "192.168.1.100",
      "destination": "10.0.0.5",
      "protocol": "tcp",
      "bytes": 567890,
      "packets": 125,
      "duration": 45
    }
  ],
  "total": 5432,
  "page": 1
}
```

### Query Language (QL)

Use Eagleye's query language for complex queries:

```ql
SELECT source_ip, COUNT(*) as packet_count
FROM network_flows
WHERE destination_port IN (80, 443, 8080)
  AND timestamp >= now() - 1h
GROUP BY source_ip
ORDER BY packet_count DESC
LIMIT 10
```

## Analytics

### Built-in Reports

Access pre-built reports:

1. **Traffic Summary** - Top talkers, protocols, destinations
2. **Security Insights** - Anomalies, threats, attacks
3. **Performance Metrics** - Latency, loss, jitter
4. **Compliance Reports** - Audit trails, policy violations

### Custom Analytics

Create custom dashboards:

```bash
# Create custom metric
curl -X POST http://localhost:9000/api/metrics/custom \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "http_traffic_by_user",
    "query": "SELECT user, COUNT(*) FROM logs WHERE protocol=http GROUP BY user",
    "interval": 300,
    "alert_threshold": 1000
  }'
```

### Machine Learning

The Network Engine includes ML models for:

- **Anomaly Detection** - Detect unusual patterns
- **Threat Classification** - Identify malicious traffic
- **Capacity Planning** - Predict future usage
- **Clustering** - Group similar flows

Enable ML:

```json
{
  "ml_engine": {
    "enabled": true,
    "models": ["anomaly_detection", "threat_classification"],
    "training_window": "7d",
    "prediction_interval": 300
  }
}
```

## Performance Optimization

### Indexing

Create indexes for faster queries:

```bash
# Create index on common queries
curl -X POST http://localhost:9000/api/indexes/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "idx_source_destination",
    "columns": ["source_ip", "destination_ip", "timestamp"]
  }'
```

### Partitioning

Data is automatically partitioned by time:

```
Table: network_flows
├── network_flows_2026_02_17
├── network_flows_2026_02_16
├── network_flows_2026_02_15
└── ...
```

### Query Optimization

Check slow queries:

```bash
curl http://localhost:9000/api/metrics/slow-queries \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Retention Policies

Configure data retention:

```json
{
  "retention_policies": [
    {
      "level": "hot",
      "duration": "24h",
      "storage": "ssd"
    },
    {
      "level": "warm",
      "duration": "30d",
      "storage": "aws_s3",
      "compress": true
    },
    {
      "level": "cold",
      "duration": "365d",
      "storage": "aws_glacier",
      "compress": true
    }
  ]
}
```

## Backup and Recovery

### Backup

```bash
# Full backup
pg_dump -h localhost -U eagleye network_data | gzip > backup.sql.gz

# Continuous WAL archiving
# Configured in postgresql.conf
```

### Recovery

```bash
# Restore from backup
gunzip < backup.sql.gz | psql -h localhost -U eagleye network_data
```

## Troubleshooting

### Slow Queries

1. Check indexes: `EXPLAIN ANALYZE`
2. Review query plan
3. Add missing indexes
4. Adjust query filters

### Storage Issues

- Monitor disk space
- Enable compression
- Archive old data
- Clean temporary tables

### Connection Errors

- Verify database is running
- Check credentials
- Review firewall rules
- Check connection pool

See [Troubleshooting Guide](troubleshooting.md) for more help.

## See Also

- [Radar Scanner](radar-scanner.md) - Data capture
- [API Reference](api-reference.md) - Query API endpoints
- [Configuration](configuration.md) - Advanced settings

---

**Performance tip:** For best results, use indexes on frequently queried columns and enable query caching.
