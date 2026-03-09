# Deployment Guide

This guide covers different ways to deploy Career Timeline.

## Local Development

Already covered in QUICKSTART.md and DEVELOPMENT.md.

## Production Deployment Options

### Option 1: Self-Hosted (Recommended for Privacy)

#### Requirements
- Server with Node.js 18+
- Domain name (optional)
- Nginx or similar (optional, for reverse proxy)

#### Steps

1. **Build the applications:**
```bash
pnpm build
```

2. **Backend deployment:**

The backend creates:
- `backend/dist/` - Compiled JavaScript

To run:
```bash
cd backend
node dist/index.js
```

For production, use a process manager like PM2:
```bash
npm install -g pm2
cd backend
pm2 start dist/index.js --name career-timeline-api
pm2 save
pm2 startup
```

3. **Frontend deployment:**

The frontend creates:
- `frontend/dist/` - Static files

Serve with any web server. Examples:

**Using Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Using Apache:**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/frontend/dist

    <Directory /path/to/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</VirtualHost>
```

### Option 2: Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY dist ./dist
COPY src ./src

RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM nginx:alpine

COPY dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

### Option 3: Platform as a Service (PaaS)

#### Render.com

1. Create account on Render
2. Create Web Service for backend:
   - Build Command: `cd backend && pnpm install && pnpm build`
   - Start Command: `cd backend && node dist/index.js`
3. Create Static Site for frontend:
   - Build Command: `cd frontend && pnpm install && pnpm build`
   - Publish Directory: `frontend/dist`

#### Railway.app

1. Connect your Git repository
2. Create service for backend
3. Create service for frontend
4. Set environment variables

#### Fly.io

1. Install flyctl
2. Create fly.toml configurations
3. Deploy with `fly deploy`

### Option 4: Serverless

#### Vercel (Frontend)

```bash
cd frontend
vercel
```

Update `frontend/.env`:
```
VITE_API_URL=https://your-backend-url.com/api
```

#### Backend Options
- Railway
- Render
- AWS Lambda with API Gateway
- Google Cloud Run

## Environment Variables

### Backend
```bash
PORT=3001
NODE_ENV=production
```

### Frontend
```bash
VITE_API_URL=https://your-api-domain.com/api
```

## Database Management

### Backup Database

The database is a single file: `backend/data/career-timeline.db`

To backup:
```bash
cp backend/data/career-timeline.db backup-$(date +%Y%m%d).db
```

Automated backup script:
```bash
#!/bin/bash
# backup-db.sh
DB_PATH="backend/data/career-timeline.db"
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_PATH "$BACKUP_DIR/career-timeline-$DATE.db"
echo "Backup created: $BACKUP_DIR/career-timeline-$DATE.db"

# Keep only last 30 days
find $BACKUP_DIR -name "career-timeline-*.db" -mtime +30 -delete
```

Add to crontab for daily backups:
```bash
0 2 * * * /path/to/backup-db.sh
```

### Restore Database

```bash
cp backup-20260304.db backend/data/career-timeline.db
# Restart backend
pm2 restart career-timeline-api
```

### Migrate to Production Database

If moving from SQLite to PostgreSQL/MySQL:

1. Export data from SQLite
2. Update backend to use new database
3. Import data to new database

## SSL/HTTPS

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Auto-renewal:
```bash
sudo certbot renew --dry-run
```

## Performance Optimization

### Frontend
- Gzip/Brotli compression
- CDN for static assets
- Browser caching headers
- Lazy loading images

### Backend
- Connection pooling (if switching from SQLite)
- Response caching
- Rate limiting
- Compression middleware

### Nginx Configuration
```nginx
# Enable gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs career-timeline-api
```

### Health Checks
```bash
curl http://localhost:3001/health
```

Set up monitoring service (UptimeRobot, Pingdom, etc.) to check:
- `https://your-domain.com/api/health`

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable CORS only for your domain
- [ ] Keep dependencies updated
- [ ] Regular database backups
- [ ] Use strong server passwords
- [ ] Firewall configuration
- [ ] Rate limiting on API
- [ ] Input validation enabled

## Troubleshooting Production

### Backend won't start
- Check Node.js version
- Verify file permissions
- Check port availability
- Review logs

### Database errors
- Verify database file permissions
- Check disk space
- Ensure write permissions

### Frontend 404 errors
- Verify index.html exists
- Check server routing config
- Ensure SPA fallback enabled

### CORS errors
- Update CORS origin in backend
- Check API URL in frontend env
- Verify protocol (http/https)

## Scaling Considerations

For high traffic:
1. Use PostgreSQL instead of SQLite
2. Add Redis for caching
3. Horizontal scaling with load balancer
4. CDN for static assets
5. Database read replicas

## Cost Estimates

### Free Tier Options
- Render: Free (with limitations)
- Railway: $5 credit/month
- Vercel: Free for frontend
- Fly.io: Free tier available

### Self-Hosted
- VPS (DigitalOcean, Linode): $5-10/month
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

**Total: ~$5-15/month for self-hosted**

## Recommended Setup for Personal Use

1. **Development**: Local machine
2. **Production**: Self-hosted VPS with Nginx + PM2
3. **Backups**: Daily automated backups to cloud storage
4. **Domain**: Optional, can use IP address locally

## Support

For deployment issues:
- Check logs: `pm2 logs`
- Review server logs: `/var/log/nginx/error.log`
- Verify environment variables
- Check firewall rules
- Ensure ports are open

Remember: Career Timeline stores sensitive career information. Choose deployment options that align with your privacy requirements.
