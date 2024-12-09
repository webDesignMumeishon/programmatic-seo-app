import openai from '@/lib/openai';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer'
import { htmlToText } from 'html-to-text';
import oauth2Client from '@/lib/oauth';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

const getPrompt = (keyword: string, city: string) => {
    return `
    Please respond only in the English language. You write using no filler or fluff words. 
    You are an expert copywriter landing page creator with decades of experience writing service pages.  
    You have a Persuasive writing style. 
    Do not self reference. 
    Do not explain what you are doing. 
    Make sure you are writing this service page for the following city: ${city}.
    Please include the following keywords: ${keyword}. 
    `
}

const avoidedWords = [
    "Actually", "Basically", "Simply", "Really", "Quite", "Generally", "Usually", "Virtually",
    "Essentially", "Literally", "Clearly", "Obviously", "Definitely", "Hopefully", "Honestly",
    "Truly", "Seriously", "Slightly", "Almost", "Absolutely", "Exactly", "Naturally", "Certainly",
    "Probably", "Undoubtedly", "Extremely", "Frequently", "Possibly", "Completely", "Totally",
    "Simply", "Entirely", "Mostly", "Particularly", "Quite", "Truly", "Actually", "Generally",
    "Specifically", "Mainly", "Sincerely", "Typically", "Unquestionably", "Entirely", "Presumably",
    "Practically", "Essentially", "Interestingly", "Hopefully", "Basically", "Realistically",
    "Ideally", "Curiously", "Evidently", "Surprisingly", "Admittedly", "Oddly", "Apparently",
    "Eventually", "Ultimately", "Incidentally", "Fundamentally", "Consistently", "Periodically",
    "Occasionally", "Often", "Continually", "Gradually", "Regularly", "Repeatedly", "Intermittently",
    "Temporarily", "Initially", "Merely", "Certainly", "Absolutely", "Undoubtedly", "Surely",
    "Assuredly", "Indisputably", "Unquestionably", "Unarguably", "Undeniably", "Affirmatively",
    "Positively", "Definitely", "Conclusively", "Clearly", "Decidedly", "Explicitly", "Evidently",
    "Incontrovertibly", "Irrefutably", "Manifestly", "Obviously", "Plainly", "Unmistakably",
    "Patently", "Essential", "Understanding", "Unlock", "Unlocking", "Key", "Navigate", "Navigating"
];

const popularDirectories = [
    'yelp',
    'yellowpages',
    'angieslist',
    'justia',
    'whitepages',
    'thumbtack',
    'manta',
    'superpages',
    'bbb',
    'houzz',
    'hotfrog',
    'dougallreilly',
    'citysearch',
    'yellowbook',
    'alignable',
    'bingplaces',
    'angieslist',
    'yellowpages',
    'gumtree',
    'expertise',
    'findlaw',
    'topratedlocal',
    'napavalley',
    'care',
    'lawyers',
    'trustpilot',
    'pagerank',
    '360cities',
    'holler',
    'cylex.us',
    'yellowbot',
    'local',
    'finduslocal',
    '1-800-flowers',
    'safebusinessdirectory',
    'usdirectory',
    'ourbis',
    'bizcommunity',
    'lacartes',
    'landingcube',
    'shoplocal',
    'zillow',
    'merchantcircle',
    'thelocaldirectory',
    'yelp.co',
    'local.yahoo',
    'yellowpages.co',
    'freeindex.co',
    'buzzfile',
    'eyefind',
    'bbb',
    '1stdibs',
    'retailmenot',
    'sulekha',
    'floristone',
    'weddingwire',
    'bing.com',
    'brightlocal',
    'linkedin',
    'localsearch.com',
    'deal',
    'locateadoc',
    'directoryvault',
    'koat',
    'luxury',
    'alleywatch',
    'vcfashion',
    'stylenation',
    'loveshackfancy',
    'net-a-porter',
    'dell',
    'trustpilot.co',
    'boredpanda',
    'thewhiskyexchange',
    'artstation',
    'allbusiness',
    'fimfiction',
    'everquote',
    'dreamstime',
    'braindump',
    'coolest-gadgets',
    'dogpile',
    'ezydvd.com',
    'autotrader.co',
    'europeanbusinessdirectory',
    'businesslistings',
    'searchme',
    'smithandsons',
    'businessfinder',
    'ypg',
    'metropolis',
    'handy',
    'surveyjunkie',
    'vetrano',
    'thevineyard',
    'yellowpages.com',
    'houzz.com',
    'travelocity',
    'senioradvice',
    'grove',
    'solo',
    'dealspotr',
    'libratone',
    'locatepeople',
    'autoscout24',
    'trendhunter',
    'bestbuy',
    'metalarch',
    'citibank',
    'pipedrive',
    'mojosavings',
    'rode',
    'amplify',
    'ruggedstore',
    'simplybusiness',
    'jabong',
    'realto/'
];

class Content {

    async getBodyContent(url: string) {
        // Launch the browser
        const browser = await puppeteer.launch();

        // Open a new page
        const page = await browser.newPage();

        // Navigate to the specified URL
        await page.goto(url);

        // Get the body content
        const bodyContent = await page.evaluate(() => {
            const body = document.querySelector('body');
            return body ? body.innerHTML : null;  // Return the innerHTML if body exists, else return null
        });

        // Close the browser
        await browser.close();

        // Return the body content
        if (bodyContent) {
            const text = htmlToText(bodyContent, {
                wordwrap: 130  // Wrap text to 130 characters width
            });
            return text;
        }


        return null;
    }

    buildUrlFromCity = (query: string) => {
        const apiKey = process.env.SERP_API_KEY
        if (apiKey === undefined) {
            throw new Error('Missing SERP API Key')
        }
        return `https://serpapi.com/search?api_key=${apiKey}&q=${encodeURIComponent(query)}`;
    }

    isUrlDirectory = (url: string) => {
        return !popularDirectories.some(directory => url.includes(directory))
    }

    async openAi(scrapedText: string, keyword: string, city: string, websiteUrl: string, companyName: string) {
        const completion = await openai.chat.completions.create({
            messages: [
                { "role": "system", "content": getPrompt(keyword, city) },
                { "role": "system", "content": `Here is the information about my website you need to write for: ${websiteUrl}. This is the name of the company you need to write for: ${companyName}` },
                { "role": "system", "content": "Write this in an SEO optimized fashion and include the keywords and relevant titles in the service page. Write a minimum of 1100-1300 words." },
                { "role": "system", "content": "Write in the most human way possible. Write in a way that will pass an AI detection test. Write in complete sentences. " },
                { "role": "system", "content": "Vary the output in each section. Don't be a cookie cutter when it comes to the writing." },
                { "role": "system", "content": "Write it in plain text. not HTML" },
                { "role": "system", "content": `Do not use the following words: ${avoidedWords}` },
                { "role": "assistant", "content": `Please use this content as the knowledge base information for the page: ${scrapedText}.` },
            ],
            model: "gpt-4o-mini",
        });

        return completion
    }

    async createGoogleDoc(title: string, content: string) {
        const session: any = await getServerSession(authOptions);

        // Access the refresh token from the session

        oauth2Client.setCredentials({
            access_token: session.accessToken,
            refresh_token: session?.refreshToken
        });

        // Initialize the Docs API
        const docs = google.docs({ version: 'v1', auth: oauth2Client });

        try {
            // Create a new Google Doc
            const response = await docs.documents.create({
                requestBody: {
                    title,
                },
            });

            // The document ID
            const documentId = response.data.documentId;
            console.log('Document created with ID:', documentId);

            // Optionally: You can insert text into the document
            await docs.documents.batchUpdate({
                documentId: documentId || '',
                requestBody: {
                    requests: [
                        {
                            insertText: {
                                location: {
                                    index: 1, // Starting at index 1
                                },
                                text: content,
                            },
                        },
                    ],
                },
            });

            console.log('Text inserted into document!');
        } catch (error) {
            console.error('Error creating document:', error);
        }
    }


    async create(cities: string[], industry: string, websiteUrl: string, companyName: string) {
        await Promise.all(
            cities.map(async (city: string) => {

                const keyword = `${industry} ${city}`;

                const results = await axios.get(this.buildUrlFromCity(keyword))

                for (const result of results.data.organic_results) {
                    if (this.isUrlDirectory(result.link)) {
                        const scrapping = await this.getBodyContent(result.link);
                        if (scrapping !== null) {
                            const generatedData = await this.openAi(scrapping, industry, city, websiteUrl, companyName)
                            const knowledgeBase = `Knowledge base source: ${result.link}\n\n`;
                            const content = generatedData?.choices[0]?.message?.content as string
                            const updatedContent = knowledgeBase + content
                            return await this.createGoogleDoc(`${uuidv4()}-${city}-${keyword}`, updatedContent)
                        }

                    }

                }
            })
        )

    }
}

export default Content