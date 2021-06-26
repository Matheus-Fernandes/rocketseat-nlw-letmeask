import { ReactNode } from 'react';
import cx from 'classnames';
import '../styles/question.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    children?: ReactNode,
    isAnswered?: boolean;
    isHighlighted?: boolean;
    footerClassName?: string
}

export function Question({
    content,
    author,
    isAnswered = false,
    isHighlighted = false,
    children,
    footerClassName = ""
}: QuestionProps) {
    return (
        <div className={cx({
            question: true,
            answered: isAnswered,
            highlighted: isHighlighted && !isAnswered
        })}>
            <div>
                <p>{content}</p>
            </div>
            <footer className={footerClassName}>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}