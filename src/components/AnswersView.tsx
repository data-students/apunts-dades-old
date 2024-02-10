import { FC } from "react";

interface AnswersViewProps {
    questionId: string;
}

export const AnswersView: FC<AnswersViewProps> = ({ questionId }) => {
    return (
        <div>
            Answers for question {questionId}
        </div>
    );
};

export default AnswersView;
