import axios from 'axios';
import { scrapeInfoparkJobs } from '../services/infoparkService.js';

/**
 * Get all jobs — combines JSearch API (India-focused) + Infopark scraped jobs + fallback mock data
 */
export const getJobs = async (req, res) => {
    try {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        const searchQuery = req.query.search || '';
        const sourceFilter = req.query.source || 'all'; // 'all', 'infopark', 'other'
        console.log(`[JobPortal] Search: "${searchQuery}", Source: "${sourceFilter}", RAPIDAPI_KEY present: ${!!rapidApiKey}`);

        let jsearchJobs = [];
        let infoparkJobs = [];

        // --- Source 1: Infopark Scraper (Kerala jobs) ---
        if (sourceFilter === 'all' || sourceFilter === 'infopark') {
            try {
                infoparkJobs = await scrapeInfoparkJobs();
                console.log(`[JobPortal] Got ${infoparkJobs.length} Infopark jobs`);
            } catch (infoparkError) {
                console.error('[JobPortal] Infopark scraping failed:', infoparkError.message);
            }
        }

        // --- Source 2: JSearch API (India-focused) ---
        if ((sourceFilter === 'all' || sourceFilter === 'other') && rapidApiKey) {
            // Append "India" to make results India-focused
            const query = searchQuery
                ? `${searchQuery} India Kerala`
                : 'Software Engineer India Kerala';

            const options = {
                method: 'GET',
                url: 'https://jsearch.p.rapidapi.com/search',
                params: {
                    query: query,
                    page: '1',
                    num_pages: '1',
                    date_posted: 'month'
                },
                headers: {
                    'X-RapidAPI-Key': rapidApiKey,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);

                if (response.data && response.data.data) {
                    jsearchJobs = response.data.data.map((job, index) => ({
                        id: job.job_id || `api_job_${index}`,
                        title: job.job_title,
                        company: job.employer_name,
                        location: `${job.job_city || ''}, ${job.job_state || ''} ${job.job_is_remote ? '(Remote)' : ''}`.trim() || job.job_country || 'India',
                        type: job.job_employment_type || 'Full-Time',
                        experience: job.job_required_experience?.required_experience_in_months ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years` : 'Not specified',
                        salary: (job.job_min_salary && job.job_max_salary)
                            ? `₹${(job.job_min_salary).toLocaleString('en-IN')} - ₹${(job.job_max_salary).toLocaleString('en-IN')}`
                            : (job.job_salary_currency ? 'Competitive' : 'Not Disclosed'),
                        postedDate: new Date(job.job_posted_at_datetime_utc).toLocaleDateString('en-IN'),
                        description: job.job_description ? job.job_description.substring(0, 200) + '...' : 'No description available.',
                        requirements: job.job_highlights?.Qualifications || ['See full description for requirements'],
                        applyLink: job.job_apply_link,
                        logo: job.employer_logo || (job.employer_website ? `https://logo.clearbit.com/${job.employer_website.replace(/^https?:\/\//, '')}` : null),
                        source: 'jsearch',
                        campus: null,
                    }));
                }
            } catch (apiError) {
                console.error("[JobPortal] JSearch API Error:", apiError.message);
            }
        }

        // --- Fallback: Indian mock data if both sources return empty ---
        if (jsearchJobs.length === 0 && infoparkJobs.length === 0) {
            console.log('[JobPortal] Both sources empty, using Indian fallback data');
            const mockJobs = getIndianMockJobs();

            // Apply search filter to mock data
            let filteredMock = [...mockJobs];
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                filteredMock = filteredMock.filter(job =>
                    job.title.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.location.toLowerCase().includes(q)
                );
            }

            return res.status(200).json({ success: true, count: filteredMock.length, data: filteredMock });
        }

        // --- Combine and filter results ---
        let allJobs = [...jsearchJobs, ...infoparkJobs];

        // Apply search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            allJobs = allJobs.filter(job =>
                job.title.toLowerCase().includes(q) ||
                job.company.toLowerCase().includes(q) ||
                job.location.toLowerCase().includes(q)
            );
        }

        // Apply campus filter if provided
        const campusFilter = req.query.campus;
        if (campusFilter) {
            allJobs = allJobs.filter(job =>
                job.campus && job.campus.toLowerCase().includes(campusFilter.toLowerCase())
            );
        }

        res.status(200).json({ success: true, count: allJobs.length, data: allJobs });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, message: "Error fetching jobs" });
    }
};

/**
 * Get only Infopark jobs
 */
export const getInfoparkJobs = async (req, res) => {
    try {
        const jobs = await scrapeInfoparkJobs();
        const searchQuery = req.query.search || '';
        const campusFilter = req.query.campus || '';

        let filtered = [...jobs];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(q) ||
                job.company.toLowerCase().includes(q)
            );
        }

        if (campusFilter) {
            filtered = filtered.filter(job =>
                job.campus && job.campus.toLowerCase().includes(campusFilter.toLowerCase())
            );
        }

        res.status(200).json({ success: true, count: filtered.length, data: filtered });
    } catch (error) {
        console.error("Error fetching Infopark jobs:", error);
        res.status(500).json({ success: false, message: "Error fetching Infopark jobs" });
    }
};

/**
 * Indian company fallback mock data — used when APIs/scraping fail
 */
function getIndianMockJobs() {
    return [
        {
            id: "mock_1",
            title: "React Developer",
            company: "UST",
            location: "Thiruvananthapuram, Kerala (Hybrid)",
            type: "Full-Time",
            experience: "2-4 years",
            salary: "₹6,00,000 - ₹10,00,000",
            postedDate: "2 hours ago",
            description: "Join our frontend engineering team to build modern, responsive web applications for global clients. Work with React, TypeScript, and cutting-edge web technologies.",
            requirements: ["React", "TypeScript", "JavaScript", "REST APIs"],
            applyLink: "https://www.ust.com/en/careers",
            logo: "https://logo.clearbit.com/ust.com",
            source: "featured",
            campus: null,
        },
        {
            id: "mock_2",
            title: "Software Engineer",
            company: "Infosys",
            location: "Thiruvananthapuram, Kerala",
            type: "Full-Time",
            experience: "Entry Level",
            salary: "₹3,60,000 - ₹5,00,000",
            postedDate: "1 day ago",
            description: "Exciting opportunity for fresh graduates to join Infosys's Trivandrum campus. Work on enterprise-scale digital transformation projects for Fortune 500 clients.",
            requirements: ["Java", "Python", "SQL", "Problem Solving"],
            applyLink: "https://www.infosys.com/careers",
            logo: "https://logo.clearbit.com/infosys.com",
            source: "featured",
            campus: null,
        },
        {
            id: "mock_3",
            title: "Full Stack Developer",
            company: "TCS",
            location: "Kochi, Kerala (Hybrid)",
            type: "Full-Time",
            experience: "1-3 years",
            salary: "₹4,50,000 - ₹8,00,000",
            postedDate: "3 days ago",
            description: "TCS is looking for talented full-stack developers for their Kochi delivery center. Build scalable web applications using the latest technologies.",
            requirements: ["Node.js", "React", "MongoDB", "Express"],
            applyLink: "https://www.tcs.com/careers",
            logo: "https://logo.clearbit.com/tcs.com",
            source: "featured",
            campus: null,
        },
        {
            id: "mock_4",
            title: "DevOps Engineer",
            company: "IBS Software",
            location: "Thiruvananthapuram, Kerala",
            type: "Full-Time",
            experience: "3-5 years",
            salary: "₹8,00,000 - ₹14,00,000",
            postedDate: "5 hours ago",
            description: "IBS Software is hiring DevOps engineers to support cloud-native aviation and hospitality platforms. Work with AWS, Kubernetes, and CI/CD pipelines.",
            requirements: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
            applyLink: "https://www.ibsplc.com/careers",
            logo: "https://logo.clearbit.com/ibsplc.com",
            source: "featured",
            campus: null,
        },
        {
            id: "mock_5",
            title: "Data Analyst",
            company: "Envestnet",
            location: "Trivandrum, Kerala",
            type: "Full-Time",
            experience: "2-4 years",
            salary: "₹7,00,000 - ₹12,00,000",
            postedDate: "1 week ago",
            description: "Analyze large-scale financial datasets and build dashboards for wealth management solutions. Work with a collaborative global team from our Trivandrum office.",
            requirements: ["Python", "SQL", "Tableau", "Machine Learning"],
            applyLink: "https://www.envestnet.com/careers",
            logo: "https://logo.clearbit.com/envestnet.com",
            source: "featured",
            campus: null,
        },
        {
            id: "mock_6",
            title: "UI/UX Designer",
            company: "QBurst",
            location: "Thiruvananthapuram, Kerala",
            type: "Full-Time",
            experience: "1-3 years",
            salary: "₹4,00,000 - ₹7,00,000",
            postedDate: "Just now",
            description: "Design intuitive and beautiful user interfaces for web and mobile applications. Join one of Kerala's top product development companies.",
            requirements: ["Figma", "Adobe XD", "Prototyping", "User Research"],
            applyLink: "https://www.qburst.com/en-in/careers/",
            logo: "https://logo.clearbit.com/qburst.com",
            source: "featured",
            campus: null,
        },
        {
            id: "mock_7",
            title: "Python Developer",
            company: "Travancore Analytics",
            location: "Technopark, Trivandrum, Kerala",
            type: "Full-Time",
            experience: "2-5 years",
            salary: "₹5,00,000 - ₹9,00,000",
            postedDate: "4 hours ago",
            description: "Build AI/ML-powered applications and backend services. Travancore Analytics specializes in AI solutions and is looking for skilled Python developers.",
            requirements: ["Python", "Django", "FastAPI", "Machine Learning"],
            applyLink: "https://www.travancoreanalytics.com/career",
            logo: null,
            source: "featured",
            campus: null,
        },
        {
            id: "mock_8",
            title: "Mobile App Developer",
            company: "Fingent",
            location: "Infopark Kochi, Kerala",
            type: "Full-Time",
            experience: "1-3 years",
            salary: "₹5,00,000 - ₹8,00,000",
            postedDate: "2 days ago",
            description: "Develop cross-platform mobile applications using React Native and Flutter. Fingent is a leading custom software development company based in Infopark Kochi.",
            requirements: ["React Native", "Flutter", "Dart", "Mobile UI"],
            applyLink: "https://www.fingent.com/careers/",
            logo: "https://logo.clearbit.com/fingent.com",
            source: "featured",
            campus: "Infopark Kochi",
        },
    ];
}
