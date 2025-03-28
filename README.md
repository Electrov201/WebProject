# Housing Care - Service With Personal Touch

![Housing Care Logo](images/logo.png)

## Project Overview

Housing Care is a comprehensive website for a housing society management services business. The site is designed to provide potential clients with information about the company's services, values, team, and contact methods. The modern, responsive design ensures a seamless experience across all devices.

## Features

- **Responsive Design**: Fully responsive layout that works on desktops, tablets, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and transitions
- **Service Catalog**: Comprehensive display of all housing management services
- **Dynamic Career Page**: Job listings loaded from Google Sheets for easy updates
- **Contact Forms**: Interactive contact forms for client inquiries
- **Team Showcase**: Profile displays for team members and partners

## Tech Stack

- **HTML5**: Semantic markup for content structure
- **CSS3**: Custom styling with responsive design principles
- **JavaScript**: Interactive elements and dynamic content loading
- **jQuery**: Simplified DOM manipulation and AJAX functionality
- **Font Awesome**: Icon library for visual elements
- **Google Fonts**: Web fonts for typography (Inter and Poppins)

## Project Structure

```
housing-care-website/
├── index.html               # Homepage
├── components/              # Reusable HTML components
│   ├── footer.html          # Site footer
│   └── navbar.html          # Navigation bar
├── pages/                   # Individual pages
│   ├── about.html           # About page with team info
│   ├── services.html        # Services catalog
│   ├── contact.html         # Contact information and form
│   └── career.html          # Career opportunities
├── css/                     # Stylesheets
│   ├── main.css             # Main styles
│   ├── responsive.css       # Media queries for responsive design
│   ├── animations.css       # Animation keyframes and classes
│   └── normalize.css        # CSS reset for cross-browser consistency
├── js/                      # JavaScript files
│   ├── main.js              # Main functionality
│   ├── navigation.js        # Navigation and page loading
│   └── animations.js        # Animation triggers and effects
├── images/                  # Image assets
└── fonts/                   # Custom font files (if any)
```

## Key Features Breakdown

### 1. Service Categories
- Accounting & Financial Services
- Taxation & Compliance Services
- Legal Services
- Facility & Management Services
- AMC & Installation Services
- Insurance Services
- Loan Services
- Solar Services

### 2. Dynamic Career Page
- Real-time job listings from Google Sheets
- Department-based filtering
- Interactive application form
- Resume submission capability

### 3. Contact Information
- Email, phone, and location details
- Interactive contact form
- Google Maps integration

## Setup and Deployment

1. **Local Development**:
   - Clone this repository
   - Open the project in your preferred code editor
   - Use a local server (like Live Server for VS Code) to view the site

2. **Deployment**:
   - Upload all files to your web hosting service
   - Ensure all paths are correctly configured for your domain
   - Set up form handling for contact and application forms

## Maintenance

### Updating Job Listings
The career page is configured to pull job data from a Google Sheet. To update job listings:

1. Update the Google Sheet with new job information
2. Ensure the sheet is published to the web as CSV
3. The changes will automatically appear on the career page

### Adding New Services
To add new services:

1. Update the services.html file with new service information
2. Add corresponding icons and images to the images directory
3. Update the CSS if new styling is needed

## Browser Compatibility

The website is compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Opera (latest)

## License

Copyright © 2025 Housing Care. All rights reserved.

---

Developed with ❤️ for Housing Care - Service With Personal Touch 