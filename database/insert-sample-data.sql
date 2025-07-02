-- Insert sample users with username as password
-- Clients
INSERT INTO users (name, username, phone, password, role, service_type, status) VALUES
('Peter Njiru', 'PeterNjiru', '+254798578853', 'PeterNjiru', 'client', NULL, 'available'),
('Micheal Wekesa', 'MichealWekesa', '+254798578854', 'MichealWekesa', 'client', NULL, 'available'),
('Teejan Amusala', 'TeejanAmusala', '+254798578855', 'TeejanAmusala', 'client', NULL, 'available')
ON CONFLICT (username) DO NOTHING;

-- Emergency Responders
INSERT INTO users (name, username, phone, password, role, service_type, status) VALUES
('Mark Maina', 'MarkMaina', '+254700123456', 'MarkMaina', 'responder', 'fire', 'available'),
('Sasha Munene', 'SashaMunene', '+254700789012', 'SashaMunene', 'responder', 'police', 'available'),
('Ali Hassan', 'AliHassan', '+254700345678', 'AliHassan', 'responder', 'medical', 'available')
ON CONFLICT (username) DO NOTHING;

-- Insert emergency contacts
INSERT INTO emergency_contacts (name, phone, service_type, location, is_active) VALUES
('Nairobi Fire Brigade HQ', '020-2222-181', 'fire', 'City Hall Way, Nairobi', true),
('Kenya Police Service', '999', 'police', 'Vigilance House, Nairobi', true),
('Nairobi Hospital Emergency', '+254-20-2845000', 'medical', 'Argwings Kodhek Road', true),
('Kenyatta National Hospital', '+254-20-2726300', 'medical', 'Hospital Road, Nairobi', true),
('St. John Ambulance', '+254-20-2210000', 'medical', 'St. John Gate, Nairobi', true)
ON CONFLICT DO NOTHING;

-- Insert a sample emergency request
INSERT INTO emergency_requests (
    client_id, client_name, client_phone, service_type, 
    location_lat, location_lng, location_address, description, 
    status, priority, created_at
) VALUES (
    'client-1', 'Peter Njiru', '+254798578853', 'medical',
    -1.2921, 36.8219, 'Westlands, Nairobi', 
    'Sample emergency request for testing', 
    'pending', 'medium', CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;
