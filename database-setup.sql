-- ===============================
-- 1. DROP EXISTING TABLES
-- ===============================
DROP TABLE IF EXISTS public.items CASCADE;
DROP TABLE IF EXISTS public.box_members CASCADE;
DROP TABLE IF EXISTS public.boxes CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ===============================
-- 2. CREATE TABLES
-- ===============================

-- BOXES
CREATE TABLE public.boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- BOX MEMBERS (many-to-many)
CREATE TABLE public.box_members (
  box_id uuid NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (box_id, user_id)
);

-- ITEMS (belongs to a box)
CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  box_id uuid NOT NULL REFERENCES public.boxes(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- USER PROFILES (optional extra info)
CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- ===============================
-- 3. ENABLE RLS
-- ===============================
ALTER TABLE public.boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- ===============================
-- 4. RLS POLICIES
-- ===============================

-- BOXES
CREATE POLICY "Box owners full access"
ON public.boxes
USING (auth.uid() = owner_id);

CREATE POLICY "Members can read shared boxes"
ON public.boxes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.box_members
    WHERE box_members.box_id = boxes.id
    AND box_members.user_id = auth.uid()
  )
);

-- BOX MEMBERS
CREATE POLICY "Owners manage members"
ON public.box_members
USING (
  EXISTS (
    SELECT 1 FROM public.boxes
    WHERE boxes.id = box_members.box_id
    AND boxes.owner_id = auth.uid()
  )
);

CREATE POLICY "Members can view members"
ON public.box_members
FOR SELECT
USING (
  box_members.user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.boxes
    WHERE boxes.id = box_members.box_id
    AND boxes.owner_id = auth.uid()
  )
);

-- ITEMS
CREATE POLICY "Owners and editors can manage items"
ON public.items
USING (
  EXISTS (
    SELECT 1 FROM public.box_members
    WHERE box_members.box_id = items.box_id
    AND box_members.user_id = auth.uid()
    AND box_members.role IN ('owner', 'editor')
  )
);

CREATE POLICY "All members can view items"
ON public.items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.box_members
    WHERE box_members.box_id = items.box_id
    AND box_members.user_id = auth.uid()
  )
);

-- ===============================
-- 5. TRIGGER: AUTO-ADD OWNER AS MEMBER
-- ===============================
CREATE OR REPLACE FUNCTION public.add_owner_to_members()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.box_members (box_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_add_owner_to_members
AFTER INSERT ON public.boxes
FOR EACH ROW
EXECUTE FUNCTION public.add_owner_to_members();
