# Installation Guide

Complete step-by-step installation guide for EAGLEYE RADAR.

## System Requirements

### Minimum
- **OS**: Ubuntu 20.04 LTS, Debian 11, or CentOS 8
- **CPU**: 2 cores
- **RAM**: 8 GB
- **Storage**: 50 GB SSD

### Recommended
- **OS**: Ubuntu 22.04 LTS, RHEL 8+
- **CPU**: 4+ cores
- **RAM**: 16 GB
- **Storage**: 500 GB+ SSD

## Installation Methods

### 1. Automated Installation (Recommended)

```bash
git clone https://github.com/darshanfct/RADAR-Scanner.git
cd RADAR-Scanner
sudo bash SETUP_SOC.sh
```

Follow the interactive prompts to configure:
- OpenSearch connection
- Network scanning ranges
- Log collection settings
- Service parameters

### 2. Manual Installation

#### Dependencies
```bash
sudo apt update
sudo apt install -y \
    python3 python3-venv python3-pip \
    snmp graphviz nmblookup nbtscan \
    avahi-utils nmap arp-scan \
    ruby ruby-dev
```

#### Rsyslog Setup
```bash
sudo apt install -y rsyslog
sudo systemctl enable rsyslog
sudo systemctl start rsyslog
```

#### Fluentd Setup
```bash
sudo gem install fluentd fluent-plugin-opensearch
sudo mkdir -p /etc/fluentd
# Copy fluentd.conf to /etc/fluentd/
sudo systemctl enable fluentd
```

#### RADAR Scanner Setup
```bash
sudo mkdir -p /opt/eagleyeradar
# Copy application files
sudo bash /opt/eagleyeradar/setup_and_run_eagleyeradar.sh
sudo systemctl enable eagleyeradar
```

## Post-Installation

1. Verify services:
```bash
sudo systemctl status rsyslog
sudo systemctl status fluentd
sudo systemctl status eagleyeradar
```

2. Check OpenSearch connectivity:
```bash
curl -k -u admin:password https://YOUR_OS_HOST:9200
```

3. View first scan:
```bash
tail -f /opt/eagleyeradar/scan/raw_data_streaming.jsonl
```

## Troubleshooting

See [Troubleshooting Guide](troubleshooting.md)
