-- Insert default roles
INSERT IGNORE INTO roles (id, name, description) VALUES 
(1, 'SYSTEM_ADMIN', 'System Administrator'),
(2, 'LECTURER', 'Lecturer'),
(3, 'HOD', 'Head of Department'),
(4, 'ACADEMIC_AFFAIRS', 'Academic Affairs'),
(5, 'PRINCIPAL', 'Principal'),
(6, 'STUDENT', 'Student');

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (id, username, email, password, full_name, active, created_at, updated_at) VALUES 
(1, 'admin', 'admin@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', true, NOW(), NOW());

-- Assign admin role
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Insert sample PLOs
INSERT IGNORE INTO plos (id, code, description, program, category) VALUES 
(1, 'PLO1', 'Apply knowledge of mathematics, science, and engineering', 'Computer Science', 'Knowledge'),
(2, 'PLO2', 'Design and conduct experiments, analyze and interpret data', 'Computer Science', 'Skills'),
(3, 'PLO3', 'Design systems, components, or processes to meet desired needs', 'Computer Science', 'Skills'),
(4, 'PLO4', 'Function on multidisciplinary teams', 'Computer Science', 'Teamwork'),
(5, 'PLO5', 'Identify, formulate, and solve engineering problems', 'Computer Science', 'Problem Solving');