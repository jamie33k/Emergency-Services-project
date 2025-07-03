-- Sample data for Huduma Emergency Services
-- Insert demo users and emergency contacts

-- Insert demo users (password is same as username for simplicity)
INSERT INTO users (username, phone, email, password_hash, role, service_type) VALUES
-- Clients
('PeterNjiru', '+254798578853', 'peter.njiru@example.com', 'PeterNjiru', 'client', NULL),
('MichealWekesa', '+254798578854', 'micheal.wekesa@example.com', 'MichealWekesa', 'client', NULL),
('TeejanAmusala', '+254798578855', 'teejan.amusala@example.com', 'TeejanAmusala', 'client', NULL),

-- Emergency Responders
('MarkMaina', '+254700123456', 'mark.maina@fire.gov.ke', 'MarkMaina', 'responder', 'fire'),
('SashaMunene', '+254700789012', 'sasha.munene@police.gov.ke', 'SashaMunene', 'responder', 'police'),
('AliHassan', '+254700345678', 'ali.hassan@health.gov.ke', 'AliHassan', 'responder', 'medical')

ON CONFLICT (username) DO NOTHING;

-- Insert emergency contacts for Nairobi
INSERT INTO emergency_contacts (service_type, name, phone, location) VALUES
-- Medical Services
('medical', 'Nairobi Hospital Emergency', '+254-20-2845000', 'Upper Hill, Nairobi'),
('medical', 'Kenyatta National Hospital Emergency', '+254-20-2726300', 'Hospital Road, Nairobi'),
('medical', 'Aga Khan Hospital Emergency', '+254-20-3662000', 'Third Parklands Avenue, Nairobi'),
('medical', 'St. Francis Community Hospital', '+254-20-2717000', 'Kasarani, Nairobi'),

-- Fire Services
('fire', 'Nairobi Fire Station - Central', '+254-20-222181', 'City Hall Way, Nairobi CBD'),
('fire', 'Nairobi Fire Station - Industrial Area', '+254-20-558899', 'Industrial Area, Nairobi'),
('fire', 'Nairobi Fire Station - Westlands', '+254-20-4440000', 'Westlands, Nairobi'),

-- Police Services
('police', 'Central Police Station', '+254-20-222222', 'University Way, Nairobi CBD'),
('police', 'Kilimani Police Station', '+254-20-2710000', 'Kilimani, Nairobi'),
('police', 'Kasarani Police Station', '+254-20-8000000', 'Kasarani, Nairobi'),
('police', 'Langata Police Station', '+254-20-891000', 'Langata, Nairobi')

ON CONFLICT DO NOTHING;

-- Insert a sample emergency request for testing
INSERT INTO emergency_requests (
    user_id, 
    service_type, 
    description, 
    location, 
    latitude, 
    longitude, 
    status, 
    priority
) 
SELECT 
    u.id,
    'medical',
    'Chest pain and difficulty breathing. Patient is conscious but in distress.',
    'Nairobi CBD, near Kencom House',
    -1.2921,
    36.8219,
    'pending',
    'high'
FROM users u 
WHERE u.username = 'PeterNjiru'
AND NOT EXISTS (
    SELECT 1 FROM emergency_requests er 
    WHERE er.user_id = u.id 
    AND er.description LIKE '%Chest pain%'
);
