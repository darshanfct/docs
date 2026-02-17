# 🦅 EAGLEYE RADAR - Network Discovery & Security Operations Platform

[![License: Internal](https://img.shields.io/badge/License-Internal-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1-blue.svg)](CHANGELOG.md)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)

> **Enterprise-grade network discovery, topology mapping, and security operations center (SOC) infrastructure for comprehensive network visibility and monitoring.**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Components](#-components)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Data Flow](#-data-flow)
- [Output Formats](#-output-formats)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)

---

## 🎯 Overview

**EAGLEYE RADAR** is a production-grade network discovery and monitoring platform that combines:

- **Network Discovery Engine** - Multi-protocol device discovery (SNMP, ARP, LLDP, CDP, NetBIOS, mDNS)
- **Log Aggregation Pipeline** - Centralized syslog collection and processing (Rsyslog + Fluentd)
- **Data Analytics Backend** - OpenSearch-based storage and analysis
- **Real-Time Visualization** - Web-based network topology and device inventory dashboards

### Use Cases

- **Network Asset Discovery** - Automated inventory of devices, services, and connections
- **Security Operations** - Centralized firewall/router log collection and analysis
- **Topology Mapping** - Visual Layer 2/3 network topology with LLDP/CDP neighbor discovery
- **Compliance Monitoring** - Device configuration tracking and security posture assessment
- **Blind Spot Analysis** - Identification of network visibility gaps and unmanaged devices

---

## 🏗️ Architecture

The platform consists of three integrated layers deployed across client sites and central management:

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT SITE - LINUX VM (Discovery & Log Collection)            │
├─────────────────────────────────────────────────────────────────┤
│  ⚙️  Systemd Service Layer                                      │
│     └─ eagleyeradar.service (10-minute scan interval)           │
│                                                                  │
│  🔍 Scanner Layer                                               │
│     └─ eagleyeradar.py (Network discovery engine)               │
│        • SNMP/ARP/LLDP/CDP device discovery                     │
│        • OS detection & service enumeration                     │
│        • Topology mapping & connection tracking                 │
│        • 50 parallel threads, 5 queries/sec rate limit          │
│                                                                  │
│  📁 Data Files (JSONL append-only)                              │
│     ├─ raw_data_streaming.jsonl (scan metadata)                 │
│     └─ scan_devices.jsonl (device records)                      │
│                                                                  │
│  🚀 Fluentd Service                                             │
│     • Tail sources: JSONL files (5s refresh)                    │
│     • Filters: Timestamp normalization, MD5 doc IDs             │
│     • Buffers: File-based, 10MB chunks, exponential retry       │
│     • Outputs: OpenSearch (HTTPS bulk writes)                   │
│                                                                  │
│  📡 Rsyslog Service                                             │
│     • Inputs: UDP:514, TCP:514, RELP:20514                      │
│     • Outputs: /var/log/fct-fw/fct-fw.log                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/SSH Tunnel
┌─────────────────────────────────────────────────────────────────┐
│  OPENSEARCH CLUSTER (Data Storage & Analysis)                   │
├─────────────────────────────────────────────────────────────────┤
│  📊 Indexes                                                      │
│     ├─ radar-scans-demo (scan metadata & summaries)             │
│     ├─ radar-devices-demo (comprehensive device records)        │
│     └─ firewall-logs (syslog events from network devices)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓ REST API
┌─────────────────────────────────────────────────────────────────┐
│  VISUALIZATION LAYER (Development Machine)                      │
├─────────────────────────────────────────────────────────────────┤
│  🖥️  Backend (Node.js/Express)                                  │
│     • SSH tunnels to OpenSearch                                 │
│     • REST API: /api/latest-scan, /api/devices                  │
│     • Port 3001                                                  │
│                                                                  │
│  🌐 Frontend (React/Vite)                                       │
│     • Network topology visualization                            │
│     • Device inventory dashboard                                │
│     • Real-time scan results                                    │
│     • Port 5173 (http://localhost:5173)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### Network Discovery
- **Multi-Protocol Support**: SNMP (v1/v2c/v3), LLDP, CDP, ARP, DHCP, NetBIOS, mDNS, IPv6
- **Intelligent Caching**: LRU caches for SNMP/DNS/vendor lookups (10x speedup)
- **Auto-Fallback**: Automatic SNMP version detection per device
- **Vendor Optimization**: Fast FDB scanning for Cisco/Extreme/Aruba
- **Parallel Processing**: 50-thread pool for concurrent device discovery

### Data Pipeline
- **Append-Only JSONL**: Streaming-friendly data format, no overwrites
- **Position Tracking**: Fluentd pos_file prevents duplicate ingestion
- **Buffer Persistence**: File-based buffering survives restarts
- **Exponential Backoff**: Automatic retry with 17 max attempts
- **Bulk Operations**: 10MB chunks for efficient OpenSearch writes

### Visibility & Analysis
- **Blind Spot Reporting**: Identifies network visibility gaps
- **Security Assessment**: Vulnerability scanning and compliance checks
- **Topology Mapping**: Automated Layer 2/3 network diagrams (Graphviz PNG)
- **Historical Tracking**: Scan-based versioning with scan_id correlation
- **Real-Time Dashboards**: Web UI with auto-refresh and filtering

### Production-Grade
- **Systemd Integration**: Auto-restart on failure (15s recovery)
- **Checkpoint Resume**: Crash recovery for large multi-network scans
- **Rate Limiting**: 5 SNMP queries/sec to avoid IDS alerts
- **Graceful Degradation**: Falls back when optional tools missing
- **Comprehensive Logging**: Structured logs to syslog and journal

---

## 🔧 Components

### 1. **Rsyslog** - Syslog Collection
**Purpose**: Receive and store syslog messages from network devices (firewalls, routers, switches)

- **Protocols**: UDP:514, TCP:514, RELP:20514
- **Output**: `/var/log/fct-fw/fct-fw.log`
- **Config**: [`config/rsyslog.conf`](config/rsyslog.conf)

### 2. **Fluentd** - Log Processing & Forwarding
**Purpose**: Monitor log files, parse/enrich data, forward to OpenSearch

- **Sources**: JSONL files from RADAR scanner + syslog files
- **Filters**: Timestamp normalization, MD5 doc IDs, field validation
- **Outputs**: OpenSearch indexes (radar-scans, radar-devices, firewall-logs)
- **Config**: [`config/fluentd.conf`](config/fluentd.conf)
- **Service**: [`config/systemd/fluentd.service`](config/systemd/fluentd.service)

### 3. **EagleEye RADAR** - Network Scanner
**Purpose**: Network scanning, asset discovery, topology mapping

- **Script**: [`eagleyeradar/eagleyeradar.py`](eagleyeradar/eagleyeradar.py) (18,000+ lines)
- **Bootstrap**: [`eagleyeradar/setup_and_run_eagleyeradar.sh`](eagleyeradar/setup_and_run_eagleyeradar.sh)
- **Service**: [`config/systemd/eagleyeradar.service`](config/systemd/eagleyeradar.service)
- **Interval**: 10 minutes (configurable via systemd service)

---

## 🚀 Quick Start

### Prerequisites
- **OS**: Ubuntu 20.04+ / Debian 11+ (Linux VM at client site)
- **Access**: Root/sudo privileges
- **Network**: SNMP access to network devices, firewall exceptions for syslog ports
- **OpenSearch**: Running cluster with credentials

### Installation (Interactive)

```bash
# Clone repository
git clone https://github.com/darshanfct/RADAR-Scanner.git
cd RADAR-Scanner

# Run unified installer
sudo bash SETUP_SOC.sh
```

The installer provides:
- **Detection**: Identifies existing installations
- **Review Mode**: Evaluate each module individually
- **Backup**: Automatic backup of existing configs
- **Validation**: Tests configurations before applying
- **Status**: Shows service health after installation

---

## 📦 Installation

### Manual Installation Steps

#### 1. Install Rsyslog
```bash
sudo apt update
sudo apt install -y rsyslog

# Copy configuration
sudo cp config/rsyslog.conf /etc/rsyslog.conf

# Create log directory
sudo mkdir -p /var/log/fct-fw
sudo chown syslog:adm /var/log/fct-fw
sudo chmod 755 /var/log/fct-fw

# Restart service
sudo systemctl restart rsyslog
sudo systemctl enable rsyslog
```

#### 2. Install Fluentd
```bash
# Install Fluentd via Ruby gems
sudo gem install fluentd
sudo gem install fluent-plugin-opensearch

# Create directories
sudo mkdir -p /etc/fluentd /var/log/fluentd/buffer

# Copy configuration
sudo cp config/fluentd.conf /etc/fluentd/fluentd.conf

# Install service
sudo cp config/systemd/fluentd.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable fluentd
sudo systemctl start fluentd
```

#### 3. Install EagleEye RADAR
```bash
# Copy files to installation directory
sudo mkdir -p /opt/eagleyeradar
sudo cp -r eagleyeradar/* /opt/eagleyeradar/

# Install system dependencies
sudo apt install -y python3 python3-venv python3-pip \
    snmp graphviz nmblookup nbtscan avahi-utils \
    nmap arp-scan traceroute tcpdump iproute2

# Install service
sudo cp config/systemd/eagleyeradar.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable eagleyeradar
sudo systemctl start eagleyeradar
```

---

## ⚙️ Configuration

### Rsyslog Configuration
Edit `config/rsyslog.conf`:
```bash
# Enable protocols
module(load="imudp")
module(load="imtcp")
module(load="imrelp")

# Define inputs
input(type="imudp" port="514")
input(type="imtcp" port="514")
input(type="imrelp" port="20514")

# Output rule
*.* /var/log/fct-fw/fct-fw.log
```

### Fluentd Configuration
Edit `config/fluentd.conf`:
```xml
# Update OpenSearch connection
<match radar.devices.demo>
  @type opensearch
  host YOUR_OPENSEARCH_HOST
  port 9200
  scheme https
  ssl_verify false
  user YOUR_USERNAME
  password YOUR_PASSWORD
  index_name radar-devices-demo
  id_key _doc_id
  write_operation upsert
</match>
```

### EagleEye RADAR Configuration
Create `/opt/eagleyeradar/eagleye_config.json`:
```json
{
  "networks": ["192.168.1.0/24", "10.0.0.0/24"],
  "snmp_community": "public",
  "snmp_version": "2c",
  "scan_interval": 600,
  "output_dir": "/opt/eagleyeradar/scan"
}
```

### Systemd Service Customization
Edit scan interval in `config/systemd/eagleyeradar.service`:
```ini
[Service]
# Change sleep duration (seconds) - default 600 = 10 minutes
ExecStart=/bin/bash -c 'while true; do /bin/bash /opt/eagleyeradar/setup_and_run_eagleyeradar.sh; sleep 600; done'
```

---

## 💻 Usage

### Starting Services
```bash
# Start all services
sudo systemctl start rsyslog
sudo systemctl start fluentd
sudo systemctl start eagleyeradar

# Check status
sudo systemctl status eagleyeradar
```

### Manual Scan Execution
```bash
# Run single scan
cd /opt/eagleyeradar
sudo bash setup_and_run_eagleyeradar.sh

# View scan output
ls -lh /opt/eagleyeradar/scan/
cat /opt/eagleyeradar/scan/raw_data_streaming.jsonl
cat /opt/eagleyeradar/scan/scan_devices.jsonl
```

### Viewing Logs
```bash
# EagleEye RADAR logs
sudo journalctl -u eagleyeradar -f

# Fluentd logs
sudo journalctl -u fluentd -f

# Rsyslog logs
sudo tail -f /var/log/fct-fw/fct-fw.log
```

### Accessing Web UI
```bash
# On development machine with SSH tunnels configured
# Backend: http://localhost:3001
# Frontend: http://localhost:5173
```

---

## 🔄 Data Flow

### End-to-End Pipeline (10-Minute Cycle)

```
T+0s    → Systemd triggers scan
T+120s  → Scanner writes JSONL files (append mode)
T+125s  → Fluentd detects new lines (5s refresh interval)
T+130s  → Fluentd flushes to OpenSearch (5s flush interval)
T+140s  → OpenSearch indexes data (primary + replica shards)
T+143s  → Backend queries OpenSearch via SSH tunnel
T+145s  → Frontend renders visualization
T+600s  → Next scan cycle begins
```

### Data Formats

#### Scan Metadata (`raw_data_streaming.jsonl`)
```json
{
  "scan_id": "2026-02-16T10:30:00+05:30",
  "scan_start": "2026-02-16T10:30:00+05:30",
  "scan_end": "2026-02-16T10:32:15+05:30",
  "networks_scanned": ["192.168.1.0/24"],
  "devices_discovered": 42,
  "switches_found": 3,
  "routers_found": 2,
  "export_timestamp": "2026-02-16T10:32:20+05:30"
}
```

#### Device Records (`scan_devices.jsonl`)
```json
{
  "scan_id": "2026-02-16T10:30:00+05:30",
  "device_id": "192.168.1.1_aa:bb:cc:dd:ee:ff",
  "ip": "192.168.1.1",
  "mac": "aa:bb:cc:dd:ee:ff",
  "hostname": "core-switch-01",
  "device_type": "switch",
  "os": "Cisco IOS 15.2",
  "manufacturer": "Cisco",
  "model": "Catalyst 3750",
  "ports": [
    {"port": "GigabitEthernet1/0/1", "status": "up", "connected_device": "192.168.1.10"}
  ],
  "neighbors": [
    {"port": "GigabitEthernet1/0/24", "neighbor": "access-switch-02"}
  ],
  "services": ["snmp", "ssh", "http"],
  "export_timestamp": "2026-02-16T10:32:20+05:30"
}
```

---

## 📊 Output Formats

| Format | Location | Purpose |
|--------|----------|---------|
| **JSONL** | `/opt/eagleyeradar/scan/*.jsonl` | Streaming data for Fluentd ingestion |
| **SQLite** | `/opt/eagleyeradar/scan/network_scan.db` | Relational database for local queries |
| **PNG** | `/opt/eagleyeradar/scan/network_topology.png` | Graphviz network diagram |
| **CSV** | `/opt/eagleyeradar/scan/device_inventory.csv` | Spreadsheet-compatible device list |

---

## 🔍 Troubleshooting

### EagleEye RADAR Issues

#### Service not starting
```bash
# Check service status
sudo systemctl status eagleyeradar

# View detailed logs
sudo journalctl -u eagleyeradar -n 100 --no-pager

# Test manual execution
cd /opt/eagleyeradar
sudo bash setup_and_run_eagleyeradar.sh
```

#### No devices discovered
```bash
# Verify SNMP access
snmpwalk -v 2c -c public 192.168.1.1 system

# Check network connectivity
ping -c 3 192.168.1.1

# Review scan configuration
cat /opt/eagleyeradar/eagleye_config.json
```

### Fluentd Issues

#### Service failed to start
```bash
# Check configuration syntax
fluentd --dry-run -c /etc/fluentd/fluentd.conf

# View error logs
sudo journalctl -u fluentd -n 50 --no-pager

# Verify OpenSearch connectivity
curl -k -u admin:PASSWORD https://OPENSEARCH_HOST:9200
```

#### Data not reaching OpenSearch
```bash
# Check buffer directory
ls -lh /var/log/fluentd/buffer/

# Monitor Fluentd output
sudo tail -f /var/log/fluentd/fluentd.log

# Verify position files
cat /var/log/fluentd/radar-devices.pos
```

### Rsyslog Issues

#### Not receiving logs
```bash
# Test local logging
logger -p local0.info "Test message"
tail /var/log/fct-fw/fct-fw.log

# Verify ports are listening
sudo netstat -tulpn | grep rsyslog

# Check firewall rules
sudo ufw status
```

---

## 📚 Documentation

### Core Documentation
- [SETUP_SOC_README.md](SETUP_SOC_README.md) - Complete installation guide
- [EAGLEYE_RADAR_ARCHITECTURE.mmd](EAGLEYE_RADAR_ARCHITECTURE.mmd) - Architecture diagram
- [SETUP_SOC.sh](SETUP_SOC.sh) - Unified installer script

### Configuration Files
- [config/rsyslog.conf](config/rsyslog.conf) - Rsyslog configuration
- [config/fluentd.conf](config/fluentd.conf) - Fluentd pipeline
- [config/systemd/eagleyeradar.service](config/systemd/eagleyeradar.service) - Systemd service

---

## 🛡️ Security Notes

- **SNMP Communities**: Stored in plain text in database (audit trail only)
- **OpenSearch Credentials**: Stored in Fluentd config - use secrets management
- **Root Privileges**: Required for raw socket operations and systemd services
- **Network Scanning**: May trigger IDS alerts - adjust thread count if needed
- **Firewall Exceptions**: Required for UDP:514, TCP:514, RELP:20514

---

## 📝 License

Internal Use Only - FCT Network Operations Team

---

## 👥 Contributors

**EAGLEYE Network Operations Team**  
Version: 2.1 (Production Stable - Enhanced)  
Last Updated: 2026-02-17

---

## 🆘 Support

For issues, questions, or feature requests:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review documentation folder for advanced guides
3. Contact: Network Operations Team

---

**Made with ❤️ by the FCT Network Operations Team**
