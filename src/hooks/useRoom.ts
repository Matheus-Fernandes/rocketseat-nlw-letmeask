import { useEffect, useState } from "react"
import { database } from "../services/firebase";
import { useAuth } from './useAuth';

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string
    }>;
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions = databaseRoom.questions as FirebaseQuestions;

            const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: (Object.values(value.likes ?? {})).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            }).sort(
                (q1, q2) => {
                    const q1Firt = -1;
                    const q2Fist = 1;

                    if (q1.isAnswered) {
                        return q2Fist
                    }
                    if (q2.isAnswered) {
                        return q1Firt
                    }
                    if (q1.isHighlighted) {
                        return q1Firt
                    }
                    if (q2.isHighlighted) {
                        return q2Fist
                    }

                    return q2.likeCount - q1.likeCount;
                }
            )

            setQuestions(parsedQuestions)
            setTitle(databaseRoom.title)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id]); // [] é chamado no F5 

    return { questions, title }
}