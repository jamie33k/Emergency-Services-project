-- Insert the three clients as specified with username as password
INSERT INTO users (name, username, phone, password, role, current_location_lat, current_location_lng) VALUES
('Peter Njiru', 'PeterNjiru', '+254798578853', 'PeterNjiru', 'client', -1.2921, 36.8219),
('Micheal Wekesa', 'MichealWekesa', '+254798578854', 'MichealWekesa', 'client', -1.2864, 36.8172),
('Teejan Amusala', 'TeejanAmusala', '+254798578855', 'TeejanAmusala', 'client', -1.2833, 36.8167);

-- Insert the three emergency responders as specified with username as password
INSERT INTO users (name, username, phone, password, role, service_type, status, current_location_lat, current_location_lng) VALUES
('Mark Maina', 'MarkMaina', '+254700123456', 'MarkMaina', 'responder', 'fire', 'available', -1.2888, 36.8190),
('Sasha Munene', 'SashaMunene', '+254700789012', 'SashaMunene', 'responder', 'police', 'available', -1.2901, 36.8201),
('Ali Hassan', 'AliHassan', '+254700345678', 'AliHassan', 'responder', 'medical', 'available', -1.2875, 36.8185);

-- Insert emergency contacts
INSERT INTO emergency_contacts (name, phone, service_type, location) VALUES
('Nairobi Fire Brigade HQ', '020-2222-181', 'fire', 'City Hall Way, Nairobi'),
('Kenya Police Service', '999', 'police', 'Vigilance House, Nairobi'),
('Nairobi Hospital Emergency', '+254-20-2845000', 'medical', 'Argwings Kodhek Road'),
('Kenyatta National Hospital', '+254-20-2726300', 'medical', 'Hospital Road, Nairobi'),
('St. John Ambulance', '+254-20-2210000', 'medical', 'St. John Gate, Nairobi');
