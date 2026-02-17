# Troubleshooting

Solutions to common issues with Eagleye Radar.

## Installation Issues

### Docker service won't start

**Error**: `docker: cannot connect to the Docker daemon`

**Solution**:
```bash
# Start Docker service
sudo systemctl start docker

# Add user to docker group (requires logout/login)
sudo usermod -aG docker $USER

# Verify
docker ps
```

### Port already in use

**Error**: `bind: address already in use`

**Solution**:
```bash
# Find process using port
lsof -i :3000
netstat -tlnp | grep 3000

# Kill process
sudo kill -9 <PID>

# Or change port in .env
API_PORT=9001
DASHBOARD_PORT=3001
```

### Database connection failed

**Error**: `ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check database is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Verify environment variables
docker compose config | grep DB_

# Reset database (deletes data!)
docker compose down -v
docker compose up -d postgres
```

## Configuration Issues

### Invalid environment variables

**Error**: `Configuration invalid: DB_PASSWORD required`

**Solution**:
1. Check `.env` file exists
2. Verify all required variables are set
3. No spaces around `=` in `.env`
4. Restart services: `docker compose restart`

### Configuration not applying

**Issue**: Changes to `.env` not taking effect

**Solution**:
```bash
# Rebuild and restart containers
docker compose down
docker compose up -d

# Or just restart
docker compose restart

# Verify new config
docker compose config | grep YOUR_SETTING
```

## Authentication Issues

### Cannot log in to dashboard

**Error**: `Invalid credentials` or `User not found`

**Solution**:
```bash
# Reset admin password
docker compose exec api npm run reset-password admin

# Or via database
docker compose exec postgres psql -U eagleye -d eagleye -c \
  "UPDATE users SET password = crypt('newpassword', gen_salt('bf')) WHERE username = 'admin';"
```

### Token expired

**Error**: `Token has expired`

**Solution**:
```bash
# Request new token
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'

# Increase token expiration in config
JWT_EXPIRATION=604800  # 7 days
```

### Permission denied errors

**Error**: `Forbidden: insufficient permissions`

**Solution**:
1. Check user role in dashboard: **Settings → Users**
2. Verify user has required permissions
3. Grant permissions if needed: **Edit User → Permissions**
4. Try with admin account

## Performance Issues

### High CPU usage

**Cause**: Excessive packet processing or indexing

**Solution**:
```bash
# Reduce sampling rate
SCANNER_SAMPLING_RATE=0.5

# Reduce number of threads
SCANNER_THREADS=2

# Disable unused features
ENABLE_ML=false
ENABLE_ARCHIVAL=false

# Check logs
docker compose logs collector
```

### High memory usage

**Cause**: Large buffer sizes or memory leaks

**Solution**:
```bash
# Reduce buffer size
SCANNER_BUFFER_SIZE=32768

# Clear cache
curl -X POST http://localhost:9000/api/cache/clear \
  -H "Authorization: Bearer YOUR_TOKEN"

# Restart affected service
docker compose restart api
```

### Slow queries

**Cause**: Missing indexes or large datasets

**Solution**:
```bash
# Check query performance
EXPLAIN ANALYZE SELECT ...

# Create missing indexes
curl -X POST http://localhost:9000/api/indexes/create \
  -H "Authorization: Bearer YOUR_TOKEN"

# Archive old data
curl -X POST http://localhost:9000/api/data/archive \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Data Issues

### Missing data or gaps

**Cause**: Dropped packets or analyzer crash

**Solution**:
```bash
# Check for packet loss
curl http://localhost:9000/api/metrics/packet-loss \
  -H "Authorization: Bearer YOUR_TOKEN"

# Restart analyzer
docker compose restart collector

# Check logs for errors
docker compose logs collector --tail 100
```

### Disk space full

**Error**: `No space left on device`

**Solution**:
```bash
# Check disk usage
df -h

# Enable compression
docker compose exec postgres psql -U eagleye -d eagleye -c \
  "ALTER TABLE network_flows SET (timescaledb.compress, timescaledb.compress_segmentby = 'source_ip');"

# Archive old data
curl -X POST http://localhost:9000/api/data/archive \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"older_than": "30d", "destination": "s3://bucket"}'

# Clean up old indices
docker compose exec postgres pg_repack
```

## Network Issues

### Can't capture traffic from interface

**Error**: `Permission denied` or `No such device`

**Solution**:
```bash
# Check interfaces exist
ip link show

# Run with sudo (Docker daemon needs permissions)
sudo docker compose up -d

# Or configure capabilities
docker compose exec collector setcap cap_net_raw+ep /usr/bin/app

# Check interface is up
ip link set eth0 up
```

### Scanner not detecting traffic

**Issue**: Interface is up but no packets captured

**Solution**:
```bash
# Manual packet capture test
sudo tcpdump -i eth0 -c 10

# Check firewall rules
iptables -L -n

# Verify scanner configuration
curl http://localhost:9000/api/scanner/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Wrong interface? List all
ip link show
```

## Dashboard Issues

### Dashboard won't load

**Error**: `Connection refused` or blank page

**Solution**:
1. Check dashboard service: `docker compose ps dashboard`
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Check browser console for errors: `F12 → Console`
4. Restart dashboard: `docker compose restart dashboard`
5. Check network: `http://localhost:3000`

### Slow dashboard performance

**Cause**: Excessive data loading or rendering

**Solution**:
```bash
# Reduce time range in dashboard
# Load only last 24 hours by default

# Enable caching
CACHE_ENABLED=true
CACHE_TTL=3600

# Reduce metrics update frequency
METRICS_UPDATE_INTERVAL=30000  # 30 seconds
```

### Missing charts or metrics

**Issue**: Some dashboard panels empty

**Solution**:
```bash
# Rebuild metrics
curl -X POST http://localhost:9000/api/metrics/rebuild \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check data exists
curl 'http://localhost:9000/api/flows?limit=1' \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify time range
# Ensure dashboard is querying correct time range
```

## API Issues

### API returns 503 Service Unavailable

**Cause**: API service is down or database unreachable

**Solution**:
```bash
# Check service status
docker compose ps api

# Check logs
docker compose logs api

# Restart service
docker compose restart api

# Verify database connectivity
docker compose exec api curl http://postgres:5432
```

### API responses very slow

**Cause**: Timeout or long-running query

**Solution**:
```bash
# Check API logs for slow queries
docker compose logs api | grep "took"

# Increase API timeout
API_TIMEOUT=60000  # 60 seconds

# Check database performance
# See "Slow queries" section above
```

### Webhook delivery failing

**Issue**: Alerts not received via webhook

**Solution**:
```bash
# Check webhook configuration
curl http://localhost:9000/api/webhooks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test webhook manually
curl -X POST https://your-server.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check API logs for webhook errors
docker compose logs api | grep webhook
```

## Debugging

### Enable debug logging

```bash
# Set log level
LOG_LEVEL=debug
SCANNER_DEBUG=true

# Restart services
docker compose down
docker compose up -d

# View debug logs
docker compose logs -f --tail 50
```

### Collect diagnostic information

```bash
# Generate diagnostics
docker compose exec api npm run diagnostics > diagnostics.json

# System information
uname -a > system.txt
free -h >> system.txt
df -h >> system.txt

# Docker information
docker compose ps >> docker.txt
docker images >> docker.txt
```

### Test connectivity

```bash
# Test database
docker compose exec api nc -zv postgres 5432

# Test API
curl http://localhost:9000/api/health

# Test dashboard
curl http://localhost:3000

# Test DNS
curl https://api.example.com
```

## Get Help

If issues persist:

1. Check **[Configuration](configuration.md)** - Ensure correct setup
2. Review **[Installation](installation.md)** - Verify installation steps
3. Collect diagnostic logs: `docker compose logs > debug.log`
4. Check API status: `curl http://localhost:9000/api/health`
5. Review system resources: `docker stats`

**Need more help?**
- Visit the community forum
- Check GitHub issues
- Contact support team

---

**Tip**: Always check logs first: `docker compose logs -f`
