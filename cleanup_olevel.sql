-- Removes the O-level JAMB sample subjects seeded earlier via seed_subjects.py.
-- Safe to run even if some rows don't exist (DELETE just matches 0 rows).
-- Order matters: children before parents, to satisfy foreign keys.

DELETE FROM study_sessions WHERE subject_id IN (
  SELECT id FROM subjects WHERE name IN ('Mathematics', 'Physics', 'Chemistry', 'English')
);
DELETE FROM topic_prerequisites WHERE topic_id IN (
  SELECT id FROM topics WHERE subject_id IN (
    SELECT id FROM subjects WHERE name IN ('Mathematics', 'Physics', 'Chemistry', 'English')
  )
);
DELETE FROM topics WHERE subject_id IN (
  SELECT id FROM subjects WHERE name IN ('Mathematics', 'Physics', 'Chemistry', 'English')
);
DELETE FROM subjects WHERE name IN ('Mathematics', 'Physics', 'Chemistry', 'English');
