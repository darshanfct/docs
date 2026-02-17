# Installation Guide

This guide will walk you through installing Eagleye Radar in your environment.

## Prerequisites

Before you begin, ensure you have the following:

- **Operating System**: Ubuntu 20.04+, CentOS 8+, or RHEL 8+
- **Container Runtime**: Docker 20.10+ and Docker Compose 1.29+
- **Network**: Port 3000 (Dashboard), Port 9000 (API), Port 5555 (Collector)
- **Hardware**: Minimum 8GB RAM, 20GB disk space

### Install Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**CentOS/RHEL:**
```bash
sudo yum install -y docker
sudo usermod -aG docker $USER
sudo systemctl start docker
```

**Verify Installation:**
```bash
docker --version
docker compose version
```

## Quick Start (Docker)

The fastest way to get Eagleye Radar running is with Docker Compose.

### Step 1: Clone the Repository

```bash
git clone https://github.com/eagleye-radar/core.git
cd core
```

### Step 2: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# API Configuration
API_PORT=9000
API_HOST=0.0.0.0
API_LOG_LEVEL=info

# Dashboard Configuration
DASHBOARD_PORT=3000
DASHBOARD_THEME=dark

# Collector Configuration
COLLECTOR_PORT=5555
COLLECTOR_WORKERS=4

# Database
DB_TYPE=postgresql
DB_HOST=postgres
DB_PORT=5432
DB_NAME=eagleye
DB_USER=eagleye
DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your_jwt_secret_key_here
ENABLE_SSL=true
SSL_CERT_PATH=/etc/certs/server.crt
SSL_KEY_PATH=/etc/certs/server.key
```

### Step 3: Start Services

```bash
docker compose up -d
```

Wait for services to be ready (30-60 seconds):

```bash
docker compose logs -f
```

### Step 4: Access Dashboard

Once running, open your browser and navigate to:

```
http://localhost:3000
```

Default credentials:
- **Username**: `admin`
- **Password**: `eagleye_default`

⚠️ **Change default password immediately!**

## Step-by-Step Installation

For detailed installation in different environments, see the sections below.

### Kubernetes Deployment

For production high-availability deployments:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployments.yaml
kubectl apply -f k8s/services.yaml
```

Verify deployment:

```bash
kubectl get pods -n eagleye
kubectl get svc -n eagleye
```

### Bare Metal Installation

For direct installation on Linux servers:

#### 1. Install Node.js Runtime

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install PostgreSQL

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 3. Create Database

```bash
sudo -u postgres psql
```

Then in the PostgreSQL prompt:

```sql
CREATE USER eagleye WITH PASSWORD 'your_password';
CREATE DATABASE eagleye OWNER eagleye;
GRANT ALL PRIVILEGES ON DATABASE eagleye TO eagleye;
```

#### 4. Install Eagleye Services

```bash
# Clone repository
git clone https://github.com/eagleye-radar/core.git
cd core

# Install dependencies
npm install

# Build application
npm run build

# Run database migrations
npm run migrate

# Start services
npm start
```

## Post-Installation Setup

### Change Default Password

Log in to the dashboard and change the default password:

1. Click **Settings** → **Users**
2. Select **admin** user
3. Click **Change Password**
4. Enter new secure password

### Configure Network Interfaces

To monitor network traffic, configure which interfaces to monitor:

1. Go to **Settings** → **Network Interfaces**
2. Select interfaces to monitor
3. Configure packet capture settings
4. Click **Save**

### Create API Tokens

For headless API access:

1. Navigate to **Settings** → **API Tokens**
2. Click **Generate New Token**
3. Set appropriate permissions
4. Copy and store securely (shown only once!)

### Set Up Alerts

Configure alert rules for anomalies:

1. Go to **Alerts** → **Rules**
2. Click **Create Rule**
3. Define trigger conditions
4. Set notification channels
5. Save rule

## Verification

### Check Service Health

```bash
# Docker
docker compose ps

# Output should show:
# NAME                COMMAND             STATUS
# eagleye-api         "node server.js"    Up
# eagleye-dashboard   "npm start"         Up
# eagleye-collector   "java -jar ..."     Up
# postgres            "docker-entrypoint" Up
```

### Test API Connectivity

```bash
curl -X GET http://localhost:9000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "uptime": 1234567
}
```

### Access Dashboard

Open http://localhost:3000 and log in with your credentials.

## Troubleshooting

### Services won't start

```bash
# Check logs
docker compose logs api
docker compose logs dashboard
docker compose logs collector

# Restart services
docker compose restart

# Full reset (deletes data!)
docker compose down -v
docker compose up -d
```

### Database connection errors

```bash
# Verify database is running
docker compose exec postgres psql -U eagleye -d eagleye -c "SELECT 1;"

# Check environment variables
docker compose config | grep DB_
```

### Port conflicts

If ports are already in use, modify `.env`:

```env
API_PORT=9001
DASHBOARD_PORT=3001
COLLECTOR_PORT=5556
```

See [Troubleshooting](troubleshooting.md) for more help.

## Next Steps

- [Configuration Guide](configuration.md) - Configure for your environment
- [Radar Scanner](radar-scanner.md) - Set up network scanning
- [API Reference](api-reference.md) - Integrate with other systems

## Support

Need help? Check our [Troubleshooting Guide](troubleshooting.md) or visit the community forums.

---

**Installation complete!** 🎉
