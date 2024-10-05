import openai from '@/lib/openai';
import axios from 'axios'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer'
import { htmlToText } from 'html-to-text';
import { cookies } from 'next/headers';
import oauth2Client from '@/lib/oauth';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const websiteInformation = `https://www.ticketcutter.com/ The firm’s name is: Ticket Cutter Our phone number is: 4252642000`

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

const structure = `Title of the Page
Meta Description

Service Page Title:

(KEYWORD) Lawyer in (CITY)
Include accurate facts about the (CITY) in the paragraph and relate it to the (KEYWORD).

[Service Name] Lawyer in [City, State]
Being involved in a [related situation] can be devastating. A [specific incident] can change your life in the blink of an eye, so having the right support is very important. Besides the emotional trauma, you also have to tend to your physical injuries and property damage.
Legal Consequences of (KEYWORD) in Washington State

(KEYWORD) Penalties in (CITY):

List legal options to handle (KEYWORD).

How Our Firm Can Help You 
At Ticket Cutter, we handle [case types], [specific claims], and [related legal matters]. Joseph B. Cutter is a seasoned [City] [specialty] attorney and [related field] law specialist who can help you through the filing and claims process. Our main goal is to help you get the compensation you deserve and cover all losses due to the [incident].

By choosing our [service], you can focus on making a fast recovery and putting your life back together. [Related incidents] can lead to excessive medical bills, wrongful death, traumatic brain injuries, and other serious injuries. Our experienced attorneys ensure your insurance claims get you maximum compensation.

Why Choose Ticket Cutter | (CITY) (KEYWORD) Attorney:

With over [number] years of experience, our firm has a proven track record of success. We are known for our dedication, expertise, and personalized approach. Read testimonials from our satisfied clients to learn more about our impact.

Ticket Cutter's Local Expertise:

We serve various areas including, but not limited to: Seattle, Renton, Everett, Federal Way, Gig Harbor, Kent, Kirkland, Olympia, Redmond, Tacoma, Bellevue, Bremerton, Tukwila, Kent, Auburn, Burien, Sammamish, Issaquah and Bothell 

How to handle (KEYWORD) in (CITY)
Don’t wait to seek the justice you deserve. Contact us today for a free consultation and take the first step toward recovery. Call us at [phone number] or fill out our online contact form.

(KEYWORD) in (CITY) FAQs
Write out the frequently asked questions related to the (KEYWORD)

Things to not do when writing this content: 

Don't not start any sentence on this service page with: At Ticket Cutter 
`

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
            // @ts-ignore
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
        const apiKey = '9d6104e7b1ab1d6c5fcb484b76a55f9d818c2184318d7681a432149c53ff2adc';
        return `https://serpapi.com/search?api_key=${apiKey}&q=${encodeURIComponent(query)}`;
    }

    isUrlDirectory = (url: string) => {
        return !popularDirectories.some(directory => url.includes(directory))
    }

    async openAi(scrapedText: string, keyword: string, city: string) {
        const completion = await openai.chat.completions.create({
            messages: [
                { "role": "system", "content": "You are a copywriter with decades of experience writing service pages for specific cities that our law firm. You write using no filler or fluff words. You write clearly and in complete sentences." },
                { "role": "system", "content": `Make sure to use the keyword: ${keyword} and city: ${city}` },
                { "role": "system", "content": `Here is the information about my website/company you need to write for: ${websiteInformation}` },
                { "role": "system", "content": "Write this in an SEO optimized fashion and include the keywords and relevant titles in the service page. Write a minimum of 1100-1300 words." },
                { "role": "system", "content": "Write from the point of view of one attorney. Write in the most human way possible. Write in a way that will pass an AI detection test. Write in complete sentences. " },
                { "role": "system", "content": "Vary the output in each section. Don't be a cookie cutter when it comes to the writing." },
                { "role": "system", "content": "Write it in plain text. not HTML" },
                { "role": "system", "content": `use the following structure: ${structure}` },
                { "role": "system", "content": `Do not use the following words: ${avoidedWords}` },
                { "role": "system", "content": "Most importantly make sure all of the information is in compliance with Washington State law and how other lawyers in Washington would handle this legal matter." },
                { "role": "assistant", "content": `Please use this content as the knowledge base information for the page: ${scrapedText}` },
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


    async create(cities: string[], industry: string) {
        await Promise.all(
            cities.map(async (city: string) => {


                const keyword = `${industry} ${city}`;

                const results = await axios.get(this.buildUrlFromCity(keyword))

                for (const result of results.data.organic_results) {
                    if (this.isUrlDirectory(result.link)) {
                        const scrapping = await this.getBodyContent(result.link);
                        if (scrapping !== null) {
                            const generatedData = await this.openAi(scrapping, industry, city)
                            return await this.createGoogleDoc(`${uuidv4()}-${city}-${keyword}`, generatedData?.choices[0]?.message?.content as string)
                        }
                        
                    }

                }
            })
        )

    }
}

export default Content