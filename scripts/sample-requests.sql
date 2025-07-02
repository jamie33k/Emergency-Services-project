-- Insert sample emergency requests
INSERT INTO emergency_requests (
    client_id, client_name, client_phone, service_type, 
    location_lat, location_lng, location_address, description, 
    status, priority, responder_id, responder_name, responder_phone,
    estimated_arrival
) VALUES
(
    (SELECT id FROM users WHERE username = 'PeterNjiru'),
    'Peter Njiru', '+254798578853', 'medical',
    -1.2921, 36.8219, 'Westlands, Nairobi', 
    'Chest pain and difficulty breathing', 
    'active', 'high',
    (SELECT id FROM users WHERE username = 'AliHassan'),
    'Ali Hassan', '+254700345678',
    '8 minutes'
),
(
    (SELECT id FROM users WHERE username = 'MichealWekesa'),
    'Micheal Wekesa', '+254798578854', 'fire',
    -1.2864, 36.8172, 'Karen, Nairobi',
    'Kitchen fire in apartment building',
    'pending', 'critical',
    NULL, NULL, NULL, NULL
),
(
    (SELECT id FROM users WHERE username = 'TeejanAmusala'),
    'Teejan Amusala', '+254798578855', 'police',
    -1.2833, 36.8167, 'CBD, Nairobi',
    'Suspicious activity and possible break-in',
    'pending', 'medium',
    NULL, NULL, NULL, NULL
);
