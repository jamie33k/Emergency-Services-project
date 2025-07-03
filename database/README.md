# Huduma Emergency Services Database

This directory contains the database schema and sample data for the Huduma Emergency Services system.

## Database Structure

### Tables

1. **users** - Stores both clients and emergency responders
2. **emergency_requests** - Stores all emergency service requests
3. **emergency_contacts** - Official emergency service contacts
4. **request_status_history** - Tracks status changes for requests

### Key Features

- UUID primary keys for security
- Automatic timestamp updates
- Status change logging
- Performance indexes
- Data integrity constraints

## Setup Instructions

### 1. Database Connection

Make sure you have the following environment variable set:

\`\`\`bash
DATABASE_URL="postgresql://username:password@hostname:port/database"
\`\`\`

### 2. Initialize Database

Run the SQL scripts in order:

\`\`\`bash
# 1. Create tables and schema
psql $DATABASE_URL -f database/create-tables.sql

# 2. Insert sample data
psql $DATABASE_URL -f database/insert-sample-data.sql
\`\`\`

### 3. Alternative: Use API Endpoint

You can also initialize the database via the API:

\`\`\`bash
curl -X POST http://localhost:3000/api/init-db
\`\`\`

## Demo Accounts

### Clients (Username = Password)
- **PeterNjiru** / +254798578853
- **MichealWekesa** / +254798578854  
- **TeejanAmusala** / +254798578855

### Emergency Responders (Username = Password)
- **MarkMaina** / +254700123456 (Fire Department)
- **SashaMunene** / +254700789012 (Police)
- **AliHassan** / +254700345678 (Medical)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Emergency Requests
- `GET /api/emergency` - Get all requests (or user-specific)
- `POST /api/emergency` - Create new emergency request
- `PUT /api/emergency/[id]` - Update request status

### Database Management
- `POST /api/init-db` - Initialize database tables

## Emergency Contacts

The system includes official emergency contacts for Nairobi:

### Medical Services
- Nairobi Hospital Emergency: +254-20-2845000
- Kenyatta National Hospital: +254-20-2726300
- Aga Khan Hospital: +254-20-3662000

### Fire Services
- Central Fire Station: +254-20-222181
- Industrial Area Station: +254-20-558899

### Police Services
- Central Police Station: +254-20-222222
- Kilimani Police Station: +254-20-2710000

## Development Notes

- The system includes fallback mock data when database is unavailable
- All passwords are set to match usernames for demo purposes
- Location data uses Nairobi coordinates by default
- Status changes are automatically logged for audit purposes

## Production Considerations

1. **Security**: Implement proper password hashing (bcrypt)
2. **Validation**: Add input validation and sanitization
3. **Monitoring**: Set up database monitoring and alerts
4. **Backup**: Implement regular database backups
5. **Scaling**: Consider read replicas for high traffic
