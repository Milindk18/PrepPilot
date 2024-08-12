"use client";
import { db } from "@/utils/db";
import React, { useEffect, useState } from "react";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        console.log("params.interviewId:", params.interviewId); // Log the interviewId
        GetInterviewDetails();
    }, [params.interviewId]);

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
            console.log("Database result:", result); // Log the database result
            if (result.length > 0) {
                setInterviewData(result[0]);
            } else {
                console.error('Interview data not found');
            }
        } catch (error) {
            console.error('Error fetching interview data:', error);
        }
    };

    if (!isClient) {
        return null; // Render nothing until the component mounts
    }

    return (
        <div className="my-10">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    {interviewData && (
                        <div className="flex flex-col my-5 gap-5">
                            <div className="flex flex-col gap-7 p-5 rounded-lg border">
                                <h2 className="text-lg">
                                    <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
                                </h2>
                                <h2 className="text-lg">
                                    <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
                                </h2>
                                <h2 className="text-lg">
                                    <strong>Years of Experience:</strong> {interviewData.jobExperience}
                                </h2>
                            </div>
                        </div>
                    )}
                    <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-200">
                        <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb /><strong>Information</strong></h2>
                        <h2>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{ height: 300 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
                            <Button variant="ghost" className="w-full" onClick={() => setWebCamEnabled(true)}>
                                Enable WebCam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-end items-end">
                <Link href={'/dashboard/interview/' + params.interviewId + '/start'}>
                    <Button>Start Interview</Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
