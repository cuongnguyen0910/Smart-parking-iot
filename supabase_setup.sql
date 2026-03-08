-- MASTER SETUP & MOCK DATA (HCMUT Smart Parking) - FINAL FIXED VERSION
-- Bản này KHÔNG dùng ON CONFLICT để tránh lỗi ràng buộc Unique Index

-- 1. Khởi tạo Type (Sử dụng khối DO an toàn)
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

-- Phân quyền RLS (Cài đặt mở để dễ test)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Access all" ON public.profiles;
CREATE POLICY "Access all" ON public.profiles FOR ALL USING (true);

-- 3. Tạo chức năng tự động đồng bộ Profile khi tạo User
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',
        'visitor'
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. KHỐI KHỞI TẠO USER (Dùng DELETE -> INSERT để tránh lỗi ON CONFLICT)
DO $$
DECLARE
    -- Mật khẩu hash mã hóa cho '123456'
    pwd TEXT := '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W';
    uid UUID;
BEGIN
    -- --- BƯỚC 1: Xóa sạch dữ liệu cũ ---
    DELETE FROM auth.users WHERE email IN ('admin@hcmut.edu.vn', 'operator@hcmut.edu.vn', 'sinhvien@hcmut.edu.vn');

    -- --- BƯỚC 2: Tạo ADMIN (admin@hcmut.edu.vn) ---
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@hcmut.edu.vn', pwd, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hệ Thống Admin"}', now(), now(), '');
    
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (uid, 'admin@hcmut.edu.vn', 'Hệ Thống Admin', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';

    -- --- BƯỚC 3: Tạo OPERATOR (operator@hcmut.edu.vn) ---
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'operator@hcmut.edu.vn', pwd, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nhân Viên Vận Hành"}', now(), now(), '');
    
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (uid, 'operator@hcmut.edu.vn', 'Nhân Viên Vận Hành', 'operator')
    ON CONFLICT (id) DO UPDATE SET role = 'operator';

    -- --- BƯỚC 4: Tạo SINH VIÊN (sinhvien@hcmut.edu.vn) ---
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sinhvien@hcmut.edu.vn', pwd, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Sinh Viên"}', now(), now(), '');
    
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (uid, 'sinhvien@hcmut.edu.vn', 'Nguyễn Sinh Viên', 'student')
    ON CONFLICT (id) DO UPDATE SET role = 'student';

END $$;

-- 5. BÃI ĐỖ XE
CREATE TABLE IF NOT EXISTS public.parking_slots (
    id SERIAL PRIMARY KEY,
    slot_number TEXT UNIQUE NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    zone TEXT,
    updated_by UUID REFERENCES public.profiles(id)
);
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Global View" ON public.parking_slots;
CREATE POLICY "Global View" ON public.parking_slots FOR SELECT USING (true);

INSERT INTO public.parking_slots (slot_number, is_occupied, zone)
VALUES ('A-01', false, 'Khu A'), ('A-02', true, 'Khu A')
ON CONFLICT (slot_number) DO NOTHING;
