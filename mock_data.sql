-- BẢN CẬP NHẬT MOCK DATA ĐẦY ĐỦ (DÙNG CHO SQL EDITOR)
-- Chạy toàn bộ file này để reset/update các tài khoản test

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    -- Mật khẩu: 123456
    pass TEXT := '123456';
    hashed_pass TEXT := crypt('123456', gen_salt('bf'));
    
    -- Danh sách email và role tương ứng
    users_to_create RECORD;
BEGIN
    -- Tạo một bảng tạm để lặp qua danh sách users
    CREATE TEMP TABLE temp_users (
        email TEXT,
        full_name TEXT,
        role user_role
    ) ON COMMIT DROP;

    INSERT INTO temp_users VALUES 
    ('admin@hcmut.edu.vn', 'Hệ Thống Admin', 'admin'),
    ('operator@hcmut.edu.vn', 'Nhân Viên Vận Hành', 'operator'),
    ('sinhvien@hcmut.edu.vn', 'Nguyễn Văn A (Sinh Viên)', 'student'),
    ('giangvien@hcmut.edu.vn', 'Lê Thị B (Giảng Viên)', 'faculty'),
    ('canbo@hcmut.edu.vn', 'Trần Văn C (Cán Bộ)', 'staff'),
    ('guest@gmail.com', 'Khách Vãng Lai', 'visitor');

    FOR users_to_create IN SELECT * FROM temp_users LOOP
        DECLARE
            new_user_id UUID := gen_random_uuid();
        BEGIN
            -- 1. Xử lý bảng auth.users
            IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = users_to_create.email) THEN
                INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
                VALUES (
                    new_user_id, 
                    users_to_create.email, 
                    hashed_pass, 
                    now(), 
                    '{"provider":"email","providers":["email"]}', 
                    jsonb_build_object('full_name', users_to_create.full_name), 
                    now(), 
                    now(), 
                    'authenticated', 
                    'authenticated', 
                    ''
                ) RETURNING id INTO new_user_id;
            ELSE
                SELECT id INTO new_user_id FROM auth.users WHERE email = users_to_create.email;
                UPDATE auth.users 
                SET encrypted_password = hashed_pass, 
                    updated_at = now(),
                    raw_user_meta_data = jsonb_build_object('full_name', users_to_create.full_name)
                WHERE id = new_user_id;
            END IF;

            -- 2. Xử lý bảng public.profiles
            INSERT INTO public.profiles (id, email, full_name, role)
            VALUES (new_user_id, users_to_create.email, users_to_create.full_name, users_to_create.role)
            ON CONFLICT (id) DO UPDATE 
            SET role = users_to_create.role, 
                full_name = users_to_create.full_name,
                email = users_to_create.email;
        END;
    END LOOP;
END $$;

-- THÊM DỮ LIỆU BÃI XE (PARKING SLOTS)
INSERT INTO public.parking_slots (slot_number, is_occupied, zone)
VALUES 
('A-01', false, 'Khu A - Tòa A1'),
('A-02', true, 'Khu A - Tòa A1'),
('A-03', false, 'Khu A - Tòa A2'),
('B-01', true, 'Khu B - Ký túc xá'),
('B-02', false, 'Khu B - Ký túc xá'),
('C-01', false, 'Khu C - Thư viện')
ON CONFLICT (slot_number) DO NOTHING;
