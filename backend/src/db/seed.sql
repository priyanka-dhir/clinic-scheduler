USE clinic_db;

INSERT IGNORE INTO users (username, password_hash, role, email) VALUES
('admin', '$2b$12$Stq65c0mOT8Y4UB3u19jauOEk5MSsAWbRyp4yLkWJ3TNmKiQIVvEu', 'ADMIN', 'admin@example.com'),
('doc1',  '$2b$12$Z3wqnaX/x.BCRI8.OYWbH.QY2ELOnmc1qhHI7nCB5tkRughL5Ll2W', 'PROVIDER', 'doc1@example.com'),
('pat1',  '$2b$12$3pRLCfb0bOyeU7Ml2t3aUOp1d9L5oj7rwORgU0itAP6G1i2GP2zAi', 'PATIENT', 'pat1@example.com'),
('sched1','$2b$12$6IQE77jcHjgiMpSpDb4ngeza2r0U5ByFoLCDXeNS2X8QTS/V1N.AG', 'SCHEDULER', 'sched1@example.com');

INSERT IGNORE INTO providers (user_id, specialty, timezone) VALUES
((SELECT id FROM users WHERE username='doc1'),'Cardiology','UTC');

INSERT IGNORE INTO patients (user_id, dob, gender, insurance_provider) VALUES
((SELECT id FROM users WHERE username='pat1'),'1990-01-01','M','AcmeHealth');

INSERT IGNORE INTO rooms (name, type, capacity) VALUES ('Room A','Exam',1),('Room B','Consult',2);
