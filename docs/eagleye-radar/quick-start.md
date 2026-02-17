# Quick Start Guide

Get started with EAGLEYE RADAR in minutes.

## Prerequisites

- Ubuntu 20.04+ or Debian 11+
- Python 3.8+
- Docker (optional but recommended)
- SNMP access to network devices

## Installation in 5 Minutes

```bash
# Clone repository
git clone https://github.com/darshanfct/RADAR-Scanner.git
cd RADAR-Scanner

# Run installer
sudo bash SETUP_SOC.sh

# Wait for completion...
# Access dashboard at http://localhost:5173
```

## First Scan

```bash
# Start the service
sudo systemctl start eagleyeradar

# Check status
sudo systemctl status eagleyeradar

# View live logs
sudo journalctl -u eagleyeradar -f
```

## Next Steps

- Configure your network ranges in `/opt/eagleyeradar/eagleye_config.json`
- Set up OpenSearch connection
- Access the web dashboard
- Review detailed [Installation Guide](installation.md)

> **Tip:** The first scan may take 2-3 minutes. Subsequent scans run on a 10-minute interval.
