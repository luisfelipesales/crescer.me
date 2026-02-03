-- Fix: Restrict assessment_questions to authenticated users only
-- Current policy allows anyone to read: USING (true)
-- New policy requires authentication: USING (auth.uid() IS NOT NULL)

DROP POLICY IF EXISTS "Anyone can view questions" ON assessment_questions;

CREATE POLICY "Authenticated users can view questions" 
ON assessment_questions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Also fix assessment_templates which has similar issue (is_active = true allows public access)
DROP POLICY IF EXISTS "Anyone can view active templates" ON assessment_templates;

CREATE POLICY "Authenticated users can view active templates" 
ON assessment_templates 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

-- Also fix assessment_automation which has USING (true) for SELECT
DROP POLICY IF EXISTS "Anyone can view automation config" ON assessment_automation;

CREATE POLICY "Authenticated users can view automation config" 
ON assessment_automation 
FOR SELECT 
USING (auth.uid() IS NOT NULL);