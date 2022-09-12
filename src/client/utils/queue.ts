import { createContext } from "react";
import { QueueUtils } from "../types/queue";
import { generateMailto } from "./mailto";
import { QueueSortType } from "../generated/graphql";

export const secondsToText = (seconds: number) => {
    if (seconds > 3600) {
        const hours = Math.round(seconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (seconds > 60) {
        const minutes = Math.round(seconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
        return "a few seconds";
    }
};

export const generateNotificationMailto = (
    recipient: string,
    courseCode: string,
    studentName: string,
    claimerName: string
) => {
    const subject = `[${courseCode}] Queue question help`;
    const mailTemplate = `Hi ${studentName},

You're next in the ${courseCode} queue. You've been invited to this zoom meeting <insert-zoom-link>.
Please join the meeting to get help from your tutor.

Regards,
${claimerName}"`;
    return generateMailto(recipient, subject, mailTemplate);
};

export const pushNotification = (title: string, body: string) => {
    if (!("Notification" in window)) {
        return;
    }
    if (Notification.permission === "granted") {
        return new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                return new Notification(title, { body });
            }
        });
    }
};

export const requestNotification = () => {
    if (!("Notification" in window)) {
        return;
    }
    Notification.requestPermission();
};

export const QueueContext = createContext<QueueUtils>({
    updateQuestionStatus: () => {},
    setSelectedQuestion: () => {},
    openClaimModal: () => {},
    courseCode: "",
});

const TIME_SORT_EXPLANATION =
    "This sort strategy is first-in-first-out. " +
    "Students who have waited longer will have priority over students who " +
    "joined the queue later.";

const QUESTION_SORT_EXPLANATION =
    "This sort strategy is not first-in-first-out. Students who have had fewer " +
    "questions answered today will receive preference. This means you will " +
    "see students who have asked fewer questions added to the queue before " +
    "you, even after joining later. This strategy enables us to ensure that " +
    "everyone can receive at least some help each day.";

const QUESTION_TIME_SORT_EXPLANATION =
    "This sort strategy is not first-in-first-out. Students who have had fewer " +
    "questions answered today AND who have waited longer will receive " +
    "preference. This means that if you have asked a few questions, you may " +
    "see students who have asked fewer questions added to the queue before " +
    "you, even after joining later. This strategy enables us to ensure that " +
    "everyone can receive at least some help each day while keeping the wait " +
    "time reasonable.";

export const getSortTypeHelpText = (sortType: QueueSortType): string => {
    switch (sortType) {
        case QueueSortType.Questions:
            return QUESTION_SORT_EXPLANATION;
        case QueueSortType.Time:
            return TIME_SORT_EXPLANATION;
        case QueueSortType.QuestionsAndTime:
            return QUESTION_TIME_SORT_EXPLANATION;
    }
};
