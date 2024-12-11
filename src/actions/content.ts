'use server'
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
const URL = process.env.URL || 'http://localhost:8000/add-to-queue'

export async function createJobs(cities: string[], industries: string[], websiteUrl: string, companyName: string, phone: string) {
    const auth: any = await getServerSession(authOptions);

    const session = { accessToken: auth?.accessToken, refreshToken: auth?.refreshToken }

    for (const city of cities) {
        for (const industry of industries) {
            const payload = {
                city,
                industry,
                websiteUrl,
                companyName,
                session,
                phone
            }
            try {
                const response = await fetch(URL, {
                    method: 'POST', // Specifies the HTTP method
                    headers: {
                        'Content-Type': 'application/json', // Indicates JSON data being sent
                    },
                    body: JSON.stringify(payload), // Converts the data object to a JSON string
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Response:', result);
            } catch (error: any) {
                throw new Error(error?.message)
            }

        }
    }
    console.log('All jobs added.');



}