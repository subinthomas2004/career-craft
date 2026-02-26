import axios from 'axios';

export const getJobs = async (req, res) => {
    try {
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        console.log(`[JobPortal] RAPIDAPI_KEY present: ${!!rapidApiKey}, length: ${rapidApiKey ? rapidApiKey.length : 0}`);

        if (rapidApiKey) {
            const query = req.query.search || 'Software Engineer';
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

                // Map the JSearch response to our frontend expected format
                if (response.data && response.data.data) {
                    const apiJobs = response.data.data.map((job, index) => ({
                        id: job.job_id || `api_job_${index}`,
                        title: job.job_title,
                        company: job.employer_name,
                        location: `${job.job_city || ''}, ${job.job_state || ''} ${job.job_is_remote ? '(Remote)' : ''}`.trim() || job.job_country || 'Unknown',
                        type: job.job_employment_type || 'Full-Time',
                        experience: job.job_required_experience?.required_experience_in_months ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years` : 'Not specified',
                        salary: (job.job_min_salary && job.job_max_salary) ? `$${job.job_min_salary} - $${job.job_max_salary}` : (job.job_salary_currency ? 'Competitive' : 'Not Disclosed'),
                        postedDate: new Date(job.job_posted_at_datetime_utc).toLocaleDateString(),
                        description: job.job_description ? job.job_description.substring(0, 200) + '...' : 'No description available.',
                        requirements: job.job_highlights?.Qualifications || ['See full description for requirements'],
                        applyLink: job.job_apply_link,
                        logo: job.employer_logo || (job.employer_website ? `https://logo.clearbit.com/${job.employer_website.replace(/^https?:\/\//, '')}` : null)
                    }));

                    return res.status(200).json({ success: true, count: apiJobs.length, data: apiJobs });
                }
            } catch (apiError) {
                console.error("JSearch API Error, falling back to mock data:", apiError.message);
                if (apiError.response) {
                    console.error("JSearch API Response Status:", apiError.response.status);
                    console.error("JSearch API Response Data:", JSON.stringify(apiError.response.data));
                }
                // Fallthrough to mock data below
            }
        }

        // Mock realistic job data (Fallback since no API key is provided yet or if API fails)
        const jobs = [
            {
                id: "job_1",
                title: "Frontend Developer",
                company: "Google",
                location: "Mountain View, CA (Hybrid)",
                type: "Full-Time",
                experience: "Entry Level",
                salary: "$110,000 - $140,000",
                postedDate: "2 hours ago",
                description: "Join our core team to build responsive and accessible web interfaces. You will work closely with designers and product managers to deliver high-quality visual experiences.",
                requirements: ["React", "TypeScript", "Tailwind CSS"],
                applyLink: "https://careers.google.com/",
                logo: "https://logo.clearbit.com/google.com"
            },
            {
                id: "job_2",
                title: "Backend Engineer",
                company: "Spotify",
                location: "New York, NY (Remote)",
                type: "Full-Time",
                experience: "Mid Level",
                salary: "$130,000 - $160,000",
                postedDate: "1 day ago",
                description: "Help us scale our streaming infrastructure to serve millions of users globally. You will design, build, and deploy high-performance backend microservices.",
                requirements: ["Node.js", "Express", "MongoDB", "Redis"],
                applyLink: "https://lifeatspotify.com/jobs",
                logo: "https://logo.clearbit.com/spotify.com"
            },
            {
                id: "job_3",
                title: "Data Scientist Intern",
                company: "Microsoft",
                location: "Redmond, WA (On-site)",
                type: "Internship",
                experience: "Student",
                salary: "$8,000/month",
                postedDate: "3 days ago",
                description: "Work with massive datasets to build predictive models and extract actionable insights. Mentorship provided by Senior Data Scientists.",
                requirements: ["Python", "Machine Learning", "SQL", "Pandas"],
                applyLink: "https://careers.microsoft.com/students/us/en",
                logo: "https://logo.clearbit.com/microsoft.com"
            },
            {
                id: "job_4",
                title: "Full Stack Developer",
                company: "Netflix",
                location: "Los Gatos, CA",
                type: "Contract",
                experience: "Senior Level",
                salary: "$150,000 - $180,000",
                postedDate: "1 week ago",
                description: "Develop enterprise tools for our internal content production teams. You will have full ownership of features from database schema to UI components.",
                requirements: ["React", "Node.js", "GraphQL", "PostgreSQL"],
                applyLink: "https://jobs.netflix.com/",
                logo: "https://logo.clearbit.com/netflix.com"
            },
            {
                id: "job_5",
                title: "Cloud Architect",
                company: "Amazon",
                location: "Seattle, WA (Hybrid)",
                type: "Full-Time",
                experience: "Senior Level",
                salary: "$160,000 - $200,000",
                postedDate: "Just now",
                description: "Design and implement secure, highly available, and scalable cloud infrastructure for our enterprise clients.",
                requirements: ["AWS", "Terraform", "Kubernetes", "Docker"],
                applyLink: "https://amazon.jobs/en/",
                logo: "https://logo.clearbit.com/amazon.com"
            },
            {
                id: "job_6",
                title: "UI/UX Designer",
                company: "Apple",
                location: "Cupertino, CA",
                type: "Full-Time",
                experience: "Mid Level",
                salary: "$120,000 - $160,000",
                postedDate: "5 hours ago",
                description: "Create intuitive and beautiful interfaces for the next generation of Apple software products. Prototype and test features directly with users.",
                requirements: ["Figma", "Prototyping", "User Research"],
                applyLink: "https://jobs.apple.com/en-us/search?sort=relevance&search=UI%2FUX",
                logo: "https://logo.clearbit.com/apple.com"
            }
        ];

        // Ensure we handle query params nicely if a frontend wants to filter
        let filteredJobs = [...jobs];
        if (req.query.search) {
            const query = req.query.search.toLowerCase();
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query)
            );
        }

        // Simulating network delay to make loading states visible in UI
        setTimeout(() => {
            res.status(200).json({ success: true, count: filteredJobs.length, data: filteredJobs });
        }, 800);

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, message: "Error fetching jobs" });
    }
};
