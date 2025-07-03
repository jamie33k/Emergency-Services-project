-- Insert demo client users
INSERT INTO users (username, password, name, email, phone, user_type) VALUES
('JohnDoe', 'JohnDoe', 'John Doe', 'john.doe@example.com', '+254-700-111222', 'client'),
('JaneSmith', 'JaneSmith', 'Jane Smith', 'jane.smith@example.com', '+254-700-333444', 'client'),
('MikeJohnson', 'MikeJohnson', 'Mike Johnson', 'mike.johnson@example.com', '+254-700-555666', 'client')
ON CONFLICT (username) DO NOTHING;

-- Insert demo responder users
INSERT INTO users (username, password, name, email, phone, user_type, service_type) VALUES
('MarkMaina', 'MarkMaina', 'Mark Maina', 'mark.maina@fire.gov.ke', '+254-700-123456', 'responder', 'fire'),
('SashaMunene', 'SashaMunene', 'Sasha Munene', 'sasha.munene@police.gov.ke', '+254-700-789012', 'responder', 'police'),
('AliHassan', 'AliHassan', 'Ali Hassan', 'ali.hassan@health.gov.ke', '+254-700-345678', 'responder', 'medical')
ON CONFLICT (username) DO NOTHING;

-- Insert sample emergency requests for testing
INSERT INTO emergency_requests (
    client_id, client_name, client_phone, service_type,
    location_lat, location_lng, location_address,
    description, priority, status
) VALUES
(
    (SELECT id FROM users WHERE username = 'JohnDoe' LIMIT 1),
    'John Doe', '+254-700-111222', 'fire',
    -1.2921, 36.8219, 'Nairobi CBD, Kenya',
    'Kitchen fire in apartment building, smoke visible from outside',
    'high', 'pending'
),
(
    (SELECT id FROM users WHERE username = 'JaneSmith' LIMIT 1),
    'Jane Smith', '+254-700-333444', 'medical',
    -1.2841, 36.8155, 'Westlands, Nairobi',
    'Elderly person collapsed, unconscious but breathing',
    'critical', 'pending'
),
(
    (SELECT id FROM users WHERE username = 'MikeJohnson' LIMIT 1),
    'Mike Johnson', '+254-700-555666', 'police',
    -1.3021, 36.8319, 'Karen, Nairobi',
    'Break-in attempt, suspect still on premises',
    'high', 'pending'
);
