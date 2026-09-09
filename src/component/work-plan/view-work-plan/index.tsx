import { Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { OperationName, SingleTask, WorkPlanStatus } from "../../../types/schdeule.type";
import { capitalizeFirstLetter } from "../../../utils/common-functions";
import { CopySingleWork } from "../../../utils/copy-work";
import { calculateTaskTotalHours } from "../../../utils/date-time-calculation";
import { TomorrowPlan } from "./tomorrow-plan";

const STATUS_COLOR: Record<WorkPlanStatus, string> = {
    pending: "gold",
    approved: "green",
    rejected: "red",
};

type ViewScheduleProps = {
    operationName: OperationName;
    viewMode?: string;
    taskData?: SingleTask[];
};

const ViewSchedule = ({ operationName, viewMode, taskData }: ViewScheduleProps) => {
    const { data: employeeWorkPlan } = useSelector((state: RootState) => state.employeeWorkPlan);

    const [viewData, setViewData] = useState<SingleTask[]>([]);
    const [tomorrowPlanView, setTomorrowPlanView] = useState<SingleTask[]>([]);
    useEffect(() => {
        if (viewMode) {
            taskData && setViewData(taskData);
            // taskData && setTomorrowPlanView(taskData)
        } else {
            if (employeeWorkPlan) {
                setViewData(employeeWorkPlan?.[operationName]?.projectDetail || []);
            }
            if (operationName === "update") {
                setTomorrowPlanView(employeeWorkPlan?.tomorrow?.projectDetail || []);
            }
        }
    }, [employeeWorkPlan]);

    return (
        <>
            {viewData.map((item) => (
                <div
                    className="border-[#D0D5DD] border-2 rounded-lg px-3 py-3 mb-4 timesheet-card"
                    key={item.projectId}
                >
                    <h2 className="text-sm font-bold flex justify-start gap-2">
                        {capitalizeFirstLetter(item.projectName ? item.projectName : item.name!)} (
                        {calculateTaskTotalHours(item.taskDetail)}h)
                        <button onClick={() => CopySingleWork("Update", item)}>
                            <FaRegCopy className="mr-2 h-5 w-5 cursor-pointer" />
                        </button>
                    </h2>
                    <ul className="py-4">
                        {item.taskDetail.map((taskData, taskIndex) => (
                            <li className="text-sm" key={`${item.projectId}-${taskIndex}`}>
                                - {taskData.description}{" "}
                                <span className="font-medium text-black">({taskData.hours}h)</span>
                            </li>
                        ))}
                    </ul>
                    {operationName === "update" &&
                        tomorrowPlanView.map(
                            (data, tomorrowIndex) =>
                                data.projectId === item.projectId && (
                                    <TomorrowPlan
                                        tomorrowIndex={tomorrowIndex}
                                        taskDetailData={data}
                                        key={data.projectId}
                                    />
                                )
                        )}
                </div>
            ))}
            {tomorrowPlanView
                .filter((e) => viewData.every((a) => a.projectId !== e.projectId))
                .map(
                    (data, tomorrowIndex) =>
                        data.projectId && (
                            <div
                                className="border-[#D0D5DD] border-2 rounded-lg px-3 py-3 mb-4 timesheet"
                                key={data.projectId}
                            >
                                <TomorrowPlan tomorrowIndex={tomorrowIndex} taskDetailData={data} isOnlyPlan={true} />
                            </div>
                        )
                )}
            {operationName === "update" && !viewMode && (
                <>
                    <p className="update-msg text-sm flex items-center gap-2">
                        Thank you for your submission.
                        {employeeWorkPlan.update?.status && (
                            <Tag color={STATUS_COLOR[employeeWorkPlan.update.status]} className="uppercase">
                                {employeeWorkPlan.update.status}
                            </Tag>
                        )}
                    </p>
                    {employeeWorkPlan.update?.reviewNote && (
                        <p className="update-msg text-sm">Reviewer note: {employeeWorkPlan.update.reviewNote}</p>
                    )}
                    <p className="update-msg text-sm">
                        Submitted:{" "}
                        {employeeWorkPlan[operationName]?.updatedDataAndTime &&
                            dayjs(employeeWorkPlan[operationName].updatedDataAndTime).format("hh:mm A, Do MMMM, YYYY")}
                    </p>
                </>
            )}
        </>
    );
};

export default ViewSchedule;
