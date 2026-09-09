import { notification } from 'antd';
import { type SingleTask, type SingleTaskDetail } from '../types/schdeule.type';

export const vaildateSchedule = (workSchedule: SingleTask[], isShowMessage?: boolean) => {
  const changeField = workSchedule[workSchedule.length - 1];
  if (!changeField) {
    return false;
  }
  if (changeField.projectName === '') {
    if (!isShowMessage) {
      notification.error({ message: 'Project Name should not be empty' });
    }
    return false;
  }
  if (!validateTaskDetail(changeField.taskDetail)) {
    if (!isShowMessage) {
      notification.error({ message: 'Task description and task type should not be empty' });
    }
    return false;
  }
  return true;
};

export const validateTaskDetail = (taskDetails: SingleTaskDetail[]) => {
  return taskDetails.every((task) => task.description !== '' && task.taskType !== '');
};

export const capitalizeFirstLetter = (value: string) => {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getHoursProgressInfo = (totalHours: number) => {
  const maxHours = 9;
  const progressPercentage = Math.min((totalHours / maxHours) * 100, 200);
  const color = totalHours <= maxHours ? 'green' : '#ce0800';
  return { color, progressPercentage, maxHours };
};
