"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModel';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';
import { UserAnswer } from '@/utils/schema';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        setIsClient(true);
        results.forEach(result => {
            setUserAnswer(prevAns => prevAns + result.transcript);
        });
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        }
    }, [userAnswer]);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            try {
                if (!isRecording) {
                    startSpeechToText();
                }
            } catch (err) {
                console.error("Error starting speech recognition:", err);
            }
        }
    };

    const UpdateUserAnswer = async () => {
        console.log(userAnswer);
        setLoading(true);
        const feedbackPrompt =
            "Question: " + mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer: " + userAnswer +
            ", Depending on question and user answer for the given interview question, " +
            "please give us a rating in numbers for the answer and feedback as improvement if any " +
            "in just 3-5 lines to improve it in JSON format with rating field and feedback field.";

        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
        console.log(mockJsonResp);
        const JsonFeedbackResp = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: JsonFeedbackResp.feedback,
            rating: JsonFeedbackResp.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
        });

        if (resp) {
            toast('User Answer recorded successfully.');
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoading(false);
    };

    return (
        isClient && (
            <div className='flex items-center justify-center flex-col'>
                <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
                    <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
                    <Webcam
                        mirrored={true}
                        style={{
                            height: 300,
                            width: '100%',
                            zIndex: 10,
                        }} />
                </div>
                <Button
                    disabled={loading}
                    variant="outline" className="my-10" onClick={StartStopRecording}>
                    {isRecording ?
                        <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                            <StopCircle /> Stop Recording
                        </h2>
                        :
                        <h2 className='text-primary flex gap-2 items-center'>
                            <Mic /> Record Answer
                        </h2>
                    }
                </Button>
            </div>
        )
    );
}

export default RecordAnswerSection;
