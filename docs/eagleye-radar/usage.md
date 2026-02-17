# Usage Guide

How to use EAGLEYE RADAR for network scanning and monitoring.

## Starting Services

```bash
# Start the scanner service
sudo systemctl start eagleyeradar

# Start all services
sudo systemctl start rsyslog fluentd eagleyeradar

# Enable auto-start on boot
sudo systemctl enable eagleyeradar
```

## Running Scans

### Automatic Scans

Scans run automatically every 10 minutes (configurable).

```bash
# Check scan status
sudo systemctl status eagleyeradar

# View recent scans
ls -lht /opt/eagleyeradar/scan/

# Monitor active scan
sudo journalctl -u eagleyeradar -f
```

### Manual Scan

```bash
# Run immediate scan
sudo /bin/bash /opt/eagleyeradar/setup_and_run_eagleyeradar.sh

# With custom config
cd /opt/eagleyeradar
NETWORKS="192.168.2.0/24" bash setup_and_run_eagleyeradar.sh
```

## Viewing Results

### Scan Metadata

```bash
cat /opt/eagleyeradar/scan/raw_data_streaming.jsonl | tail -1
```

### Device Inventory

```bash
cat /opt/eagleyeradar/scan/scan_devices.jsonl | head -20
```

### Network Topology

```bash
# View PNG diagram
xdg-open /opt/eagleyeradar/scan/network_topology.png
```

### CSV Export

```bash
cat /opt/eagleyeradar/scan/device_inventory.csv
```

## Web Dashboard

Access the dashboard at: `http://localhost:5173`

Features:
- Real-time device inventory
- Network topology visualization
- Scan history
- Device details
- Network metrics

## Logs and Monitoring

```bash
# Scanner logs
sudo journalctl -u eagleyeradar -n 50

# Fluentd ingestion logs
sudo journalctl -u fluentd -n 50

# Syslog collection
sudo tail -f /var/log/fct-fw/fct-fw.log
```

## Exporting Data

### To CSV
```bash
aws s3 cp --recursive /opt/eagleyeradar/scan/ s3://bucket/exports/
```

### To OpenSearch
Data is automatically indexed after scanning.

Query via OpenSearch:
```bash
curl -k -u admin:password https://localhost:9200/radar-devices-demo/_search
```

## See Also

- [Configuration](configuration.md)
- [Troubleshooting](troubleshooting.md)
- [Architecture](architecture.md)
