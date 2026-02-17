# Configuration

This guide covers all configuration options for Eagleye Radar.

## Configuration Methods

Eagleye Radar can be configured through:

1. **Environment Variables** (`.env` file)
2. **Configuration File** (`config.json`)
3. **Dashboard UI** (Settings)
4. **API** (Programmatic)

## Environment Variables

Create or edit `.env` file in the root directory:

```bash
# API Server
API_HOST=0.0.0.0
API_PORT=9000
API_LOG_LEVEL=info
API_WORKERS=4

# Dashboard
DASHBOARD_HOST=0.0.0.0
DASHBOARD_PORT=3000
DASHBOARD_THEME=dark

# Scanner
SCANNER_TYPE=radar
SCANNER_BUFFER_SIZE=65536
SCANNER_THREADS=4

# Storage
DB_TYPE=postgresql
DB_HOST=postgres
DB_PORT=5432
DB_NAME=eagleye
DB_USER=eagleye
DB_PASSWORD=secure_password

# Cache
CACHE_TYPE=redis
CACHE_HOST=redis
CACHE_PORT=6379
CACHE_TTL=3600

# Security
JWT_SECRET=your_secret_key_here
ENABLE_HTTPS=true
CERT_PATH=/etc/certs/server.crt
KEY_PATH=/etc/certs/server.key

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_OUTPUT=/var/log/eagleye/app.log

# Features
ENABLE_ML=true
ENABLE_ALERTS=true
ENABLE_ARCHIVAL=true
```

## Configuration File

Create `config.json` for detailed settings:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 9000,
    "workers": 4,
    "timeout": 30,
    "maxBodySize": "10mb"
  },
  
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000,
    "theme": "dark",
    "title": "Eagleye Radar"
  },
  
  "database": {
    "type": "postgresql",
    "connection": {
      "host": "postgres",
      "port": 5432,
      "database": "eagleye",
      "username": "eagleye",
      "password": "secure_password",
      "ssl": true,
      "pool": {
        "min": 5,
        "max": 20
      }
    }
  },
  
  "storage": {
    "type": "timescaledb",
    "retention": {
      "hot": "24h",
      "warm": "30d",
      "cold": "365d"
    },
    "compression": {
      "enabled": true,
      "algorithm": "zstd"
    }
  },
  
  "scanner": {
    "type": "radar",
    "enabled": true,
    "interfaces": ["eth0", "eth1"],
    "packetBufferSize": 65536,
    "threads": 4,
    "captureOptions": {
      "snaplen": 65535,
      "promisc": 1,
      "timeout": 1000
    }
  },
  
  "cache": {
    "type": "redis",
    "connection": {
      "host": "redis",
      "port": 6379,
      "db": 0
    },
    "ttl": 3600
  },
  
  "security": {
    "jwt": {
      "secret": "your_secret_key",
      "expiration": 86400
    },
    "cors": {
      "enabled": true,
      "origins": ["http://localhost:3000"]
    },
    "rateLimit": {
      "windowMs": 60000,
      "maxRequests": 1000
    }
  },
  
  "logging": {
    "level": "info",
    "format": "json",
    "transports": [
      {
        "type": "file",
        "path": "/var/log/eagleye/app.log",
        "maxSize": "100m",
        "maxFiles": 14
      }
    ]
  },
  
  "features": {
    "ml": true,
    "alerts": true,
    "archival": true,
    "clustering": false
  }
}
```

## Network Configuration

### Network Interfaces

Select which interfaces to monitor:

```json
{
  "interfaces": [
    {
      "name": "eth0",
      "enabled": true,
      "mtu": 1500,
      "description": "Primary network interface"
    },
    {
      "name": "eth1",
      "enabled": true,
      "mtu": 9000,
      "description": "High-speed link"
    }
  ]
}
```

### Network Filters

Configure packet filtering (BPF):

```json
{
  "filters": {
    "enabled": true,
    "rules": [
      {
        "name": "http_traffic",
        "filter": "tcp port 80 or tcp port 8080",
        "sampling": 1.0
      },
      {
        "name": "dns_traffic",
        "filter": "udp port 53",
        "sampling": 0.1
      },
      {
        "name": "ssh_traffic",
        "filter": "tcp port 22",
        "sampling": 1.0
      }
    ]
  }
}
```

## Security Configuration

### SSL/TLS

Enable encrypted connections:

```json
{
  "security": {
    "ssl": {
      "enabled": true,
      "certPath": "/etc/certs/server.crt",
      "keyPath": "/etc/certs/server.key",
      "caPath": "/etc/certs/ca.crt",
      "minVersion": "TLSv1.2"
    }
  }
}
```

### Authentication

Configure user authentication:

```json
{
  "auth": {
    "type": "local",
    "passwordPolicy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "expirationDays": 90
    },
    "mfa": {
      "enabled": true,
      "provider": "totp"
    }
  }
}
```

### LDAP Integration

Connect to LDAP for authentication:

```json
{
  "auth": {
    "type": "ldap",
    "ldap": {
      "server": "ldap.company.com",
      "port": 389,
      "ssl": true,
      "baseDn": "dc=company,dc=com",
      "bindDn": "cn=admin,dc=company,dc=com",
      "bindPassword": "password",
      "userSearchFilter": "(uid={username})",
      "groupSync": true
    }
  }
}
```

## Data Retention

Configure how long data is kept:

```json
{
  "retention": {
    "flows": {
      "hot": "24h",
      "warm": "30d",
      "cold": "365d",
      "delete": false
    },
    "packets": {
      "enabled": false,
      "retention": "24h"
    },
    "logs": {
      "retention": "90d",
      "archive": "aws_s3"
    }
  }
}
```

## Alerting

Configure alerts and notifications:

```json
{
  "alerts": {
    "enabled": true,
    "channels": [
      {
        "type": "email",
        "name": "admin_email",
        "config": {
          "smtp_host": "smtp.gmail.com",
          "smtp_port": 587,
          "from": "alerts@eagleye.local",
          "recipients": ["admin@company.com"]
        }
      },
      {
        "type": "slack",
        "name": "security_team",
        "config": {
          "webhook_url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
          "channel": "#security-alerts"
        }
      }
    ],
    "rules": [
      {
        "name": "high_traffic_alert",
        "condition": "traffic_bytes > 1000000000",
        "window": "5m",
        "severity": "warning",
        "channels": ["admin_email", "security_team"]
      }
    ]
  }
}
```

## Performance Tuning

### Database Optimization

```json
{
  "database": {
    "performance": {
      "poolSize": 20,
      "statementTimeout": 30000,
      "idleInTransactionSessionTimeout": 60000,
      "workMem": "256MB"
    }
  }
}
```

### Memory Management

```json
{
  "memory": {
    "maxHeap": "8GB",
    "gcInterval": 300,
    "cacheSize": "2GB"
  }
}
```

### Network Optimization

```json
{
  "network": {
    "bufferSize": 262144,
    "rssEnabled": true,
    "jumboFrames": true,
    "interruptCoalescing": true
  }
}
```

## Machine Learning Configuration

Enable and configure ML features:

```json
{
  "ml": {
    "enabled": true,
    "models": {
      "anomalyDetection": {
        "enabled": true,
        "sensitivity": 0.8,
        "trainingWindow": "7d"
      },
      "threatClassification": {
        "enabled": true,
        "updateInterval": "24h"
      },
      "prediction": {
        "enabled": false,
        "horizon": "1h"
      }
    }
  }
}
```

## API Configuration

### Rate Limiting

```json
{
  "api": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 60000,
      "maxRequests": 1000,
      "perUser": false
    }
  }
}
```

### API Keys

```json
{
  "api": {
    "keys": [
      {
        "name": "external_system",
        "key": "sk_live_xxxxxxxxxxxxx",
        "permissions": ["read:flows", "read:metrics"],
        "rateLimit": 10000
      }
    ]
  }
}
```

## Clustering

For high-availability deployments:

```json
{
  "cluster": {
    "enabled": true,
    "nodes": [
      "node1.eagleye.local:9000",
      "node2.eagleye.local:9000",
      "node3.eagleye.local:9000"
    ],
    "consensus": "raft",
    "replication": 3
  }
}
```

## Troubleshooting

### Configuration Validation

Validate your configuration:

```bash
curl -X POST http://localhost:9000/api/config/validate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @config.json
```

### View Active Configuration

```bash
curl http://localhost:9000/api/config \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reload Configuration

```bash
curl -X POST http://localhost:9000/api/config/reload \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## See Also

- [Installation Guide](installation.md)
- [API Reference](api-reference.md)
- [Troubleshooting](troubleshooting.md)

---

**Tip:** After changing configuration, reload with `docker compose restart` or use the API endpoint.
