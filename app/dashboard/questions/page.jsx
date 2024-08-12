"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAIModel';
import { useRouter } from 'next/navigation';

function QuestionPage() {
    const [jobPosition, setJobPosition] = useState('');
    const [techStacks, setTechStacks] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setQuestions([]);

        try {
            const prompt = `Job Position: ${jobPosition}, Tech Stacks: ${techStacks}, Years of Experience: ${yearsOfExperience}. Please generate 20 interview questions with answers in JSON format.`;

            const result = await chatSession.sendMessage(prompt);
            const responseText = await result.response.text();
            console.log('Raw API Response:', responseText);

            // Remove markdown formatting
            const cleanedResponseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            console.log('Cleaned Response Text:', cleanedResponseText);

            // Ensure proper JSON format
            const formattedResponseText = cleanedResponseText.startsWith('[') ? cleanedResponseText : `[${cleanedResponseText}]`;

            // Parse JSON
            const parsedResponse = JSON.parse(formattedResponseText);
            setQuestions(parsedResponse || []);
        } catch (error) {
            console.error("Error generating questions:", error);
            setError('Failed to generate questions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-10'>
            <h1 className='text-2xl font-bold mb-4'>Tell Us More About Your Interview</h1>
            <form onSubmit={onSubmit} className='space-y-4'>
                <div>
                    <label className='block text-lg font-medium mb-2'>Job Position</label>
                    <Input
                        placeholder="Ex. Full Stack Developer"
                        value={jobPosition}
                        onChange={(e) => setJobPosition(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className='block text-lg font-medium mb-2'>Tech Stacks</label>
                    <Textarea
                        placeholder="Ex. React, Angular, Node.js, MySQL"
                        value={techStacks}
                        onChange={(e) => setTechStacks(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className='block text-lg font-medium mb-2'>Years of Experience</label>
                    <Input
                        placeholder="Ex. 5"
                        type="number"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <LoaderCircle className='animate-spin' /> Generating Questions
                        </>
                    ) : (
                        'Generate Questions'
                    )}
                </Button>
            </form>

            {error && (
                <div className='mt-4 text-red-600'>
                    {error}
                </div>
            )}

            {questions.length > 0 && (
                <div className='mt-10'>
                    <h2 className='text-xl font-bold mb-4'>Generated Interview Questions</h2>
                    <ul className='space-y-4'>
                        {questions.map((question, index) => (
                            <li key={index} className='border p-4 rounded-lg shadow-sm'>
                                <h3 className='text-lg font-medium'>Question {index + 1}</h3>
                                <p>{question.question}</p>
                                <p className='mt-2 text-gray-700'>{question.answer}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default QuestionPage;
