/**
 * Enhanced Google Apps Script for Housing Care Career Page
 * This script connects the website to Google Sheets for job listings and applications
 * 
 * INSTRUCTIONS:
 * 1. Copy this entire script to Google Apps Script editor
 * 2. Deploy as web app (Deploy > New deployment)
 * 3. Set "Execute as" to "Me" and "Who has access" to "Anyone"
 * 4. Use the provided deployment URL in your website
 */

// Email to receive notifications (optional)
//const ADMIN_EMAIL = 'housingcare26@gmail.com';

/**
 * Handles GET requests to return job listings - Main entry point
 */
function doGet(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Set CORS headers
  output = setCorsHeaders(output, e);
  
  try {
    console.log("Request from origin:", e.origin || "Unknown origin");
    
    // Get the sheet data
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("JobListings");
    
    if (!sheet) {
      return output.setContent(JSON.stringify({
        status: "error",
        message: "JobListings sheet not found in the spreadsheet"
      }));
    }
    
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return output.setContent(JSON.stringify({
        status: "error",
        message: "No job listings found in the spreadsheet"
      }));
    }
    
    var headers = data[0];
    var jsonData = [];
    
    // Convert sheet data to JSON
    for(var i = 1; i < data.length; i++) {
      var row = data[i];
      var record = {};
      
      // Map each column to the appropriate field
      for(var j = 0; j < headers.length; j++) {
        var header = headers[j].toString().trim();
        
        switch(header.toLowerCase()) {
          case 'id':
            record.id = row[j];
            break;
          case 'title':
            record.title = row[j];
            break;
          case 'department':
            record.department = row[j];
            break;
          case 'location':
            record.location = row[j];
            break;
          case 'salary':
            record.salary = row[j];
            break;
          case 'jobtype':
            record.jobType = row[j];
            break;
          case 'posteddate':
            record.postedDate = row[j];
            break;
          case 'description':
            record.description = row[j];
            break;
          case 'requirements':
            record.requirements = row[j];
            break;
          case 'active':
            // Handle different formats of "true" values from Excel/Google Sheets
            record.active = (row[j] === true || row[j] === 'TRUE' || row[j] === 'true' || row[j] === 'True');
            break;
          default:
            // Include any other columns in the response
            record[header] = row[j];
        }
      }
      
      // Only include jobs that are marked as active
      if(record.active === true) {
        jsonData.push(record);
      }
    }
    
    console.log("Returning " + jsonData.length + " active job listings");
    
    // Return the JSON data
    return output.setContent(JSON.stringify({
      status: "success",
      data: jsonData,
      timestamp: new Date().toISOString()
    }));
    
  } catch(error) {
    console.error("Error in doGet:", error.toString());
    return output.setContent(JSON.stringify({
      status: "error",
      message: "Failed to fetch job listings: " + error.toString()
    }));
  }
}

/**
 * Handles POST requests for job applications
 */
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  output = setCorsHeaders(output, e);
  
  try {
    console.log("doPost called with content");
    
    // Parse the form data
    var formData = JSON.parse(e.postData.contents);
    
    // Log the application in the Applications sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Applications");
    
    if (!sheet) {
      // Create Applications sheet if it doesn't exist
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Applications");
      sheet.appendRow([
        "timestamp", "jobId", "jobTitle", "fullName", "email", "phone", 
        "experience", "coverLetter", "source"
      ]);
    }
    
    sheet.appendRow([
      new Date(), // timestamp
      formData.jobId || "Unknown",
      formData.jobTitle || "Unknown",
      formData.fullName || "Unknown", 
      formData.email || "Unknown",
      formData.phone || "Unknown",
      formData.experience || "Unknown",
      formData.coverLetter || "Unknown",
      formData.source || "Unknown"
    ]);
    
    // Return success response
    return output.setContent(JSON.stringify({
      status: "success",
      message: "Application submitted successfully",
      timestamp: new Date().toISOString()
    }));
    
  } catch(error) {
    console.error("Error processing application:", error.toString());
    
    return output.setContent(JSON.stringify({
      status: "error",
      message: "Failed to process application: " + error.toString()
    }));
  }
}

/**
 * Set CORS headers to allow approved domains
 */
function setCorsHeaders(output, e) {
  // Allow for development - IMPORTANT: Restrict this for production
  output.setHeader('Access-Control-Allow-Origin', '*');
  
  // If you want to restrict to specific origins, uncomment this code:
  /*
  if (e && e.origin) {
    if (ALLOWED_ORIGINS.indexOf(e.origin) !== -1) {
      output.setHeader('Access-Control-Allow-Origin', e.origin);
    } else {
      output.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
    }
  } else {
    output.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  */
  
  // Common CORS headers
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return output;
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  var output = ContentService.createTextOutput('');
  output = setCorsHeaders(output, e);
  return output;
} 