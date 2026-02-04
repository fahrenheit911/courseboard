-- STUDENTS
create policy "Allow all access to students"
on students
for all
using (true)
with check (true);

-- COURSES
create policy "Allow all access to courses"
on courses
for all
using (true)
with check (true);

-- COURSE_STUDENTS
create policy "Allow all access to course_students"
on course_students
for all
using (true)
with check (true);
