# Emergency Services Database

This directory contains the database schema and sample data for the Emergency Services System.

## Database Structure

### Tables

#### users
Stores information about both clients and emergency service responders.

**Columns:**
- `id` (UUID, Primary Key) - Unique identifier
- `username` (VARCHAR(50), Unique) - Login username
- `password` (VARCHAR(255)) - User password (in production, this should be hashed)
- `name` (VARCHAR(100)) - Full name
- `email` (VARCHAR(100)) - Email address
- `phone` (VARCHAR(20)) - Phone number
- `user_type` (VARCHAR(20)) - Either 'client' or 'responder'
- `service_type` (VARCHAR(20)) - For responders: 'fire', 'police', or 'medical'
- `created_at` (TIMESTAMP) - Account creation timestamp

#### emergency_requests
Stores emergency service requests from clients.

**Columns:**
- `id` (UUID, Primary Key) - Unique request identifier
- `client_id` (UUID, Foreign Key) - References users.id
- `client_name` (VARCHAR(100)) - Client's name
- `client_phone` (VARCHAR(20)) - Client's phone number
- `service_type` (VARCHAR(20)) - Type of service: 'fire', 'police', or 'medical'
- `location_lat` (DECIMAL(10,8)) - Latitude coordinate
- `location_lng` (DECIMAL(11,8)) - Longitude coordinate
- `location_address` (TEXT) - Human-readable address
- `description` (TEXT) - Description of the emergency
- `priority` (VARCHAR(20)) - Priority level: 'low', 'medium', 'high', or 'critical'
- `status` (VARCHAR(20)) - Request status: 'pending', 'active', 'completed', or 'cancelled'
- `responder_id` (UUID, Foreign Key) - References users.id (when assigned)
- `responder_name` (VARCHAR(100)) - Assigned responder's name
- `responder_phone` (VARCHAR(20)) - Assigned responder's phone
- `estimated_arrival` (VARCHAR(50)) - Estimated arrival time
- `created_at` (TIMESTAMP) - Request creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Files

### create-tables.sql
Contains the DDL statements to create all necessary tables and indexes.

### insert-sample-data.sql
Contains sample data for testing the application, including:
- Demo client accounts
- Demo responder accounts
- Sample emergency requests

## Demo Accounts

### Clients
- **Username:** JohnDoe, **Password:** JohnDoe
- **Username:** JaneSmith, **Password:** JaneSmith  
- **Username:** MikeJohnson, **Password:** MikeJohnson

### Responders
- **Username:** MarkMaina, **Password:** MarkMaina (Fire Department)
- **Username:** SashaMunene, **Password:** SashaMunene (Police Service)
- **Username:** AliHassan, **Password:** AliHassan (Medical Emergency)

## Setup Instructions

1. Ensure you have a Neon PostgreSQL database set up
2. Add your database URL to the environment variables
3. Run the application - it will automatically initialize the database
4. Alternatively, you can manually run the SQL files in this order:
   - `create-tables.sql`
   - `insert-sample-data.sql`

## Security Notes

⚠️ **Important:** This is a demo application. In a production environment:
- Passwords should be properly hashed using bcrypt or similar
- Implement proper authentication tokens (JWT)
- Add input validation and sanitization
- Use environment variables for sensitive data
- Implement proper error handling and logging
- Add rate limiting and other security measures

## Database Indexes

The following indexes are created for optimal performance:
- `idx_users_username` - For login queries
- `idx_users_user_type` - For filtering by user type
- `idx_emergency_requests_service_type` - For responder dashboards
- `idx_emergency_requests_status` - For filtering by request status
- `idx_emergency_requests_created_at` - For chronological ordering
