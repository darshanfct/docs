# 🏢 Forensic CyberTech Documentations

> **Enterprise-grade documentation platform for network security, monitoring, and operations infrastructure**

---

## 🌟 Welcome

Welcome to **Forensic CyberTech** documentation hub — your comprehensive resource for understanding and deploying enterprise-grade network security and operations platforms.

### What We Offer

Our platform provides:
- 🔍 **Network Discovery** - Multi-protocol device discovery and inventory management
- 🛡️ **Security Operations** - Centralized log collection and SOC infrastructure  
- 📊 **Analytics & Insights** - Real-time topology mapping and threat detection
- 🎯 **Enterprise-Grade** - Production-ready deployments at scale

---

## 📚 Our Products

```
┌─────────────────────────────────────────────────────────────────────┐
│                   FORENSIC CYBERTECH PLATFORM                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🦅 PROJECT 1: EAGLEYE RADAR                                        │
│  ─────────────────────────────────────────────                      │
│  Network Discovery & Security Operations Platform                  │
│                                                                     │
│  ✨ Key Features:                                                   │
│     • Multi-protocol device discovery (SNMP, ARP, LLDP, CDP)       │
│     • Centralized syslog collection & processing                  │
│     • Real-time network topology visualization                    │
│     • Comprehensive device inventory management                   │
│     • Security compliance & vulnerability tracking                │
│     • Production-grade reliability & scalability                  │
│                                                                     │
│  📖 [VIEW DOCUMENTATION →](http://localhost:8000/docs-site)        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────│
│                                                                     │
│  [Additional Projects Coming Soon...]                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Navigation

### For New Users

1. **[Getting Started](#getting-started)** - Begin your journey
2. **[System Requirements](#system-requirements)** - Pre-deployment checklist
3. **[Installation Guide](#installation)** - Step-by-step setup
4. **[First Steps](#first-steps)** - Run your first scan

### For Advanced Users

1. **[Architecture Documentation](docs-site)** - Deep technical dive
2. **[Configuration Reference](docs-site)** - Advanced tuning
3. **[API Reference](docs-site)** - Integration guides
4. **[Troubleshooting](docs-site)** - Common issues & solutions

---

## 🦅 EAGLEYE RADAR - Complete Overview

### What is EAGLEYE RADAR?

**EAGLEYE RADAR** is a production-grade network discovery and monitoring platform that provides:

- **Automated Network Discovery** - Discovers all devices across your network without manual configuration
- **Security Operations** - Centralized log collection from firewalls, routers, and switches
- **Topology Mapping** - Visual representation of Layer 2/3 network connections
- **Compliance Tracking** - Monitor device configurations and security posture
- **Real-Time Dashboards** - Live visibility into network inventory and threat indicators

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT SITE (Network Discovery & Log Collection)               │
├─────────────────────────────────────────────────────────────────┤
│  • RADAR Scanner - 50-thread parallel discovery engine         │
│  • Rsyslog - Syslog collection from network devices            │
│  • Fluentd - Log processing & OpenSearch forwarding            │
└─────────────────────────────────────────────────────────────────┘
                    ↓↓↓ HTTPS/SSH Tunnel ↓↓↓
┌─────────────────────────────────────────────────────────────────┐
│  DATA STORAGE (OpenSearch Cluster)                              │
├─────────────────────────────────────────────────────────────────┤
│  • radar-scans: Scan metadata & device summaries               │
│  • radar-devices: Comprehensive device records                 │
│  • firewall-logs: Network security event logs                  │
└─────────────────────────────────────────────────────────────────┘
                    ↓↓↓ REST API ↓↓↓
┌─────────────────────────────────────────────────────────────────┐
│  VISUALIZATION LAYER (Web Dashboards)                           │
├─────────────────────────────────────────────────────────────────┤
│  • Network Topology View - Interactive device maps             │
│  • Device Inventory - Complete device database                 │
│  • Real-Time Analytics - Live scan & threat indicators         │
│  • Historical Tracking - Trend analysis & reporting            │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

#### 🔍 Discovery Engine
- **Multi-Protocol Support**: SNMP (v1/v2c/v3), LLDP, CDP, ARP, DHCP, NetBIOS, mDNS
- **Intelligent Caching**: 10x faster with vendor-specific optimizations
- **Automatic Fallback**: Smart SNMP version detection per device
- **Parallel Scanning**: 50-thread pool for concurrent discovery
- **Rate Limiting**: 5 SNMP queries/sec to avoid IDS triggers

#### 📊 Data Pipeline
- **Streaming Architecture**: JSONL append-only format (no overwrites)
- **Position Tracking**: Prevents duplicate log ingestion
- **Buffer Persistence**: Survives service restarts
- **Exponential Backoff**: 17 retry attempts with intelligent delays
- **Bulk Operations**: 10MB chunks for efficient OpenSearch writes

#### 🎨 Visibility & Analysis
- **Topology Mapping**: Auto-generated Layer 2/3 network diagrams
- **Blind Spot Detection**: Identifies network visibility gaps
- **Security Assessment**: Vulnerability scanning and compliance checks
- **Historical Tracking**: Scan-based versioning for trend analysis
- **Real-Time Dashboards**: Live auto-refresh with custom filtering

#### 🛡️ Production-Ready
- **Systemd Integration**: Auto-restart with 15-second recovery
- **Checkpoint Resume**: Crash recovery for large scans
- **Graceful Degradation**: Fallback when optional tools unavailable
- **Comprehensive Logging**: Structured logs for audit & debugging
- **Enterprise Reliability**: Zero-data-loss design patterns

---

## 📋 Getting Started

### System Requirements

**Minimum Specifications:**
- **OS**: Ubuntu 20.04 LTS or Debian 11 (Linux recommended)
- **CPU**: 2+ cores for scanner service
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB+ for OpenSearch data retention
- **Network**: SNMP access to devices, syslog port access (UDP 514, TCP 514, RELP 20514)
- **OpenSearch**: 7.10+ cluster (running separately)

**Supported Operating Systems:**
- Ubuntu 20.04, 20.10, 21.04, 21.10, 22.04 LTS
- Debian 10, 11, 12
- RHEL/CentOS 8+

**Optional but Recommended:**
- Docker for containerized deployment
- Kubernetes for multi-site deployments
- Grafana for advanced visualization

### Installation

#### Option 1: Automated Installer (Recommended)

```bash
# Clone repository
git clone https://github.com/darshanfct/RADAR-Scanner.git
cd RADAR-Scanner

# Run unified installer
sudo bash SETUP_SOC.sh
```

**What the installer does:**
✅ Detects existing installations  
✅ Validates system requirements  
✅ Installs all dependencies  
✅ Configures services  
✅ Tests connectivity  
✅ Starts services  

#### Option 2: Manual Installation

```bash
# Install Rsyslog
sudo apt update
sudo apt install -y rsyslog

# Install Fluentd
sudo apt install -y ruby ruby-dev
sudo gem install fluentd fluent-plugin-opensearch

# Install EagleEye RADAR
sudo apt install -y python3 python3-venv python3-pip
sudo pip install -r requirements.txt

# Copy systemd services
sudo bash setup_services.sh
```

#### Option 3: Docker Deployment

```bash
docker run -it \
  -e OPENSEARCH_HOST=your-cluster.com \
  -e OPENSEARCH_USER=admin \
  -e OPENSEARCH_PASS=password \
  -v /opt/eagleyeradar:/data \
  darshanfct/eagleye-radar:latest
```

### First Steps

#### 1. Verify Installation

```bash
# Check service status
sudo systemctl status eagleyeradar
sudo systemctl status fluentd
sudo systemctl status rsyslog

# Verify OpenSearch connectivity
curl -k -u admin:password https://your-cluster:9200
```

#### 2. Configure Your Network

Edit `/opt/eagleyeradar/eagleye_config.json`:

```json
{
  "networks": [
    "192.168.1.0/24",
    "10.0.0.0/24"
  ],
  "snmp_community": "public",
  "snmp_version": "2c",
  "scan_interval": 600,
  "thread_count": 50
}
```

#### 3. Run First Scan

```bash
# Start the service
sudo systemctl start eagleyeradar

# Monitor live logs
sudo journalctl -u eagleyeradar -f

# View results
tail -f /opt/eagleyeradar/scan/scan_devices.jsonl
```

#### 4. Access Dashboard

```
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

---

## 📖 Documentation Structure

### Main Documentation
Each project contains comprehensive documentation in its README.md:

**EAGLEYE RADAR Sections:**
- 📖 Overview & Architecture
- 🚀 Quick Start & Installation
- ⚙️ Configuration & Tuning
- 💻 Usage & Operations
- 🔄 Data Flow & Processing
- 📊 Output Formats & Exports
- 🔍 Troubleshooting Guide
- 🔌 API Reference & Integration

### How to Access

**Via Web Interface:**
Visit `http://localhost:8000/docs-site` and navigate using the sidebar

**Via File System:**
Browse `/docs/` directory:
```
docs/
├── P1.EAGLEYE RADAR/
│   └── README.md          (Comprehensive project documentation)
└── index.json             (Project configuration)
```

---

## 🎯 Use Cases

### Network Operations
- Automated device inventory management
- Network topology visualization
- SNMP-based monitoring and alerting
- Service discovery and tracking

### Security Operations
- Centralized firewall/router log collection
- Security event correlation and analysis
- Compliance monitoring and reporting
- Threat detection and response

### Network Engineering
- Network documentation and diagrams
- Change management tracking
- Disaster recovery planning
- Vendor management and licensing

### Compliance & Audit
- Network device inventory audits
- Configuration change tracking
- Security posture assessment
- Regulatory compliance reporting

---

## 🔧 Advanced Topics

### Multi-Site Deployment
Deploy across multiple network sites with centralized OpenSearch cluster. See [Architecture Documentation](docs-site) for details.

### Integration with Existing Systems
Connect with:
- **SIEM**: Forward logs to Splunk, ELK, or other SIEM
- **Ticketing**: Auto-create incidents for discovered vulnerabilities
- **Monitoring**: Integrate with Nagios, Zabbix, or Prometheus
- **Backup**: Archive to S3, Azure, or on-premise storage

### Custom Scanning Profiles
Create specialized scanning profiles for:
- DevOps environments
- IoT device discovery
- Wireless access point detection
- VoIP system mapping

### Performance Tuning
Optimize for your environment:
- Thread pool sizing
- SNMP timeout adjustment
- Cache configuration
- Buffer memory allocation

---

## 🆘 Getting Help

### Documentation
Complete documentation available in the sidebar →  
[**ACCESS DOCUMENTATION**](http://localhost:8000/docs-site)

### Troubleshooting
Common issues and solutions:
1. Check service status: `sudo systemctl status eagleyeradar`
2. View detailed logs: `sudo journalctl -u eagleyeradar -n 100`
3. Verify OpenSearch connectivity: `curl -k -u admin:pass https://host:9200`
4. See [Troubleshooting Section](docs-site) for detailed guidance

### Support
- **Email**: support@forensiccybertech.com
- **Documentation**: [Access Here](docs-site)
- **GitHub Issues**: Create issue on repository

---

## 🗂️ Documentation Layout

```
Your Forensic CyberTech Documentation
│
├─ 📄 index.html              (Main web interface)
├─ 📄 README.md               (This file - Home page)
│
├─ /docs/
│   ├─ index.json             (Projects configuration)
│   │
│   └─ P1.EAGLEYE RADAR/
│       └─ README.md          (Complete project documentation)
│
└─ /assets/
    ├─ /css/
    │   └─ style.css          (Enterprise theme styling)
    └─ /js/
        ├─ app.js             (Main application logic)
        ├─ markdown.js        (Markdown rendering)
        └─ search.js          (Full-text search)
```

### Adding New Projects

To add a new project (e.g., "P2.Your Project"):

1. **Create project folder** in `/docs/`
   ```bash
   mkdir -p "docs/P2.Your Project"
   ```

2. **Add README.md** with your documentation
   ```bash
   cp template-README.md "docs/P2.Your Project/README.md"
   ```

3. **Update /docs/index.json**
   ```json
   {
     "id": "P2.Your Project",
     "title": "📋 Your Project",
     "description": "Project description",
     "docs": [
       {
         "title": "Complete Documentation",
         "file": "P2.Your Project/README.md",
         "id": "documentation"
       }
     ]
   }
   ```

4. **Refresh browser** - New project appears in sidebar

---

## 🎓 Learning Path

### Beginner
1. Read this page (you're here!)
2. Follow [Quick Start](#quick-start)
3. Run first scan
4. Explore dashboard

### Intermediate
1. Review [Installation Options](#installation)
2. Configure for your network
3. Set up log collection
4. Create custom scanning profiles

### Advanced
1. Study [Architecture](docs-site)
2. Integrate with existing systems
3. Deploy multi-site architecture
4. Optimize for performance

---

## 📅 Roadmap

### Recent Releases
- ✅ v2.1 - Enhanced OpenSearch integration
- ✅ v2.0 - Multi-site deployment support
- ✅ v1.5 - API reference and SDK

### Upcoming Features
- 🔜 Machine learning-based threat detection
- 🔜 Kubernetes-native deployment
- 🔜 Mobile app for on-the-go monitoring
- 🔜 Advanced reporting and compliance modules

---

## 📝 Version & Support

| Item | Details |
|------|---------|
| **Current Version** | 2.1 (Production) |
| **Release Date** | February 2026 |
| **Status** | Stable & Supported |
| **License** | Internal Use Only |
| **Support** | FCT Operations Team |

---

## 🙋 Feedback & Suggestions

We'd love to hear from you!

- 💡 **Feature Request** - Have a great idea?
- 🐛 **Bug Report** - Found an issue?
- 📚 **Documentation** - Want to improve docs?
- ❓ **Questions** - Need clarification?

Contact: Network Operations Team

---

## 🎉 Ready to Get Started?

### Choose Your Path:

| Path | Action |
|------|--------|
| **First Time?** | [👉 Quick Start](#quick-start) |
| **Expert Setup?** | [👉 Advanced Installation](#option-2-manual-installation) |
| **Docker User?** | [👉 Container Deployment](#option-3-docker-deployment) |
| **Need Help?** | [👉 Troubleshooting](docs-site) |
| **Want Details?** | [👉 Full Documentation](docs-site) |

---

<div align="center">

## 🚀 Start Your Journey Now

**[Access Full Documentation →](http://localhost:8000/docs-site)**

---

**Made with ❤️ by Forensic CyberTech**  
*Enterprise Network Security & Operations Platform*

**Version 2.1** | **February 2026** | **Production Ready**

</div>

---

## 🔗 Quick Links

- [📚 Full Documentation](http://localhost:8000/docs-site)
- [🦅 EAGLEYE RADAR Guide](http://localhost:8000/docs-site)
- [⚙️ Configuration Reference](http://localhost:8000/docs-site)
- [🔌 API Documentation](http://localhost:8000/docs-site)
- [🔍 Troubleshooting Guide](http://localhost:8000/docs-site)

**Last Updated:** February 17, 2026  
**Status:** ✅ Production Ready
