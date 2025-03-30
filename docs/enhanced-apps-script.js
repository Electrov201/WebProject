/**
 * Enhanced Google Apps Script for secure Housing Care Career Page integration
 * This script connects the website to Google Sheets for job listings and applications
 * with additional security features
 */

// Allowed domains that can access this API
// Add your website domain here
const ALLOWED_ORIGINS = [
  'https://your-website-domain.com',
  'https://www.your-website-domain.com',
  // Development and testing domains
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
  'https://housing-care.netlify.app',
  'https://housingcare.com',
  'https://www.housingcare.com',
  'file://',  // For local HTML files
  'null',     // For local file access in some browsers
  '',         // Empty origin (for testing)
  // Add your production domain here once deployed
];

// Email to receive notifications (optional)
const ADMIN_EMAIL = 'housingcare26@gmail.com';

// Security token validation settings
const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Checks if the request origin is allowed
 * @param {Object} e - The event object from the HTTP request
 * @return {boolean} Whether the origin is allowed
 */
function isOriginAllowed(e) {
  // If no origin header, allow for direct access
  if (!e.origin) return true;
  
  // Check against allowed domains
  return ALLOWED_ORIGINS.indexOf(e.origin) !== -1;
}

/**
 * Set CORS headers for cross-domain requests
 * @param {Object} output - The content service output
 * @param {Object} e - The event object from the HTTP request
 * @return {Object} The output with CORS headers
 */
function setCorsHeaders(output, e) {
  // Get the request origin
  var origin = e.origin || '*';
  
  // Only allow specific origins
  if (isOriginAllowed(e)) {
    output.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    output.setHeader('Access-Control-Allow-Origin', 'null');
  }
  
  // Set additional CORS headers
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  output.setHeader('Access-Control-Max-Age', '3600');
  output.setHeader('X-Content-Type-Options', 'nosniff');
  output.setHeader('Content-Security-Policy', "default-src 'none'");
  
  return output;
}

/**
 * Handles OPTIONS requests for CORS preflight
 * @param {Object} e - The event object from the HTTP request
 * @return {Object} The response with CORS headers
 */
function doOptions(e) {
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  
  // Set CORS headers
  output = setCorsHeaders(output, e);
  
  return output;
}

/**
 * Handles GET requests to return job listings
 * @param {Object} e - The event object from the HTTP request
 * @return {Object} JSON response with job listings
 */
function doGet(e) {
  // Create output with JSON MIME type
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Set CORS headers
  output = setCorsHeaders(output, e);
  
  try {
    // Check origin for security
    if (!isOriginAllowed(e)) {
      return output.setContent(JSON.stringify({
        status: "error",
        message: "Origin not allowed"
      }));
    }
    
    // Rate limiting - get client IP
    var clientIP = e.userAgent || 'unknown';
    var cache = CacheService.getScriptCache();
    var cacheKey = 'rateLimit_' + clientIP;
    var currentRequests = cache.get(cacheKey);
    
    // Allow 10 requests per minute
    if (currentRequests && parseInt(currentRequests) >= 10) {
      return output.setContent(JSON.stringify({
        status: "error",
        message: "Rate limit exceeded. Please try again later."
      }));
    }
    
    // Update rate limiting counter
    if (currentRequests) {
      cache.put(cacheKey, parseInt(currentRequests) + 1, 60); // 60 seconds expiry
    } else {
      cache.put(cacheKey, 1, 60);
    }
    
    // Get the sheet data
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("JobListings");
    var data = sheet.getDataRange().getValues();
    
    var headers = data[0];
    var jsonData = [];
    
    // Convert sheet data to JSON
    for(var i = 1; i < data.length; i++) {
      var row = data[i];
      var record = {};
      
      for(var j = 0; j < headers.length; j++) {
        record[headers[j]] = row[j];
      }
      
      // Only include jobs that are marked as active
      if(record.active !== false) {
        // Sanitize job data for security
        record = sanitizeJobData(record);
        jsonData.push(record);
      }
    }
    
    // Log access for monitoring
    Logger.log("Job listings accessed by IP: " + clientIP);
    
    // Return the JSON data
    return output.setContent(JSON.stringify({
      status: "success",
      data: jsonData,
      timestamp: new Date().toISOString()
    }));
    
  } catch(error) {
    Logger.log("Error in doGet: " + error.toString());
    return output.setContent(JSON.stringify({
      status: "error",
      message: "Failed to fetch job listings"
    }));
  }
}

/**
 * Handles POST requests for job applications
 * @param {Object} e - The event object from the HTTP request
 * @return {Object} JSON response with result of application submission
 */
function doPost(e) {
  // Create output with JSON MIME type
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Set CORS headers
  output = setCorsHeaders(output, e);
  
  try {
    // Check origin for security
    if (!isOriginAllowed(e)) {
      return output.setContent(JSON.stringify({
        status: "error",
        message: "Origin not allowed"
      }));
    }
    
    // Parse the form data
    var formData = JSON.parse(e.postData.contents);
    
    // Validate security token/timestamp
    if (formData.securityToken) {
      try {
        // Decode the token (which is an encoded timestamp)
        var timestamp = atob(formData.securityToken);
        var tokenTime = parseInt(timestamp);
        var currentTime = Date.now();
        
        // Check if token is expired (5 minutes)
        if (isNaN(tokenTime) || currentTime - tokenTime > TOKEN_EXPIRY_MS) {
          return output.setContent(JSON.stringify({
            status: "error",
            message: "Security token expired. Please refresh the page and try again."
          }));
        }
      } catch (tokenError) {
        return output.setContent(JSON.stringify({
          status: "error",
          message: "Invalid security token"
        }));
      }
    } else {
      return output.setContent(JSON.stringify({
        status: "error",
        message: "Security token missing"
      }));
    }
    
    // Validate form data
    var validationResult = validateFormData(formData);
    if (!validationResult.valid) {
      return output.setContent(JSON.stringify({
        status: "error",
        message: validationResult.message
      }));
    }
    
    // Sanitize form data
    formData = sanitizeFormData(formData);
    
    // Log the application in the Applications sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Applications");
    sheet.appendRow([
      new Date(), // timestamp
      formData.jobId,
      formData.jobTitle,
      formData.fullName, 
      formData.email,
      formData.phone,
      formData.experience,
      formData.coverLetter
    ]);
    
    // Email notification (optional)
    if (ADMIN_EMAIL) {
      sendEmailNotification(formData);
    }
    
    // Log successful application
    Logger.log("New application submitted for: " + formData.jobTitle);
    
    // Return success response
    return output.setContent(JSON.stringify({
      status: "success",
      message: "Application submitted successfully",
      timestamp: new Date().toISOString(),
      reference: Utilities.getUuid()
    }));
    
  } catch(error) {
    // Log the error
    Logger.log("Error processing application: " + error.toString());
    
    // Return error response
    return output.setContent(JSON.stringify({
      status: "error",
      message: "Failed to process application. Please try again later."
    }));
  }
}

/**
 * Validates form data for required fields and format
 * @param {Object} formData - The form data to validate
 * @return {Object} Validation result with valid flag and message
 */
function validateFormData(formData) {
  // Required fields
  var requiredFields = ['jobId', 'jobTitle', 'fullName', 'email', 'phone', 'experience', 'coverLetter'];
  
  for (var i = 0; i < requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!formData[field] || formData[field].toString().trim() === '') {
      return {
        valid: false,
        message: "Missing required field: " + field
      };
    }
  }
  
  // Email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return {
      valid: false,
      message: "Invalid email format"
    };
  }
  
  return {
    valid: true
  };
}

/**
 * Sanitizes form data to prevent XSS and injection attacks
 * @param {Object} formData - The form data to sanitize
 * @return {Object} Sanitized form data
 */
function sanitizeFormData(formData) {
  // Helper function to sanitize strings
  function sanitizeString(str) {
    if (!str) return '';
    
    // Convert to string if not already
    str = str.toString();
    
    // Basic HTML entity encoding
    str = str.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#x27;')
             .replace(/\//g, '&#x2F;');
    
    return str;
  }
  
  // Create a new object to avoid modifying the original
  var sanitized = {};
  
  // Sanitize each field
  for (var key in formData) {
    if (formData.hasOwnProperty(key)) {
      sanitized[key] = sanitizeString(formData[key]);
    }
  }
  
  return sanitized;
}

/**
 * Sanitizes job data for public display
 * @param {Object} jobData - The job data to sanitize
 * @return {Object} Sanitized job data
 */
function sanitizeJobData(jobData) {
  // Create a new object to avoid modifying the original
  var sanitized = {};
  
  // Helper function to sanitize strings
  function sanitizeString(str) {
    if (!str) return '';
    
    // Convert to string if not already
    str = str.toString();
    
    // For fields that should contain HTML (like description and requirements)
    // we'll use a whitelist approach to allow certain tags
    if (str.indexOf('<') !== -1) {
      // Only allow specific HTML tags
      str = str.replace(/<(?!\/?(p|br|ul|ol|li|strong|em|a|h[1-6]|span)\b)[^>]+>/gi, '');
      
      // Remove potentially dangerous attributes
      str = str.replace(/(on\w+|style|class|id)="[^"]*"/gi, '');
      
      // Remove javascript: URLs
      str = str.replace(/href="javascript:[^"]*"/gi, 'href="#"');
    }
    
    return str;
  }
  
  // Sanitize each field
  for (var key in jobData) {
    if (jobData.hasOwnProperty(key)) {
      // Special handling for HTML fields
      if (key === 'description' || key === 'requirements') {
        sanitized[key] = sanitizeString(jobData[key]);
      } else {
        // For other fields, basic sanitization
        sanitized[key] = sanitizeString(jobData[key]);
      }
    }
  }
  
  return sanitized;
}

/**
 * Sends an email notification about new application
 * @param {Object} formData - The job application data
 */
function sendEmailNotification(formData) {
  if (!ADMIN_EMAIL) return;
  
  var subject = "New Job Application: " + formData.jobTitle;
  var body = "New application received:\n\n" +
             "Job: " + formData.jobTitle + "\n" +
             "Job ID: " + formData.jobId + "\n" +
             "Applicant: " + formData.fullName + "\n" +
             "Email: " + formData.email + "\n" +
             "Phone: " + formData.phone + "\n" +
             "Experience: " + formData.experience + "\n\n" +
             "Cover Letter:\n" + formData.coverLetter + "\n\n" +
             "Timestamp: " + new Date().toString() + "\n" +
             "Reference: " + Utilities.getUuid();
  
  try {
    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
    Logger.log("Email notification sent to " + ADMIN_EMAIL);
  } catch (error) {
    Logger.log("Failed to send email notification: " + error.toString());
  }
} 