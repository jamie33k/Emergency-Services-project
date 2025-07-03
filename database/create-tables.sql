-- Huduma Emergency Services Database Schema
-- PostgreSQL Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for both clients and emergency responders
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'responder')),
    service_type VARCHAR(20) CHECK (service_type IN ('medical', 'fire', 'police')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('medical', 'fire', 'police')),
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_responder_id UUID REFERENCES users(id) ON DELETE SET NULL,
    response_time INTEGER, -- in minutes
    completion_time INTEGER, -- in minutes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts table (for official emergency services)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('medical', 'fire', 'police')),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Request status history for tracking
CREATE TABLE IF NOT EXISTS request_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_user_id ON emergency_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_service_type ON emergency_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_created_at ON emergency_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_assigned_responder ON emergency_requests(assigned_responder_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_requests_updated_at BEFORE UPDATE ON emergency_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO request_status_history (request_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.assigned_responder_id);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply status change logging trigger
CREATE TRIGGER log_emergency_request_status_change 
    AFTER UPDATE ON emergency_requests
    FOR EACH ROW EXECUTE FUNCTION log_status_change();
