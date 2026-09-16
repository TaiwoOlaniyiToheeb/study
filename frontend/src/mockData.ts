import { StudySchedule, SubjectSummary } from "./types";

// Purely for local/demo viewing in the browser without a live backend.
// None of this is wired into the real API calls — StudyScheduleWizard and
// StudyScheduleDashboardPage still talk to the real /api/* endpoints (via
// the Vite dev-server proxy) once you run the FastAPI backend.

export const mockSubjects: SubjectSummary[] = [
  { subject_id: "11111111-1111-1111-1111-111111111111", name: "Mathematics", performance_percent: 45, completed_topics: 3, incomplete_topics: 3 },
  { subject_id: "22222222-2222-2222-2222-222222222222", name: "Physics", performance_percent: 62, completed_topics: 4, incomplete_topics: 2 },
  { subject_id: "33333333-3333-3333-3333-333333333333", name: "Chemistry", performance_percent: 78, completed_topics: 5, incomplete_topics: 1 },
  { subject_id: "44444444-4444-4444-4444-444444444444", name: "English", performance_percent: 82, completed_topics: 6, incomplete_topics: 1 },
];

function isoDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export const mockSchedule: StudySchedule = {
  id: "demo-schedule",
  student_id: "demo-student",
  status: "draft",
  exam_date: isoDate(75),
  generated_at: new Date().toISOString(),
  overall_reasoning:
    "Mathematics received more study sessions because your recent assessment performance indicates " +
    "it needs additional attention. Evening sessions were prioritized because you selected evening as " +
    "your preferred study period.",
  unscheduled: [
    {
      subject_id: "22222222-2222-2222-2222-222222222222",
      topic_id: "physics-momentum",
      activity_type: "practice",
      estimated_minutes: 60,
      reason_could_not_schedule:
        "No available slot (respecting availability, daily session limit, and break spacing) " +
        "between target date and exam date.",
    },
  ],
  sessions: [
    {
      id: "s1", subject_id: "11111111-1111-1111-1111-111111111111", subject_name: "Mathematics",
      topic_id: "quad-eq", topic_name: "Quadratic Equations", activity_type: "learning",
      scheduled_date: isoDate(0), start_time: "17:00", end_time: "18:00", duration_minutes: 60,
      status: "scheduled", priority: 5,
      reason: "Prerequisite-valid next topic; low recent assessment performance.",
    },
    {
      id: "s2", subject_id: "22222222-2222-2222-2222-222222222222", subject_name: "Physics",
      topic_id: "motion", topic_name: "Motion", activity_type: "learning",
      scheduled_date: isoDate(0), start_time: "18:15", end_time: "19:15", duration_minutes: 60,
      status: "scheduled", priority: 4,
      reason: "Evening sessions were prioritized because you selected evening as your preferred period.",
    },
    {
      id: "s3", subject_id: "11111111-1111-1111-1111-111111111111", subject_name: "Mathematics",
      topic_id: "quad-eq", topic_name: "Quadratic Equations", activity_type: "practice",
      scheduled_date: isoDate(1), start_time: "16:00", end_time: "17:00", duration_minutes: 60,
      status: "scheduled", priority: 5,
      reason: "Spaced repetition: practice pass following initial learning.",
    },
    {
      id: "s4", subject_id: "33333333-3333-3333-3333-333333333333", subject_name: "Chemistry",
      topic_id: "bonding", topic_name: "Chemical Bonding", activity_type: "revision",
      scheduled_date: isoDate(1), start_time: "17:15", end_time: "18:15", duration_minutes: 60,
      status: "scheduled", priority: 3,
      reason: "Good recent performance — a single revision pass is enough.",
    },
    {
      id: "s5", subject_id: "11111111-1111-1111-1111-111111111111", subject_name: "Mathematics",
      topic_id: "quad-eq", topic_name: "Quadratic Equations", activity_type: "revision",
      scheduled_date: isoDate(5), start_time: "10:00", end_time: "11:00", duration_minutes: 60,
      status: "scheduled", priority: 5,
      reason: "Low score reinforcement — earlier revision than the standard interval.",
    },
    {
      id: "s6", subject_id: "22222222-2222-2222-2222-222222222222", subject_name: "Physics",
      topic_id: "motion", topic_name: "Motion", activity_type: "practice",
      scheduled_date: isoDate(5), start_time: "11:15", end_time: "12:15", duration_minutes: 60,
      status: "scheduled", priority: 4, reason: "Spaced repetition practice pass.",
    },
    {
      id: "s7", subject_id: "11111111-1111-1111-1111-111111111111", subject_name: "Mathematics",
      topic_id: "quad-eq", topic_name: "Quadratic Equations", activity_type: "assessment",
      scheduled_date: isoDate(6), start_time: "16:00", end_time: "17:00", duration_minutes: 60,
      status: "scheduled", priority: 5, reason: "Topic-level assessment to confirm mastery.",
    },
    {
      id: "s8", subject_id: "44444444-4444-4444-4444-444444444444", subject_name: "English",
      topic_id: "comprehension", topic_name: "Comprehension", activity_type: "learning",
      scheduled_date: isoDate(2), start_time: "16:00", end_time: "17:00", duration_minutes: 60,
      status: "completed", priority: 2, reason: "Regular rotation to keep all subjects moving.",
    },
  ],
};
