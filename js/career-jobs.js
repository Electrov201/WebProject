// career-jobs.js - Handles fetching and displaying job listings

/**
 * Secure Job Listings Fetcher
 * This script fetches job openings from Google Sheets via Google Apps Script
 * using the POST method for enhanced security.
 */

document.addEventListener('DOMContentLoaded', function() {
    const jobListingsContainer = document.getElementById('jobListings');
    const jobFilters = document.querySelectorAll('.filter-btn');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i><span>Loading job openings...</span>';
    
    let allJobs = [];
    let currentFilter = 'all';
    
    // Initialize job listings
    initJobListings();
    
    // Initialize filter buttons
    initFilterButtons();
    
    // Initialize modal close button
    initModalControls();
    
    /**
     * Initializes job listings by fetching from Google Apps Script
     */
    function initJobListings() {
        if (jobListingsContainer) {
            jobListingsContainer.innerHTML = '';
            jobListingsContainer.appendChild(loadingSpinner);
            
            // Fetch jobs data from Google Sheets via Apps Script
            fetchJobsSecurely();
        }
    }
    
    /**
     * Fetch jobs data securely using POST method
     */
    function fetchJobsSecurely() {
        // Show loading spinner
        showLoadingSpinner();
        
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwFsZbdH5pP5nJ2But6_Adc0vDkDlyvbAvdoG9YoYm_xEaQXFA832LTFX4a1RCLeZwCtA/exec';
        
        console.log('Fetching jobs from:', scriptUrl);
        
        // Make the fetch request using POST method
        fetch(scriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request: 'getJobs' }) // Securely sending request type
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Jobs data received:', data);
            
            if (data.status === 'success' && data.data && Array.isArray(data.data)) {
                // Hide loading spinner and display the jobs
                hideLoadingSpinner();
                displayJobs(data.data);
            } else {
                // Handle empty or invalid data
                hideLoadingSpinner();
                handleError('No job listings found or invalid data format');
            }
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            hideLoadingSpinner();
            handleError(`Failed to load job listings: ${error.message}`);
        });
    }
    
    // Other functions remain unchanged...
});
