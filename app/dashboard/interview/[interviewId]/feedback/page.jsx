"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';

function Feedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(null);
    const router = useRouter();

    useEffect(() => {
        GetFeedback();
    }, []);

    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);
        console.log(result);
        setFeedbackList(result);

        if (result.length > 0) {
            const totalRating = result.reduce((acc, item) => acc + parseFloat(item.rating), 0);
            const averageRating = totalRating / result.length;
            setOverallRating(averageRating); // Round to 2 decimal places
        }
    };

    return (
        <div className='p-10'>

            {feedbackList?.length == 0 ?
                <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Fouund</h2>
                :
                <>
                    <h2 className='text-3xl font-bold text-green-500'>Congratulation!!!</h2>
                    <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>

                    <h2 className='text-primary text-lg my-3'>Your Overall rating: <strong>{overallRating}/5</strong></h2>

                    <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer, and feedback for improvement:</h2>
                    {feedbackList && feedbackList.map((item, index) => (
                        <Collapsible key={index} className='mt-7'>
                            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
                                {item.question}<ChevronsUpDown className='h-5 w-5' />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                                    <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong> {item.userAns}</h2>
                                    <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong> {item.correctAns}</h2>
                                    <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong> {item.feedback}</h2>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>}
            <Button className='mt-5' onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    )
}

export default Feedback;
