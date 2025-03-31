// career-jobs.js - Handles fetching and displaying job listings

/**
 * Secure Job Listings Fetcher
 * This script fetches job openings from Google Sheets via Google Apps Script
 * using JSONP for cross-origin requests
 */

document.addEventListener('DOMContentLoaded', function() {
    const jobListingsContainer = document.getElementById('jobListings');
    const jobFilters = document.querySelectorAll('.filter-btn');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i><span>Loading job openings...</span>';
    
    // Google Apps Script URL
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwH7egN4egZzVzd4jkKzGz4ooy3wGUO9JZzNZHxctDxapha-UByQBWE2Gd2Os5bl7GlHA/exec';
    
    // Cache for job listings
    let jobListings = [];
    
    // Initialize everything
    initJobListings();
    initFilterButtons();
    initModalControls();
    
    /**
     * Initializes job listings by fetching from Google Apps Script
     */
    function initJobListings() {
        if (jobListingsContainer) {
            console.log('Initializing job listings...'); // Debug log
            jobListingsContainer.innerHTML = '';
            jobListingsContainer.appendChild(loadingSpinner);
            fetchJobListings();
        } else {
            console.error('Job listings container not found!'); // Debug log
        }
    }
    
    /**
     * Initialize filter buttons
     */
    function initFilterButtons() {
        jobFilters.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                jobFilters.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Get the department from the data-filter attribute
                const department = this.getAttribute('data-filter');
                console.log('Filter clicked:', department); // Debug log
                displayJobListings(department);
            });
        });
    }
    
    /**
     * Fetch job listings from Google Sheet using JSONP
     */
    function fetchJobListings() {
        console.log('Fetching job listings from:', SHEET_URL); // Debug log
        
        // Show loading state
        if (jobListingsContainer) {
            jobListingsContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; padding: 2rem; color: #044C4C; font-size: 1.1rem; gap: 1rem;">
                    <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem;"></i>
                    <span>Loading job openings...</span>
                </div>
            `;
        }
        
        // Create a unique callback name
        const callbackName = 'handleJobListings_' + Math.random().toString(36).substr(2, 9);
        
        // Create the script element
        const script = document.createElement('script');
        script.src = `${SHEET_URL}?callback=${callbackName}`;
        
        // Define the callback function
        window[callbackName] = function(response) {
            console.log('Received JSONP response:', response); // Debug log
            
            try {
                if (response && response.status === 'success' && Array.isArray(response.data)) {
                    jobListings = response.data;
                    console.log('Number of jobs loaded:', jobListings.length); // Debug log
                    console.log('Job data:', jobListings); // Debug log
                    displayJobListings('all');
                } else {
                    console.error('Invalid response format:', response); // Debug log
                    throw new Error('Invalid data format received');
                }
            } catch (error) {
                console.error('Error processing job listings:', error);
                showError('Failed to load job listings. Please try again later.');
            } finally {
                // Clean up
                document.body.removeChild(script);
                delete window[callbackName];
            }
        };
        
        // Add error handling for the script
        script.onerror = function() {
            console.error('Failed to load job listings script');
            showError('Failed to load job listings. Please try again later.');
            document.body.removeChild(script);
            delete window[callbackName];
        };
        
        // Append the script to the document
        document.body.appendChild(script);
    }
    
    /**
     * Display job listings based on department filter
     */
    function displayJobListings(department) {
        console.log('Displaying jobs for department:', department); // Debug log
        console.log('Available jobs:', jobListings); // Debug log
        
        if (!jobListingsContainer) {
            console.error('Job listings container not found');
            return;
        }
        
        // Clear existing content
        jobListingsContainer.innerHTML = '';
        
        // Create container for job cards with explicit styling
        const jobCardsContainer = document.createElement('div');
        jobCardsContainer.className = 'job-cards';
        jobCardsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            width: 100%;
            padding: 2rem;
            background: #ffffff;
        `;
        
        if (!Array.isArray(jobListings)) {
            console.error('Job listings is not an array:', jobListings);
            showError('Invalid job listings data');
            return;
        }
        
        const filteredJobs = department === 'all' 
            ? jobListings 
            : jobListings.filter(job => {
                const jobDept = (job.department || '').toLowerCase();
                const filterDept = department.toLowerCase();
                console.log('Comparing:', jobDept, 'with', filterDept); // Debug log
                return jobDept === filterDept;
            });
        
        console.log('Filtered jobs:', filteredJobs); // Debug log
        
        if (filteredJobs.length === 0) {
            const noJobsMessage = document.createElement('div');
            noJobsMessage.className = 'no-jobs-message';
            noJobsMessage.style.cssText = `
                text-align: center;
                padding: 3rem;
                background: #f8f9fa;
                border-radius: 15px;
                color: #333333;
                width: 100%;
                font-size: 1.2rem;
            `;
            noJobsMessage.innerHTML = '<p>No open positions found in this department.</p>';
            jobListingsContainer.appendChild(noJobsMessage);
            return;
        }
        
        // Create and append job cards
        filteredJobs.forEach(job => {
            console.log('Creating job card for:', job); // Debug log
            const jobCard = createJobCard(job);
            jobCardsContainer.appendChild(jobCard);
        });
        
        // Append the job cards container to the main container
        jobListingsContainer.appendChild(jobCardsContainer);
        console.log('Job cards container appended with', filteredJobs.length, 'cards'); // Debug log
    }
    
    /**
     * Create a job card element
     */
    function createJobCard(job) {
        console.log('Creating card for job:', job); // Debug log
        const card = document.createElement('div');
        card.className = 'job-card animate-fade-up';
        card.style.cssText = `
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 2.5rem;
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
        `;
        
        // Format the experience date if it's a date string
        let experienceText = job.experience;
        if (experienceText && experienceText.includes('T')) {
            try {
                const date = new Date(experienceText);
                experienceText = date.toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                console.log('Error formatting date:', e);
            }
        }
        
        card.innerHTML = `
            <div class="job-header" style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid rgba(4, 76, 76, 0.1);">
                <h3 style="font-size: 1.8rem; color: #044C4C; margin-bottom: 1rem; font-weight: 600; line-height: 1.3;">${job.title || 'Position Available'}</h3>
                <span class="department-badge" style="display: inline-block; padding: 0.6rem 1.2rem; background: rgba(4, 76, 76, 0.1); color: #044C4C; border-radius: 25px; font-size: 0.95rem; font-weight: 500;">${job.department || 'General'}</span>
            </div>
            <div class="job-details" style="margin-bottom: 2rem;">
                <p style="display: flex; align-items: center; margin-bottom: 1rem; color: #333333; font-size: 1.05rem;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 1rem; color: #044C4C; width: 20px; font-size: 1.1rem;"></i> 
                    ${job.location || 'Location TBD'}
                </p>
                <p style="display: flex; align-items: center; margin-bottom: 1rem; color: #333333; font-size: 1.05rem;">
                    <i class="fas fa-clock" style="margin-right: 1rem; color: #044C4C; width: 20px; font-size: 1.1rem;"></i> 
                    ${job.type || 'Full Time'}
                </p>
                <p style="display: flex; align-items: center; margin-bottom: 1rem; color: #333333; font-size: 1.05rem;">
                    <i class="fas fa-briefcase" style="margin-right: 1rem; color: #044C4C; width: 20px; font-size: 1.1rem;"></i> 
                    Experience: ${experienceText || 'Not specified'}
                </p>
            </div>
            <div class="job-description" style="margin-bottom: 2rem; color: #333333; line-height: 1.7; font-size: 1.05rem;">
                <p>${job.description || 'No description available'}</p>
            </div>
            <div class="job-requirements" style="margin-bottom: 2rem;">
                <h4 style="color: #044C4C; margin-bottom: 1rem; font-size: 1.2rem; font-weight: 600;">Requirements:</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${Array.isArray(job.requirements) 
                        ? job.requirements.map(req => `<li style="position: relative; padding-left: 1.8rem; margin-bottom: 0.8rem; color: #333333; font-size: 1.05rem; line-height: 1.5;">${req}</li>`).join('')
                        : `<li style="position: relative; padding-left: 1.8rem; margin-bottom: 0.8rem; color: #333333; font-size: 1.05rem; line-height: 1.5;">${job.requirements || 'Requirements to be determined'}</li>`
                    }
                </ul>
            </div>
            <button class="apply-btn" onclick="openApplicationModal('${job.id || ''}', '${(job.title || 'Position Available').replace(/'/g, "\\'")}')" 
                style="width: 100%; padding: 1.2rem; background: #044C4C; color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px; margin-top: auto;">
                Apply Now
            </button>
        `;
        
        return card;
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        if (jobListingsContainer) {
            jobListingsContainer.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 3rem;
                    background: #fee;
                    border-radius: 15px;
                    color: #c00;
                    margin: 2rem;
                    font-size: 1.1rem;
                ">
                    ${message}
                </div>
            `;
        }
        console.error('Error:', message); // Debug log
    }
    
    /**
     * Hide loading spinner
     */
    function hideLoadingSpinner() {
        const spinner = jobListingsContainer.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
    
    /**
     * Initialize modal controls
     */
    function initModalControls() {
        // Close modal when clicking outside
        const modal = document.querySelector('.application-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeApplicationModal();
                }
            });
            
            // Close modal when clicking close button
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeApplicationModal);
            }
        }
    }
});

/**
 * Open application modal
 */
function openApplicationModal(jobId, jobTitle) {
    const modal = document.querySelector('.application-modal');
    const titleInput = document.getElementById('jobTitle');
    const idInput = document.getElementById('jobId');
    
    if (modal && titleInput && idInput) {
        titleInput.value = jobTitle;
        idInput.value = jobId;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close application modal
 */
function closeApplicationModal() {
    const modal = document.querySelector('.application-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}
