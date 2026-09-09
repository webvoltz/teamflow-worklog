import { Button, Empty, Input, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamWorkPlans, reviewWorkPlan } from "../../redux/slice/team-approval-slice";
import { AppDispatch, RootState } from "../../store";
import { TeamWorkPlanEntry, WorkPlanStatus } from "../../types/schdeule.type";
import { calculateTaskTotalHours } from "../../utils/date-time-calculation";

const STATUS_COLOR: Record<WorkPlanStatus, string> = {
    pending: "gold",
    approved: "green",
    rejected: "red",
};

const TeamApprovals = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: userData } = useSelector((state: RootState) => state.user);
    const { data: teamWorkPlans, loading, error } = useSelector((state: RootState) => state.teamApproval);
    const [rejectTarget, setRejectTarget] = useState<TeamWorkPlanEntry | null>(null);
    const [rejectNote, setRejectNote] = useState("");

    useEffect(() => {
        if (userData?.viewer) {
            dispatch(fetchTeamWorkPlans({ teamLeaderId: userData.viewer.userId }));
        }
    }, [userData]);

    const handleApprove = (entry: TeamWorkPlanEntry) => {
        dispatch(reviewWorkPlan({ entryId: entry.id, status: "approved" }));
    };

    const handleReject = () => {
        if (!rejectTarget) return;
        dispatch(reviewWorkPlan({ entryId: rejectTarget.id, status: "rejected", note: rejectNote }));
        setRejectTarget(null);
        setRejectNote("");
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto mt-24 px-3">
            <h1 className="text-2xl font-bold mb-6">Team Approvals</h1>
            {!loading && teamWorkPlans.length === 0 && <Empty description="No work updates submitted yet" />}
            {teamWorkPlans.map((entry) => (
                <div key={entry.id} className="border-[#D0D5DD] border-2 rounded-lg px-4 py-4 mb-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                            <h2 className="text-base font-bold">{entry.employeeName}</h2>
                            <p className="text-sm text-[#667085]">{entry.designation}</p>
                        </div>
                        <Tag color={STATUS_COLOR[entry.status]} className="uppercase">
                            {entry.status}
                        </Tag>
                    </div>
                    <ul className="py-3">
                        {entry.projectDetail.map((project) => (
                            <li key={project.projectId} className="text-sm mb-1">
                                <span className="font-semibold">{project.projectName}</span> (
                                {calculateTaskTotalHours(project.taskDetail)}h)
                                <ul>
                                    {project.taskDetail.map((task) => (
                                        <li key={task.description}>
                                            - {task.description} ({task.hours}h)
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    {entry.reviewNote && <p className="text-sm text-[#667085]">Note: {entry.reviewNote}</p>}
                    {entry.status === "pending" && (
                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => setRejectTarget(entry)}>Reject</Button>
                            <Button type="primary" onClick={() => handleApprove(entry)}>
                                Approve
                            </Button>
                        </div>
                    )}
                </div>
            ))}
            <Modal
                title={`Reject ${rejectTarget?.employeeName ?? ""}'s work update`}
                open={rejectTarget !== null}
                onOk={handleReject}
                onCancel={() => setRejectTarget(null)}
                okText="Reject"
            >
                <Input.TextArea
                    placeholder="Optional note for the employee"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default TeamApprovals;
