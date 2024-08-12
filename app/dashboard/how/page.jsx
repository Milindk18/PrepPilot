"use client"
import Image from 'next/image';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

const steps = [
    {
        id: 1,
        title: 'Log In',
        description: 'Start by logging into your account. If you don’t have one, create a new account easily.',
        icon: '/login-icon.svg'
    },
    {
        id: 2,
        title: 'Provide Job Interview Information',
        description: 'Once logged in, provide details about your job interview. Enter your job position, tech stacks, and years of experience.',
        icon: '/job-info-icon.svg'
    },
    {
        id: 3,
        title: 'Allow Camera and Mic Access',
        description: 'You\'ll be redirected to a page where you need to grant access to your camera and microphone. This is necessary for recording your interview responses.',
        icon: '/camera-mic-icon.svg'
    },
    {
        id: 4,
        title: 'Start the Interview',
        description: 'Begin your mock interview! You will receive five questions related to the information you provided. Listen to each question and record your answers using the record button. You can navigate between questions and record your answers twice if needed.',
        icon: '/interview-icon.svg'
    },
    {
        id: 5,
        title: 'End Interview',
        description: 'Once you’ve answered all the questions, press the "End Interview" button. You will be redirected to the feedback page.',
        icon: '/end-icon.svg'
    },
    {
        id: 6,
        title: 'Receive Feedback',
        description: 'On the feedback page, you’ll receive an overall rating and detailed feedback on each of your answers. You’ll also get optimal answers for the questions you were asked.',
        icon: '/feedback-icon.svg'
    },
];

const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center'
};

const stepsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const stepTriggerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s'
};

const How = () => {

    const router = useRouter();
    return (
        <div style={containerStyle}>
            <h1 className='font-bold text-2xl mt-10 text-primary'>How It Works</h1>
            <div style={stepsContainerStyle} className='mt-5'>
                {steps.map((step) => (
                    <Collapsible key={step.id} cclassName='mt-10'>
                        <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full bg-gray-200'>
                            <Image src={step.icon} alt={`${step.title} Icon`} width={50} height={50} />
                            <h2 className='my-5 font-bold '>{step.title}</h2><ChevronsUpDown className='h-5 w-5' />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className='flex flex-col gap-2'>
                                <p className='p-2 border rounded-lg '>{step.description}</p>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
            <Button className='mt-5' onClick={() => router.replace('/dashboard')}>Get Started</Button>
        </div>
    );
};

export default How;
