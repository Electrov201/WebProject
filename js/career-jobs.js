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
    
    // Google Apps Script URL - Updated to the new URL
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyfdSOU43czlvM7P13yMwjG5KQCcpxp3pn1K47JVP_-3ft93qKN364Z9wr5gcZ_lIgXNA/exec';
    
    // Cache for job listings - make it accessible to other scripts
    window.jobListings = [];
    
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
            
            // Set a timeout to use fallback data if the API doesn't respond
            const timeoutId = setTimeout(() => {
                console.log('API timeout - using fallback data');
                window.jobListings = getFallbackData();
                displayJobListings('all');
            }, 5000); // 5 second timeout
            
            fetchJobListings(timeoutId);
        } else {
            console.error('Job listings container not found!'); // Debug log
            window.jobListings = getFallbackData();
            displayJobListings('all');
        }
    }
    
    /**
     * Get fallback data from the Google Sheet
     */
    function getFallbackData() {
        // Return empty array instead of demo data
        return [];
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
    function fetchJobListings(timeoutId) {
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
            
            // Clear the timeout since we got a response
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            try {
                if (response && response.status === 'success' && Array.isArray(response.data)) {
                    // Process the data from Google Sheet
                    window.jobListings = response.data.map(job => {
                        // Format experience if it's a date string
                        let experienceText = job.Experience;
                        if (experienceText && typeof experienceText === 'string' && experienceText.includes('T')) {
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
                        
                        return {
                            id: job.id || '',
                            title: job.Title || '',
                            department: job.Department || '',
                            location: job.Location || '',
                            type: job.Type || '',
                            experience: experienceText || '',
                            description: job.Description || 'No description available',
                            requirements: job.Requirement || 'No specific requirements listed'
                        };
                    });
                    
                    console.log('Number of jobs loaded:', window.jobListings.length); // Debug log
                    console.log('Job data:', window.jobListings); // Debug log
                    displayJobListings('all');
                } else {
                    console.error('Invalid response format:', response); // Debug log
                    window.jobListings = getFallbackData();
                    displayJobListings('all');
                }
            } catch (error) {
                console.error('Error processing job listings:', error);
                window.jobListings = getFallbackData();
                displayJobListings('all');
            } finally {
                // Clean up
                delete window[callbackName];
                document.body.removeChild(script);
            }
        };
        
        // Handle script load error
        script.onerror = function() {
            console.error('Failed to load script:', SHEET_URL);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.jobListings = getFallbackData();
            displayJobListings('all');
            delete window[callbackName];
        };
        
        // Add the script to the document
        document.body.appendChild(script);
    }
    
    /**
     * Display job listings based on department filter
     */
    function displayJobListings(department) {
        console.log('Displaying job listings for department:', department); // Debug log
        
        if (!jobListingsContainer) {
            console.error('Job listings container not found!');
            return;
        }
        
        // Clear the container
        jobListingsContainer.innerHTML = '';
        
        // Filter jobs by department if not 'all'
        let filteredJobs = window.jobListings;
        if (department !== 'all') {
            filteredJobs = window.jobListings.filter(job => 
                job.department.toLowerCase() === department.toLowerCase()
            );
        }
        
        console.log('Filtered jobs:', filteredJobs); // Debug log
        
        // If no jobs found, display a message
        if (filteredJobs.length === 0) {
            jobListingsContainer.innerHTML = `
                <div class="no-jobs-message" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #044C4C;"></i>
                    <h3>No positions found</h3>
                    <p>We don't have any open positions in this department at the moment.</p>
                    <p>Please check back later or submit your resume for future opportunities.</p>
                </div>
            `;
            return;
        }
        
        // Create and append job cards
        filteredJobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobListingsContainer.appendChild(jobCard);
        });
    }
    
    /**
     * Create a job card element
     */
    function createJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.style.cssText = 'background: white; border-radius: 10px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border-left: 4px solid #044C4C; transition: all 0.3s ease;';
        
        jobCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div>
                    <h3 style="color: #044C4C; margin: 0 0 5px 0; font-size: 1.4rem;">${job.title}</h3>
                    <div style="display: flex; gap: 15px; color: #666; font-size: 0.9rem;">
                        <span><i class="fas fa-building" style="margin-right: 5px;"></i>${job.department}</span>
                        <span><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>${job.location}</span>
                        <span><i class="fas fa-clock" style="margin-right: 5px;"></i>${job.type}</span>
                    </div>
                </div>
                <button class="apply-btn" data-job-id="${job.id}" data-job-title="${job.title}" style="background: #044C4C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                    Apply Now
                </button>
            </div>
            <p style="color: #444; line-height: 1.6; margin-bottom: 15px;">${job.description}</p>
            <div style="display: flex; gap: 10px;">
                <a href="#" class="view-details" style="color: #044C4C; text-decoration: none; font-weight: 500; display: flex; align-items: center;">
                    <i class="fas fa-info-circle" style="margin-right: 5px;"></i> View Details
                </a>
            </div>
        `;
        
        // Add event listener to apply button
        const applyBtn = jobCard.querySelector('.apply-btn');
        applyBtn.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            const jobTitle = this.getAttribute('data-job-title');
            
            // Redirect to Google Form with job details
            window.open(`https://docs.google.com/forms/d/e/1FAIpQLScdcnussNmTn8SUZo6Zog8vn7pIOGD0ASm3Qch_dUNR0zc2EQ/viewform?usp=pp_url&entry.1234567890=${encodeURIComponent(jobTitle)}`, '_blank');
        });
        
        // Add event listener to view details link
        const viewDetailsLink = jobCard.querySelector('.view-details');
        viewDetailsLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Implement view details functionality
            alert('Job details will be displayed here.');
        });
        
        return jobCard;
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        if (jobListingsContainer) {
            jobListingsContainer.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem; color: #d9534f;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button id="retryButton" style="background: #044C4C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 500; margin-top: 1rem;">
                        Try Again
                    </button>
                </div>
            `;
            
            // Add event listener to retry button
            const retryButton = document.getElementById('retryButton');
            if (retryButton) {
                retryButton.addEventListener('click', function() {
                    initJobListings();
                });
            }
        }
    }
    
    /**
     * Hide loading spinner
     */
    function hideLoadingSpinner() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
    
    /**
     * Initialize modal controls
     */
    function initModalControls() {
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modal = document.querySelector('.application-modal');
            if (event.target === modal) {
                closeApplicationModal();
            }
        });
        
        // Close modal when clicking close button
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', closeApplicationModal);
        });
    }
    
    /**
     * Open application modal
     */
    function openApplicationModal(jobId, jobTitle) {
        const modal = document.querySelector('.application-modal');
        if (modal) {
            // Set job details in the form
            document.getElementById('jobId').value = jobId;
            document.getElementById('jobTitle').value = jobTitle;
            
            // Show the modal
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
});
