# Radar Scanner

The **Radar Scanner** is the core network scanning and monitoring component of Eagleye Radar. It handles packet capture, analysis, and real-time network intelligence.

## Overview

Radar Scanner continuously monitors network traffic to:

- Capture and analyze IP packets
- Track network flows and conversations
- Detect anomalies and security threats
- Generate network intelligence summaries
- Build network topology maps

## Architecture

### Components

```
┌─────────────────────────────────────┐
│      Network Interface (NIC)        │
└────────────┬────────────────────────┘
             │
      ┌──────▼────────┐
      │  Packet Sniffer│
      └────────┬───────┘
               │
    ┌──────────▼──────────┐
    │  Flow Reassembly    │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  Protocol Analyzer  │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  Threat Detection   │
    └──────────┬──────────┘
               │
      ┌────────▼────────┐
      │   Data Storage  │
      └─────────────────┘
```

## Configuration

### Enable Radar Scanner

In the dashboard, navigate to **Settings** → **Scanners** and enable Radar Scanner:

```json
{
  "scanner": "radar",
  "enabled": true,
  "interfaces": ["eth0", "eth1"],
  "packet_buffer_size": 65536,
  "flow_timeout": 300,
  "process_threads": 4
}
```

### Network Interfaces

Select which network interfaces to monitor:

```bash
# List all interfaces
ip link show

# Or use the Dashboard UI
# Settings → Network Interfaces → Select interfaces to monitor
```

## Usage

### Capture Network Traffic

```bash
# Via API
curl -X POST http://localhost:9000/api/scanner/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "interfaces": ["eth0"],
    "filters": {
      "protocol": "tcp",
      "port": 443
    }
  }'
```

### View Network Flows

Access the dashboard to see live network flows:

1. Go to **Dashboard** → **Network Flows**
2. View real-time traffic
3. Click on flows to inspect details
4. Export data for analysis

### Protocol Analysis

Radar Scanner analyzes protocols:

- **Layer 3**: IP, ICMP, IPv6
- **Layer 4**: TCP, UDP, SCTP
- **Layer 7**: HTTP, HTTPS, DNS, TLS, SSH

View protocol statistics:

```bash
curl http://localhost:9000/api/scanner/protocols \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "protocols": {
    "tcp": {
      "packets": 1532421,
      "bytes": 543125678,
      "flows": 4321
    },
    "udp": {
      "packets": 892341,
      "bytes": 234512341,
      "flows": 2341
    },
    "icmp": {
      "packets": 12341,
      "bytes": 1234123,
      "flows": 341
    }
  }
}
```

### Advanced Filtering

Use BPF (Berkeley Packet Filter) syntax:

```bash
# Capture only HTTPS traffic
tcpdump -i eth0 "tcp port 443"

# Capture traffic from specific subnet
tcpdump -i eth0 "net 192.168.1.0/24"

# Exclude specific host
tcpdump -i eth0 "not host 192.168.1.100"
```

Radar Scanner supports the same syntax through the API.

## Performance Tuning

### Optimize for High Traffic

For networks with > 100 Mbps traffic:

```json
{
  "packet_buffer_size": 262144,
  "process_threads": 8,
  "batch_size": 1000,
  "enable_jumbo_frames": true,
  "rss_enabled": true
}
```

### Memory Management

Monitor memory usage:

```bash
# Check scanner memory
docker stats eagleye-collector

# Or via API
curl http://localhost:9000/api/scanner/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reduce CPU Usage

If CPU is high:

1. Reduce sampling rate: `sampling_rate: 0.1`
2. Disable flow reassembly for non-critical protocols
3. Increase packet buffer size
4. Use network interface NIC offloading

## Real-World Examples

### Monitor DNS Queries

```bash
curl -X POST http://localhost:9000/api/scanner/capture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": "udp port 53",
    "protocol_analysis": true,
    "output": "json"
  }'
```

### Track HTTP Traffic

```bash
curl -X POST http://localhost:9000/api/scanner/capture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": "tcp port 80 or tcp port 8080",
    "ssl_inspection": false,
    "extract_http_headers": true
  }'
```

### Detect Suspicious Patterns

```bash
curl -X POST http://localhost:9000/api/scanner/detection/enable \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scan_type": "anomaly_detection",
    "threshold": 0.8,
    "alert_on_match": true
  }'
```

## Troubleshooting

### Scanner not capturing traffic

1. Verify network interface is up: `ip link show`
2. Check firewall rules aren't blocking
3. Ensure scanner has permission to capture packets
4. Try specific interface: `eth0` instead of `any`

### High CPU Usage

- Reduce sampling rate
- Disable unused protocols
- Check for packet loss

### Storage Issues

- Increase disk space
- Enable data compression
- Set retention policies

See [Troubleshooting Guide](troubleshooting.md) for more solutions.

## See Also

- [Network Engine](network-engine.md) - Data analysis and storage
- [Configuration](configuration.md) - Advanced settings
- [API Reference](api-reference.md) - Scanner API endpoints

---

**Need help?** Check the [Troubleshooting Guide](troubleshooting.md) or visit the community forums.
