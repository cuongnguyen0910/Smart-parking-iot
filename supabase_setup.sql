-- CLEAN & HARD RESET (HCMUT Smart Parking)
-- Bước này để đưa database về trạng thái ổn định và sửa lỗi 500 Schema

-- 1. Xóa sạch các Trigger gây nhiễu
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Tạo Type và Bảng Profiles (Dạng đơn giản nhất)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'student', 'graduate', 'doctoral', 'faculty', 
            'staff', 'visitor', 'operator', 'admin'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tắt và bật lại RLS với chính sách đơn giản nhất
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select" ON public.profiles;
CREATE POLICY "Public select" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owner update" ON public.profiles;
CREATE POLICY "Owner update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. CHÈN MOCK DATA (Cách an toàn nhất cho Hosted Supabase)
-- Chúng ta dùng ID ngẫu nhiên và KHÔNG can thiệp vào instance_id
DO $$
DECLARE
    admin_id UUID := gen_random_uuid();
    op_id UUID := gen_random_uuid();
    student_id UUID := gen_random_uuid();
    -- Password hash chuẩn của '123456'
    pwd TEXT := '$2a$10$7EqJtq78FeRoPzGuOuuyDe3P/CwH.4065hPMs9EnC94.88o.at02W';
BEGIN
    -- Xóa các email cũ để chèn mới sạch sẽ
    DELETE FROM auth.users WHERE email IN ('admin@hcmut.edu.vn', 'operator@hcmut.edu.vn', 'sinhvien@hcmut.edu.vn');

    -- ADMIN
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (admin_id, 'authenticated', 'authenticated', 'admin@hcmut.edu.vn', pwd, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Hệ Thống"}', now(), now(), '');
    
    INSERT INTO public.profiles (id, email, full_name, role) 
    VALUES (admin_id, 'admin@hcmut.edu.vn', 'Admin Hệ Thống', 'admin');

    -- OPERATOR
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (op_id, 'authenticated', 'authenticated', 'operator@hcmut.edu.vn', pwd, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nhân Viên Vận Hành"}', now(), now(), '');
    
    INSERT INTO public.profiles (id, email, full_name, role) 
    VALUES (op_id, 'operator@hcmut.edu.vn', 'Nhân Viên Vận Hành', 'operator');

    -- SINH VIÊN
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
    VALUES (student_id, 'authenticated', 'authenticated', 'sinhvien@hcmut.edu.vn', pwd, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Sinh Viên"}', now(), now(), '');
    
    INSERT INTO public.profiles (id, email, full_name, role) 
    VALUES (student_id, 'sinhvien@hcmut.edu.vn', 'Nguyễn Sinh Viên', 'student');

END $$;

-- 4. BÃI ĐỖ XE
CREATE TABLE IF NOT EXISTS public.parking_slots (
    id SERIAL PRIMARY KEY,
    slot_number TEXT UNIQUE NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    zone TEXT
);
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "view_slots" ON public.parking_slots;
CREATE POLICY "view_slots" ON public.parking_slots FOR SELECT USING (true);
