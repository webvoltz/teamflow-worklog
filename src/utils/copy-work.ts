import dayjs from 'dayjs';
import {
  type IndividualSchedule,
  type OperationName,
  type SingleTask,
} from '../types/schdeule.type';
import { capitalizeFirstLetter } from './common-functions';
import { calculateTaskTotalHours } from './date-time-calculation';
import { notify } from './notify';

const formattedDate = dayjs().format('DD-MM-YYYY'); // Use current date or format as needed

export const CopyClipboard = (formattedPlan: string) => {
  // Copying to clipboard
  navigator.clipboard
    .writeText(formattedPlan)
    .then(() => {
      notify.open('Work Plan copied to clipboard');
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      notify.error(`Failed to copy text: ${message}`);
    });
};

const NestedWorkPlan = (projectData: SingleTask[]) => {
  return `
${projectData
  .map((project) =>
    `
Project Name: ${capitalizeFirstLetter(project.projectName ?? '')} (${String(calculateTaskTotalHours(project.taskDetail))}h)
---------------------------------
${project.taskDetail.map((task) => `- ${task.description} (${String(task.hours)}h)`).join('\n')}
`.trim(),
  )
  .join('\n---------------------------------\n')}
`;
};

export const CopySingleWork = (workAction: string, projectData: SingleTask) => {
  const formattedPlan = `
Work ${workAction} : ${formattedDate}
=============================
Project Name: ${capitalizeFirstLetter(projectData.projectName ?? '')} (${String(calculateTaskTotalHours(projectData.taskDetail))}h)
---------------------------------
${projectData.taskDetail.map((task) => `- ${task.description} (${String(task.hours)}h)`).join('\n')}
`.trim();
  CopyClipboard(formattedPlan);
};

export const CopyAllWork = (workAction: OperationName, workData: IndividualSchedule) => {
  const projectData = workData[workAction].projectDetail;
  const tomorrowPlanSection =
    workAction === 'update' && workData.tomorrow.projectDetail.length > 0
      ? `\n=============================
Tomorrow's Plan:
---------------------------------
${NestedWorkPlan(workData.tomorrow.projectDetail)}
        `
      : '';
  const clipboardData = `
Work ${workAction} : ${formattedDate}
=============================
${NestedWorkPlan(projectData)}
${tomorrowPlanSection}
`;
  CopyClipboard(clipboardData);
};
