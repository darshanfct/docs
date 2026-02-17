# Troubleshooting Guide

Solutions to common EAGLEYE RADAR issues.

## Service Won't Start

### Check Service Status
```bash
sudo systemctl status eagleyeradar
sudo journalctl -u eagleyeradar -n 50
```

### Common Issues

**Issue**: `Failed to start eagleyeradar.service`

**Solution**:
```bash
# Check Python installation
python3 --version

# Check dependencies
which snmpwalk
python3 -c "import pysnmp"

# Install missing packages
sudo apt install -y python3-pip python3-venv
pip install pysnmp
```

## No Devices Discovered

### 1. Verify Network Connectivity
```bash
# Test SNMP access
snmpwalk -v 2c -c public 192.168.1.1 system

# Test ping
ping -c 3 192.168.1.1

# Test with nmap
nmap -sn 192.168.1.0/24
```

### 2. Check Configuration
```bash
cat /opt/eagleyeradar/eagleye_config.json

# Verify network ranges
cat /opt/eagleyeradar/eagleye_config.json | grep networks
```

### 3. Debug Scanner
```bash
cd /opt/eagleyeradar
SNMP_DEBUG=1 python3 eagleyeradar.py --debug 192.168.1.1
```

## High CPU Usage

### Check Process
```bash
top -p $(pgrep -f eagleyeradar.py)
```

### Reduce Load
```json
{
  "threads": 10,
  "rate_limit": 2
}
```

Restart after editing config:
```bash
sudo systemctl restart eagleyeradar
```

## Data Not in OpenSearch

### Check Fluentd Status
```bash
sudo systemctl status fluentd
sudo journalctl -u fluentd -n 50
```

### Verify Connection
```bash
curl -k -u admin:password https://OPENSEARCH_HOST:9200 /_cluster/health
```

### Check Buffers
```bash
ls -lh /var/log/fluentd/buffer/
```

### Check Files
```bash
ls -lh /opt/eagleyeradar/scan/*.jsonl
head -5 /opt/eagleyeradar/scan/scan_devices.jsonl
```

## Syslog Not Received

### Verify Rsyslog
```bash
sudo systemctl status rsyslog
sudo netstat -tulpn | grep 514
```

### Test Manual Send
```bash
logger -p local0.info "Test message"
tail /var/log/fct-fw/fct-fw.log
```

### Check Permissions
```bash
ls -la /var/log/fct-fw/
sudo chown syslog:adm /var/log/fct-fw
sudo chmod 755 /var/log/fct-fw
```

## Memory Leaks

### Monitor Memory
```bash
free -h
watch -n 5 'free -h'
```

### Restart Services
```bash
sudo systemctl restart eagleyeradar
sudo systemctl restart fluentd
```

### Clear Cache
```bash
sync; echo 3 > /proc/sys/vm/drop_caches
```

## Disk Space Issues

### Check Usage
```bash
df -h
du -sh /opt/eagleyeradar/

```

### Archive Old Data
```bash
tar -czf /backup/scans_$(date +%Y%m%d).tar.gz /opt/eagleyeradar/scan/
rm -rf /opt/eagleyeradar/scan/*.jsonl
```

## SNMP Timeout Issues

### May Indicate
- Network path blocked by firewall
- SNMP not enabled on device
- Incorrect community string
- Device overloaded

### Solution
```bash
# Test with longer timeout
snmpwalk -v 2c -c public -t 5 192.168.1.1 system
```

## Getting Help

1. Check this troubleshooting guide
2. Review logs:
   ```bash
   sudo journalctl -u eagleyeradar -n 100
   sudo journalctl -u fluentd -n 100
   ```
3. Collect diagnostics:
   ```bash
   uname -a > diagnostics.txt
   docker ps >> diagnostics.txt
   df -h >> diagnostics.txt
   free -h >> diagnostics.txt
   ```
4. Contact support with logs

## See Also

- [Installation](installation.md)
- [Configuration](configuration.md)
- [Usage Guide](usage.md)
