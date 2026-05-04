import { useState, useEffect } from 'react';
import { UserProgress, UserProfile, Course } from './types';
import { saveUserProgress, getUserProgress } from './services/courseService';

const INITIAL_PROGRESS: UserProgress & { pendingTasks: string[] } = {
  points: 0,
  completedLessons: [],
  currentGoal: 500,
  customCourses: [],
  pendingTasks: [],
};

export function useProgress(userId?: string) {
  const [progress, setProgress] = useState<(UserProgress & { pendingTasks: string[] })>(() => {
    const saved = localStorage.getItem('pm-ai-bytes-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_PROGRESS,
        ...parsed,
        completedLessons: parsed.completedLessons || parsed.completedBytes || [],
        customCourses: parsed.customCourses || [],
        pendingTasks: [], // Reset pending tasks on reload
      };
    }
    return INITIAL_PROGRESS;
  });

  // Sync with Cloud on user change
  useEffect(() => {
    if (userId) {
      getUserProgress(userId).then(cloudProgress => {
        if (cloudProgress) {
          setProgress(prev => ({
            ...prev,
            ...cloudProgress,
            // Merge custom courses if needed, but cloud ones usually preferred in Dashboard
            customCourses: [...prev.customCourses, ...(cloudProgress.customCourses || [])].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
          }));
        }
      });
    }
  }, [userId]);

  // Save to LocalStorage and Cloud
  useEffect(() => {
    const { pendingTasks, ...saveData } = progress;
    localStorage.setItem('pm-ai-bytes-progress', JSON.stringify(saveData));
    
    if (userId) {
      // Don't save pending tasks to cloud, they are transient
      saveUserProgress(userId, saveData);
    }
  }, [progress, userId]);

  const addPoints = (amount: number) => {
    setProgress(prev => ({
      ...prev,
      points: prev.points + amount
    }));
  };

  const completeLesson = (lessonId: string, points: number) => {
    if (!progress.completedLessons.includes(lessonId)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        points: prev.points + points
      }));
      return true;
    }
    return false;
  };

  const setProfile = (profile: UserProfile) => {
    setProgress(prev => ({
      ...prev,
      profile
    }));
  };

  const addCustomCourse = (course: Course) => {
    setProgress(prev => ({
      ...prev,
      customCourses: [...prev.customCourses, course],
      pendingTasks: prev.pendingTasks.filter(t => t !== course.title)
    }));
  };

  const addPendingTask = (title: string) => {
    setProgress(prev => ({
      ...prev,
      pendingTasks: [...prev.pendingTasks, title]
    }));
  };

  const removePendingTask = (title: string) => {
    setProgress(prev => ({
      ...prev,
      pendingTasks: prev.pendingTasks.filter(t => t !== title)
    }));
  };

  return { progress, addPoints, completeLesson, setProfile, addCustomCourse, addPendingTask, removePendingTask };
}
