-- Insert demo client users
INSERT INTO users (username, password, name, email, phone, user_type) VALUES
('PeterNjiru', 'PeterNjiru', 'Peter Njiru', 'peter.njiru@example.com', '+254798578853', 'client'),
('MichealWekesa', 'MichealWekesa', 'Micheal Wekesa', 'micheal.wekesa@example.com', '+254798578854', 'client'),
('TeejanAmusala', 'TeejanAmusala', 'Teejan Amusala', 'teejan.amusala@example.com', '+254798578855', 'client')
ON CONFLICT (username) DO NOTHING;

-- Insert demo responder users
INSERT INTO users (username, password, name, email, phone, user_type, service_type) VALUES
('MarkMaina', 'MarkMaina', 'Mark Maina', 'mark.maina@fire.gov.ke', '+254700123456', 'responder', 'fire'),
('SashaMunene', 'SashaMunene', 'Sasha Munene', 'sasha.munene@police.gov.ke', '+254700789012', 'responder', 'police'),
('AliHassan', 'AliHassan', 'Ali Hassan', 'ali.hassan@health.gov.ke', '+254700345678', 'responder', 'medical')
ON CONFLICT (username) DO NOTHING;

-- Insert sample emergency requests for testing
INSERT INTO emergency_requests (
    client_id, client_name, client_phone, service_type,
    location_lat, location_lng, location_address,
    description, priority, status
) VALUES
(
    (SELECT id FROM users WHERE username = 'PeterNjiru' LIMIT 1),
    'Peter Njiru', '+254798578853', 'fire',
    -1.2921, 36.8219, 'Nairobi CBD, Kenya',
    'Kitchen fire in apartment building, smoke visible from outside',
    'high', 'pending'
),
(
    (SELECT id FROM users WHERE username = 'MichealWekesa' LIMIT 1),
    'Micheal Wekesa', '+254798578854', 'medical',
    -1.2841, 36.8155, 'Westlands, Nairobi',
    'Elderly person collapsed, unconscious but breathing',
    'critical', 'pending'
),
(
    (SELECT id FROM users WHERE username = 'TeejanAmusala' LIMIT 1),
    'Teejan Amusala', '+254798578855', 'police',
    -1.3021, 36.8319, 'Karen, Nairobi',
    'Break-in attempt, suspect still on premises',
    'high', 'pending'
);
