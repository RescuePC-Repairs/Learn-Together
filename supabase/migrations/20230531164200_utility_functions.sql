-- Create extension if not exists function
CREATE OR REPLACE FUNCTION public.create_extension_if_not_exists(extension_name text)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = extension_name
  ) THEN
    EXECUTE format('CREATE EXTENSION IF NOT EXISTS %I', extension_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create table if not exists function
CREATE OR REPLACE FUNCTION public.create_table_if_not_exists(
  table_name text,
  table_definition text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  ) THEN
    EXECUTE format('CREATE TABLE public.%I (%s)', $1, $2);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create index if not exists function
CREATE OR REPLACE FUNCTION public.create_index_if_not_exists(
  index_name text,
  table_name text,
  columns text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = $1 
    AND tablename = $2
  ) THEN
    EXECUTE format('CREATE INDEX %I ON %I (%s)', $1, $2, $3);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create policy if not exists function
CREATE OR REPLACE FUNCTION public.create_policy_if_not_exists(
  policy_name text,
  table_name text,
  using_expression text,
  with_check text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = $1 
    AND tablename = $2
  ) THEN
    IF with_check IS NULL THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I FOR ALL USING (%s) WITH CHECK (true)',
        $1, $2, $3
      );
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON %I FOR ALL USING (%s) WITH CHECK (%s)',
        $1, $2, $3, $4
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;
