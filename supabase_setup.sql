-- MASTER SETUP & MOCK DATA (HCMUT Smart Parking)
-- Bản này được thiết kế để chạy mượt mà ngay cả khi database đang có lỗi schema

-- 1. Khởi tạo Type (Kiểm tra tránh lỗi)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'student', 'graduate', 'doctoral', 'faculty', 
            'staff', 'visitor', 'operator', 'admin'
        );
    END IF;
END $$;

-- 2. Tạo bảng Profiles sạch sẽ
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'visitor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Phân quyền RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all" ON public.profiles;
CREATE POLICY "Enable read access for all" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable individual update" ON public.profiles;
CREATE POLICY "Enable individual update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Trigger tự động tạo Profile (Sửa lỗi Idempotent)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',
        CASE WHEN NEW.email LIKE '%@hcmut.edu.vn' THEN 'student' ELSE 'visitor' END
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. KHỞI TẠO MOCK DATA CHI TIẾT
-- Dùng Password hash cố định cho "123456"
-- Tài khoản 1: ADMIN (admin@hcmut.edu.vn)
WITH new_admin AS (
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@hcmut.edu.vn', '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hệ Thống Admin"}', now(), now(), '')
    ON CONFLICT (email) DO UPDATE SET encrypted_password = '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W'
    RETURNING id, email
)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Hệ Thống Admin', 'admin' FROM new_admin
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Tài khoản 2: OPERATOR (operator@hcmut.edu.vn)
WITH new_op AS (
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'operator@hcmut.edu.vn', '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nhân Viên Vận Hành"}', now(), now(), '')
    ON CONFLICT (email) DO UPDATE SET encrypted_password = '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W'
    RETURNING id, email
)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Nhân Viên Vận Hành', 'operator' FROM new_op
ON CONFLICT (id) DO UPDATE SET role = 'operator';

-- Tài khoản 3: SINH VIÊN (sinhvien@hcmut.edu.vn)
WITH new_sv AS (
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sinhvien@hcmut.edu.vn', '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Sinh Viên"}', now(), now(), '')
    ON CONFLICT (email) DO UPDATE SET encrypted_password = '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W'
    RETURNING id, email
)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Nguyễn Sinh Viên', 'student' FROM new_sv
ON CONFLICT (id) DO UPDATE SET role = 'student';

-- 5. BÃI ĐỖ XE
CREATE TABLE IF NOT EXISTS public.parking_slots (
    id SERIAL PRIMARY KEY,
    slot_number TEXT UNIQUE NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    zone TEXT,
    updated_by UUID REFERENCES public.profiles(id)
);
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public viewable" ON public.parking_slots;
CREATE POLICY "Public viewable" ON public.parking_slots FOR SELECT USING (true);

INSERT INTO public.parking_slots (slot_number, is_occupied, zone)
VALUES 
('A-01', false, 'Khu A'), ('A-02', true, 'Khu A'), ('B-01', false, 'Khu B')
ON CONFLICT (slot_number) DO NOTHING;
