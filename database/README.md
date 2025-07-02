# Emergency Services Database

This directory contains the database schema and sample data for the Huduma Emergency Services system.

## Files

- `create-tables.sql` - Database schema with all tables, indexes, and triggers
- `insert-sample-data.sql` - Sample users and emergency contacts
- `README.md` - This documentation file

## Setup Instructions

### 1. Database Connection

Set your database connection string as an environment variable:

\`\`\`bash
DATABASE_URL=postgresql://username:password@host:port/database_name
\`\`\`

### 2. Run SQL Scripts

Execute the SQL files in order:

1. First run `create-tables.sql` to create the database structure
2. Then run `insert-sample-data.sql` to add sample users and data

### 3. Demo Accounts

The system includes 6 demo accounts with username as password:

#### Clients
- **Username:** PeterNjiru | **Password:** PeterNjiru | **Phone:** +254798578853
- **Username:** MichealWekesa | **Password:** MichealWekesa | **Phone:** +254798578854
- **Username:** TeejanAmusala | **Password:** TeejanAmusala | **Phone:** +254798578855

#### Emergency Responders
- **Username:** MarkMaina | **Password:** MarkMaina | **Phone:** +254700123456 (Fire Service)
- **Username:** SashaMunene | **Password:** SashaMunene | **Phone:** +254700789012 (Police Service)
- **Username:** AliHassan | **Password:** AliHassan | **Phone:** +254700345678 (Medical Service)

## Database Schema

### Users Table
- Stores both clients and emergency responders
- Supports username and phone number authentication
- Role-based access control (client/responder)
- Service type classification for responders

### Emergency Requests Table
- Tracks all emergency service requests
- Location data with GPS coordinates
- Status tracking (pending, active, completed, declined)
- Priority levels (low, medium, high, critical)
- Responder assignment and tracking

### Emergency Contacts Table
- Official emergency service contacts
- Service type categorization
- Location and availability status

### Request Status History Table
- Audit trail for request status changes
- Change tracking with timestamps
- Notes and change attribution

## API Endpoints

The system provides these API endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/emergency` - List emergency requests
- `POST /api/emergency` - Create new emergency request
- `PUT /api/emergency/[id]` - Update emergency request
- `POST /api/init-db` - Initialize database (development)

## Environment Variables

Required environment variables:

\`\`\`bash
DATABASE_URL=postgresql://username:password@host:port/database_name
# or
POSTGRES_URL=postgresql://username:password@host:port/database_name
# or
NEON_DATABASE_URL=postgresql://username:password@host:port/database_name
\`\`\`

## Fallback System

The application includes a robust fallback system:
- Works with or without database connection
- Mock data system for offline development
- Automatic error handling and recovery
- Seamless user experience regardless of database status

## Security Features

- UUID primary keys for security
- Input validation and sanitization
- Role-based access control
- Password authentication
- SQL injection prevention
- Error handling without data exposure
