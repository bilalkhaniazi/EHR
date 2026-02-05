export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
}
export interface Section {
  id: string;
  course_id: string;
  name: string;
  semester: string;
  start_time: string;
  end_time: string;
  meeting_time: string;
}