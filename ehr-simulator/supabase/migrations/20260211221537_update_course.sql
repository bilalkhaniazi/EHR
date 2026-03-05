ALTER table courses DROP COLUMN start_date;
ALTER table courses DROP COLUMN end_date;
ALTER table courses DROP COLUMN semester;

ALTER TABLE sections ADD COLUMN start_date TIMESTAMPTZ;
ALTER TABLE sections ADD COLUMN end_date TIMESTAMPTZ;
ALTER TABLE sections ADD COLUMN semester TEXT;

