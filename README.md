# Housing Care - Service With Personal Touch

![Housing Care Logo](images/logo.png)

## Project Overview

Housing Care is a comprehensive website for a housing society management services business. The site is designed to provide potential clients with information about the company's services, values, team, and contact methods. The modern, responsive design ensures a seamless experience across all devices.

## Features

- **Responsive Design**: Fully responsive layout that works on desktops, tablets, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and transitions
- **Service Catalog**: Comprehensive display of all housing management services
- **Dynamic Career Page**: Job listings loaded from Google Sheets for easy updates
- **Contact Forms**: Interactive contact forms for client inquiries with business hours
- **Team Showcase**: Profile displays for team members and partners
- **Video Backgrounds**: Engaging video backgrounds with overlay effects
- **Glass-morphism Design**: Modern UI elements with glass-like effects
- **Interactive Elements**: Smooth animations and hover effects
- **Google Maps Integration**: Location visualization
- **Component-based Architecture**: Reusable HTML components
- **Legal Documentation**: Privacy Policy and Terms of Service pages
- **Business Hours Display**: Clear information about operational hours

## Tech Stack

- **HTML5**: Semantic markup for content structure
- **CSS3**: Custom styling with responsive design principles
  - Glass-morphism effects
  - CSS Grid and Flexbox layouts
  - Custom animations and transitions
  - Media queries for responsive design
  - CSS variables for consistent theming
- **JavaScript**: Interactive elements and dynamic content loading
  - jQuery for DOM manipulation
  - Custom animations and transitions
  - Form validation
  - Dynamic content loading
- **jQuery**: Simplified DOM manipulation and AJAX functionality
- **Font Awesome**: Icon library for visual elements (Free version under CC BY 4.0)
- **Google Fonts**: Web fonts for typography (Inter and Poppins)
- **Google Sheets API**: Dynamic job listings integration

## Project Structure

```
housing-care-website/
├── index.html               # Homepage with hero section and service highlights
├── components/              # Reusable HTML components
│   ├── footer.html          # Site footer with social links and contact info
│   └── navbar.html          # Navigation bar with responsive menu
├── pages/                   # Individual pages
│   ├── about.html           # About page with team info and company history
│   ├── services.html        # Services catalog with detailed descriptions
│   ├── contact.html         # Contact information, business hours, and form with map
│   ├── career.html          # Career opportunities with dynamic job listings
│   ├── privacy-policy.html  # Privacy policy legal document
│   └── terms.html           # Terms of service legal document
├── css/                     # Stylesheets
│   ├── main.css             # Main styles and common elements
│   ├── responsive.css       # Media queries for responsive design
│   ├── animations.css       # Animation keyframes and classes
│   ├── normalize.css        # CSS reset for cross-browser consistency
│   ├── navbar.css           # Navigation bar specific styles
│   ├── footer.css           # Footer specific styles
│   ├── contact.css          # Contact page specific styles
│   ├── policy.css           # Styles for legal pages (privacy, terms)
│   └── about.css            # About page specific styles
├── js/                      # JavaScript files
│   ├── main.js              # Main functionality and initialization
│   ├── navigation.js        # Navigation and page loading logic
│   └── animations.js        # Animation triggers and effects
├── images/                  # Image assets
│   ├── logo.png             # Company logo
│   ├── Buildings.mp4        # Hero section video
│   └── video-poster.jpg     # Video poster image
└── fonts/                   # Custom font files (if any)
```

## Key Features Breakdown

### 1. Service Categories
- Accounting & Financial Services
  - Bookkeeping and maintenance billing
  - Financial statements and budget forecasting
- Taxation & Compliance Services
  - Tax filing and GST services
  - Business compliance and payroll processing
- Legal Services
  - Society registration
  - Dispute resolution
  - Property law services
- Facility & Management Services
  - Professional facility managers
  - Security and housekeeping
- AMC & Installation Services
  - Maintenance contracts
  - System installations
- Insurance Services
  - Building and lift insurance
  - Fire and health insurance
- Loan Services
  - Personal and home loans
  - Education and vehicle loans
- Solar Services
  - Panel installation
  - Net metering
  - Government subsidy assistance

### 2. Dynamic Career Page
- Real-time job listings from Google Sheets
- Department-based filtering
- Interactive application form
- Resume submission capability
- Job description templates
- Application tracking system

### 3. Contact Information & Business Hours
The contact page features a modern, engaging design with:
- Full-screen video background with overlay
- Glass-morphism contact cards with hover effects
- Business hours section showing operating days and times
- Friday closed hours clearly marked
- Responsive grid layout for contact information
- Interactive elements with smooth animations
- Google Maps integration for location
- Contact form with validation
- Mobile-friendly design
- Social media integration

### 4. Legal Documentation
- Privacy Policy page detailing data collection practices
- Terms of Service page outlining usage terms
- Mobile-responsive legal document design
- Clear, well-structured sections
- Contact information for legal inquiries
- Last updated timestamps
- Professional legal language appropriate for a static frontend website

### 5. Design Features
- Glass-morphism effects for modern UI
- Video backgrounds with gradient overlays
- Grid patterns for visual interest
- Smooth animations and transitions
- Responsive layouts for all devices
- Interactive hover effects
- Custom icon containers
- Typography optimization
- Consistent color scheme
- Accessibility considerations

## Setup and Deployment

1. **Local Development**:
   - Clone this repository
   - Open the project in your preferred code editor
   - Use a local server (like Live Server for VS Code) to view the site
   - Ensure all dependencies are properly loaded

2. **Deployment**:
   - Upload all files to your web hosting service
   - Ensure all paths are correctly configured for your domain
   - Set up form handling for contact and application forms
   - Configure Google Sheets API for job listings
   - Test all interactive features
   - Verify responsive design on various devices

## Maintenance

### Updating Job Listings
The career page is configured to pull job data from a Google Sheet. To update job listings:

1. Update the Google Sheet with new job information
2. Ensure the sheet is published to the web as CSV
3. The changes will automatically appear on the career page
4. Test the display on both desktop and mobile views

### Adding New Services
To add new services:

1. Update the services.html file with new service information
2. Add corresponding icons and images to the images directory
3. Update the CSS if new styling is needed
4. Test the new service section across all devices
5. Update the service grid layout if necessary

### Updating Business Hours
To modify the business hours displayed on the contact page:

1. Edit the hours-grid section in contact.html
2. Update the weekday and Friday hours as needed
3. Test the appearance on both desktop and mobile views

### Content Updates
For general content updates:

1. Edit the respective HTML files
2. Update images in the images directory
3. Test the changes across different devices
4. Verify all links and interactive elements
5. Check for any broken dependencies

## Browser Compatibility

The website is compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Performance Optimization

- Optimized images and videos
- Minified CSS and JavaScript files
- Lazy loading for images and videos
- Efficient CSS animations
- Responsive image loading
- Browser caching implementation

## Security Measures

- Form validation
- Secure API endpoints
- HTTPS implementation
- Input sanitization
- XSS protection
- CSRF protection

## External Dependencies

- **Font Awesome 6.5.1**: Used for icons (Free version under CC BY 4.0 license)
- **Google Fonts**: Inter and Poppins fonts
- **jQuery 3.7.1**: JavaScript library for DOM manipulation
- **Google Maps API**: For location embed on contact page

## License

Copyright © 2025 Housing Care. All rights reserved.

---

Developed with ❤️ for Housing Care - Service With Personal Touch 