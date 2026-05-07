import axios from 'axios';
import * as cheerio from 'cheerio';

// In-memory cache for scraped Infopark jobs
let cachedJobs = [];
let lastFetchTime = 0;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Scrape job listings from Infopark.in
 * Fetches pages 1-3 of the job search results
 */
export const scrapeInfoparkJobs = async () => {
    const now = Date.now();

    // Return cached data if still fresh
    if (cachedJobs.length > 0 && (now - lastFetchTime) < CACHE_DURATION_MS) {
        console.log(`[Infopark] Returning ${cachedJobs.length} cached jobs (age: ${Math.round((now - lastFetchTime) / 1000)}s)`);
        return cachedJobs;
    }

    console.log('[Infopark] Cache expired or empty. Scraping fresh data...');
    const allJobs = [];
    const pagesToScrape = 3; // Scrape first 3 pages (~60 jobs)

    try {
        for (let page = 1; page <= pagesToScrape; page++) {
            const url = page === 1
                ? 'https://infopark.in/companies/job-search'
                : `https://infopark.in/companies/job-search?page=${page}`;

            console.log(`[Infopark] Scraping page ${page}: ${url}`);

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                timeout: 15000,
            });

            const $ = cheerio.load(response.data);

            // Parse each job listing card from the page
            // Infopark uses table rows or card-style divs for job listings
            // We need to find the pattern in the HTML
            const jobCards = $('table.table tbody tr, .job-listing, .card, .job-item, div[class*="job"]');

            if (jobCards.length === 0) {
                // Try alternative: look for links that match the detail pattern
                const detailLinks = $('a[href*="/company-jobs/details/"]');
                const processedLinks = new Set();

                detailLinks.each((index, element) => {
                    const link = $(element).attr('href');
                    if (!link || processedLinks.has(link)) return;
                    processedLinks.add(link);

                    // Walk up to find the parent container with job info
                    const parentRow = $(element).closest('tr, .card, .list-group-item, div[class*="row"], div[class*="col"]').first();
                    let container = parentRow.length > 0 ? parentRow : $(element).parent().parent();

                    // Extract text content from the container
                    const containerText = container.text().replace(/\s+/g, ' ').trim();

                    // Try to extract job title and company from surrounding elements
                    let jobTitle = '';
                    let companyName = '';

                    // Look for headings or strong/bold text near the link
                    const headings = container.find('h3, h4, h5, strong, b, .title, .job-title');
                    if (headings.length > 0) {
                        jobTitle = $(headings[0]).text().trim();
                        if (headings.length > 1) {
                            companyName = $(headings[1]).text().trim();
                        }
                    }

                    // If we couldn't find structured data, parse from container text
                    if (!jobTitle && containerText.length > 5) {
                        // Remove "Details" text and try to extract meaningful content
                        const cleanText = containerText.replace(/Details/gi, '').trim();
                        const parts = cleanText.split(/\s{2,}|\n|·|—|-{2,}/);
                        if (parts.length >= 2) {
                            companyName = parts[0]?.trim() || '';
                            jobTitle = parts[1]?.trim() || '';
                        } else if (parts.length === 1) {
                            jobTitle = parts[0]?.trim() || 'Position Available';
                        }
                    }

                    // Build the full URL
                    const fullLink = link.startsWith('http')
                        ? link
                        : `https://infopark.in${link}`;

                    // Extract job ID from the URL
                    const urlParts = link.split('/');
                    const jobId = urlParts[urlParts.length - 2] || `infopark_${index}_p${page}`;

                    // Determine campus from page context or URL
                    let campus = 'Infopark Kochi';

                    if (jobTitle || companyName) {
                        allJobs.push({
                            id: `infopark_${jobId}`,
                            title: jobTitle || 'View Details for Position',
                            company: companyName || 'Infopark Company',
                            location: `${campus}, Kerala, India`,
                            type: 'Full-Time',
                            experience: 'See Details',
                            salary: 'Not Disclosed',
                            postedDate: 'Recent',
                            description: `Job opportunity at ${companyName || 'an Infopark company'} in ${campus}. Click "Apply Now" to view full details on Infopark.`,
                            requirements: ['See full listing for requirements'],
                            applyLink: fullLink,
                            logo: null,
                            source: 'infopark',
                            campus: campus,
                        });
                    }
                });
            } else {
                // Standard parsing for table/card layouts
                jobCards.each((index, element) => {
                    const $card = $(element);
                    const detailLink = $card.find('a[href*="/company-jobs/details/"]');
                    if (detailLink.length === 0) return;

                    const link = detailLink.attr('href');
                    const fullLink = link?.startsWith('http')
                        ? link
                        : `https://infopark.in${link}`;

                    // Extract text from table cells or card elements
                    const cells = $card.find('td, .col, span, p');
                    const texts = [];
                    cells.each((_, cell) => {
                        const t = $(cell).text().trim();
                        if (t && t !== 'Details' && t.length > 1) {
                            texts.push(t);
                        }
                    });

                    const companyName = texts[0] || 'Infopark Company';
                    const jobTitle = texts[1] || texts[0] || 'Position Available';
                    const urlParts = (link || '').split('/');
                    const jobId = urlParts[urlParts.length - 2] || `infopark_${index}_p${page}`;

                    allJobs.push({
                        id: `infopark_${jobId}`,
                        title: jobTitle,
                        company: companyName,
                        location: 'Infopark Kochi, Kerala, India',
                        type: 'Full-Time',
                        experience: 'See Details',
                        salary: 'Not Disclosed',
                        postedDate: 'Recent',
                        description: `Job opportunity at ${companyName} in Infopark Kochi. Click "Apply Now" to view full details on Infopark.`,
                        requirements: ['See full listing for requirements'],
                        applyLink: fullLink,
                        logo: null,
                        source: 'infopark',
                        campus: 'Infopark Kochi',
                    });
                });
            }

            // Small delay between page requests to be respectful
            if (page < pagesToScrape) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Now fetch details for first 20 jobs to enrich data
        const jobsToEnrich = allJobs.slice(0, 20);
        console.log(`[Infopark] Enriching ${jobsToEnrich.length} jobs with detail pages...`);

        for (const job of jobsToEnrich) {
            try {
                const detailResponse = await axios.get(job.applyLink, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                        'Accept': 'text/html',
                    },
                    timeout: 10000,
                });

                const $detail = cheerio.load(detailResponse.data);

                // Extract company name from detail page
                const companyHeading = $detail('h4, h3').filter((_, el) => {
                    const text = $detail(el).text().trim();
                    return text && !text.includes('Job') && text.length < 100;
                });

                if (companyHeading.length > 0) {
                    const detailCompany = $detail(companyHeading[0]).text().trim();
                    if (detailCompany && detailCompany.length > 1) {
                        job.company = detailCompany;
                    }
                }

                // Extract job title from detail page
                const titleHeading = $detail('h4, h3').filter((_, el) => {
                    const prevCompany = job.company;
                    const text = $detail(el).text().trim();
                    return text && text !== prevCompany && text.length < 150;
                });

                if (titleHeading.length > 1) {
                    const detailTitle = $detail(titleHeading[1]).text().trim();
                    if (detailTitle && detailTitle.length > 1) {
                        job.title = detailTitle;
                    }
                } else if (titleHeading.length === 1) {
                    const detailTitle = $detail(titleHeading[0]).text().trim();
                    if (detailTitle && detailTitle !== job.company) {
                        job.title = detailTitle;
                    }
                }

                // Extract description text from the main content area
                const mainContent = $detail('.content, .job-details, .card-body, main, article').first();
                if (mainContent.length > 0) {
                    const descText = mainContent.text().replace(/\s+/g, ' ').trim();
                    if (descText.length > 20) {
                        // Clean the description
                        const cleanDesc = descText
                            .replace(/Back.*?Company Profile/s, '')
                            .replace(/About Infopark.*$/s, '')
                            .trim();
                        if (cleanDesc.length > 20) {
                            job.description = cleanDesc.substring(0, 300) + (cleanDesc.length > 300 ? '...' : '');
                        }
                    }
                }

                // Look for email in the page for apply link
                const pageText = $detail('body').text();
                const emailMatch = pageText.match(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
                if (emailMatch && !emailMatch[0].includes('infopark.in') && !emailMatch[0].includes('info@')) {
                    job.applyEmail = emailMatch[0];
                }

                // Update description with enriched data
                job.description = job.description || `Job opportunity at ${job.company} in Infopark. Apply via the detail link.`;

                // Respectful delay between detail requests
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (detailError) {
                // If detail page fails, keep the basic info
                console.warn(`[Infopark] Failed to fetch detail for job ${job.id}: ${detailError.message}`);
            }
        }

        // Deduplicate by job ID
        const uniqueJobs = [];
        const seenIds = new Set();
        for (const job of allJobs) {
            if (!seenIds.has(job.id)) {
                seenIds.add(job.id);
                uniqueJobs.push(job);
            }
        }

        // Update cache
        cachedJobs = uniqueJobs;
        lastFetchTime = Date.now();

        console.log(`[Infopark] Scraped and cached ${uniqueJobs.length} unique jobs`);
        return uniqueJobs;

    } catch (error) {
        console.error('[Infopark] Scraping error:', error.message);
        // Return cached data even if stale, or empty array
        if (cachedJobs.length > 0) {
            console.log('[Infopark] Returning stale cached data due to scraping error');
            return cachedJobs;
        }
        return [];
    }
};

/**
 * Get cached Infopark jobs without forcing a refresh
 */
export const getCachedInfoparkJobs = () => {
    return cachedJobs;
};

/**
 * Force clear the cache
 */
export const clearInfoparkCache = () => {
    cachedJobs = [];
    lastFetchTime = 0;
    console.log('[Infopark] Cache cleared');
};
