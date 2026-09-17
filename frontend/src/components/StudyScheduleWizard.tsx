  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const existing = await studyScheduleApi.listAvailability();
      const alreadySaved = (p: typeof availability[number]) =>
        existing.some(
          (e) =>
            e.day_of_week === p.day_of_week &&
            e.start_time === p.start_time &&
            e.end_time === p.end_time &&
            e.period_type === p.period_type
        );
      for (const period of availability) {
        if (!alreadySaved(period)) {
          await studyScheduleApi.createAvailability(period);
        }
      }

      await studyScheduleApi.putStudyPreferences({
        exam_goal_type: goal.exam_goal_type,
        exam_goal_other_text: goal.exam_goal_other_text,
        exam_date: goal.exam_date,
        daily_study_minutes_goal: goal.daily_study_minutes_goal,
        preferred_time: preferences.preferred_time,
        session_duration_min: preferences.session_duration_min,
        break_duration_min: preferences.break_duration_min,
        max_sessions_per_day: preferences.max_sessions_per_day,
      });

      const schedule = await studyScheduleApi.generateSchedule(selectedSubjectIds);
      onScheduleGenerated(schedule);
    } catch (e: any) {
      setError(e.message ?? "AI schedule generation is temporarily unavailable. Please try again.");
    } finally {
      setGenerating(false);
    }
  }
