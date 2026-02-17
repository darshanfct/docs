# Configuration Guide

Configure EAGLEYE RADAR for your environment.

## Main Configuration File

Location: `/opt/eagleyeradar/eagleye_config.json`

```json
{
  "networks": [
    "192.168.1.0/24",
    "10.0.0.0/24"
  ],
  "snmp_community": "public",
  "snmp_version": "2c",
  "scan_interval": 600,
  "threads": 50,
  "rate_limit": 5,
  "output_dir": "/opt/eagleyeradar/scan"
}
```

## OpenSearch Configuration

Edit `/etc/fluentd/fluentd.conf`:

```xml
<match radar.devices.demo>
  @type opensearch
  host your-opensearch-host
  port 9200
  scheme https
  ssl_verify false
  user opensearch_user
  password opensearch_password
  index_name radar-devices-demo
</match>
```

## Scan Interval

Modify systemd service to change scan frequency:

```bash
sudo systemctl edit --full eagleyeradar
```

Change the `ExecStart` line:
```ini
ExecStart=/bin/bash -c 'while true; do sleep 600; /bin/bash /opt/eagleyeradar/setup_and_run_eagleyeradar.sh; done'
```

Values:
- `600` = 10 minutes
- `300` = 5 minutes
- `1800` = 30 minutes

## Advanced Settings

### SNMP Configuration

```json
{
  "snmp": {
    "v1": { "enabled": false },
    "v2c": { "enabled": true, "communities": ["public"] },
    "v3": {
      "enabled": true,
      "users": [
        {
          "username": "admin",
          "auth_pass": "password",
          "priv_pass": "password"
        }
      ]
    }
  }
}
```

### Logging

```json
{
  "logging": {
    "level": "info",
    "file": "/var/log/eagleyeradar/scanner.log",
    "max_size": "100MB"
  }
}
```

## Performance Tuning

### For Large Networks (>1000 devices)

```json
{
  "threads": 100,
  "rate_limit": 10,
  "cache_ttl": 3600,
  "batch_size": 1000
}
```

### For Small Networks (<100 devices)

```json
{
  "threads": 10,
  "rate_limit": 2,
  "cache_ttl": 1800,
  "batch_size": 100
}
```

## See Also

- [Installation Guide](installation.md)
- [Troubleshooting](troubleshooting.md)
- [Usage Guide](usage.md)
