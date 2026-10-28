'use client';
import { LearningApp } from '@learning/ui';
export default function Page() { return <LearningApp apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'} />; }
