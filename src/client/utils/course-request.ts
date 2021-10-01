import { generateMailto } from "./mailto";

export const courseRequestMailto = (senderName: string) => {
    const courseRequestTemplate = `Hi,

I want to request to use the Q for my course. Here is my information.

Course code: <Course-code-here>
Course title: <Course-title-here>
Course alias (if applicable): <Couse-alias-here>

The UQ username of the manager of the queue tool of this course is <uqfoobar>.

I want to use the Q for <your-reason>.

Kind regards,
${senderName}
`;
    return generateMailto(
        "richard.thomas@uq.edu.au",
        "[Q] Request queue access",
        courseRequestTemplate
    );
};
