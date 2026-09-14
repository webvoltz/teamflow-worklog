import dayjs from 'dayjs';

import { type SingleTask, type SingleTaskDetail, type SliceResponse } from '../types/schdeule.type';

export const convertHoursToFloat = (workSchedule: SingleTask[]) => {
  const updatedWorkSchedule = workSchedule.map((project) => ({
    ...project,
    taskDetail: project.taskDetail.map((task) => ({
      ...task,
      hours: parseFloat(task.hours.toString()),
    })),
  }));
  return updatedWorkSchedule;
};

export const calculateTaskTotalHours = (taskDetails: SingleTaskDetail[]) => {
  return taskDetails.reduce((total, task) => {
    const hours = parseFloat(task.hours.toString());
    return total + (isNaN(hours) ? 0 : hours);
  }, 0);
};

export const calculateProjectTotalHours = (taskDetails: SingleTask[]) => {
  return taskDetails.reduce((total, task) => {
    const hours = parseFloat(calculateTaskTotalHours(task.taskDetail).toString());
    return total + (isNaN(hours) ? 0 : hours);
  }, 0);
};

export const addCalculateWorkScheduleHours = (taskDetails: SingleTask[], isUpdate: boolean) => {
  return taskDetails.map((e) => ({
    projectId: e.projectId,
    projectName: e.projectName,
    taskDetail: e.taskDetail.map((a) => ({
      description: a.description,
      taskType: a.taskType,
      hours: a.hours,
      ...(isUpdate ? { taskStatus: a.taskStatus ?? '' } : {}),
    })),
    totalHours: calculateTaskTotalHours(e.taskDetail),
  }));
};

export const removeTotalHours = (workSchedule: SingleTask[]) => {
  const afterTotalHrsRemove = workSchedule.map((project) => {
    const data = { ...project };
    delete data.totalHours;
    return data;
  });
  return afterTotalHrsRemove;
};

export const compareDate = (workSchedule: SliceResponse) => {
  const scheduleDate =
    workSchedule.projectDetail.length > 0 &&
    dayjs(workSchedule.updatedDataAndTime).format('DD MM YYYY') !== dayjs().format('DD MM YYYY');
  if (workSchedule.projectDetail.length === 0 || scheduleDate) {
    return false;
  }
  return true;
};

export const isTimeDifferenceGreaterThan20Hours = (dateTimeString: string): boolean => {
  const inputTime = dayjs(dateTimeString);
  const currentTime = dayjs();
  const differenceInHours = currentTime.diff(inputTime, 'hour');
  return differenceInHours > 23 || differenceInHours < 0;
};
