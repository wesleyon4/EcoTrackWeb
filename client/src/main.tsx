/**
 * Application Entry Point
 * 
 * This is the main entry file for the Eco-Track-Web application.
 * It initializes the React application, applies global styles, and renders the App component.
 */

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Custom CSS Variables
 * 
 * This section defines the color palette and design tokens for the Eco-Track-Web app.
 * These CSS variables are used throughout the application with Tailwind CSS to maintain
 * a consistent design system focused on sustainable/eco-friendly aesthetics.
 * 
 * The color scheme uses natural greens and teals as primary colors to reinforce
 * the environmental focus of the application.
 */
const styles = document.createElement("style");
styles.textContent = `
  :root {
    /* Primary green colors - used for main actions and branding */
    --primary: 120 39% 34%;        /* A natural green shade */
    --primary-foreground: 0 0% 100%; /* White text on green background */
    
    /* Secondary teal colors - used for supporting elements */
    --secondary: 174 70% 30%;        /* A complementary teal/turquoise */
    --secondary-foreground: 0 0% 100%; /* White text on teal background */
    
    /* Accent/warning colors - used for highlights and alerts */
    --accent: 45 100% 52%;          /* A bright yellow for emphasis */
    --accent-foreground: 0 0% 20%;   /* Dark text on yellow background */
    
    /* Neutral colors - used for backgrounds and text */
    --background: 95 25% 96%;       /* Subtle off-white for main background */
    --foreground: 0 0% 20%;          /* Near-black for text, easier on eyes than pure black */
    
    /* Status colors - used for feedback and alerts */
    --destructive: 0 70% 55%;        /* Red for errors and destructive actions */
    --destructive-foreground: 0 0% 100%; /* White text on red background */
    
    --success: 122 42% 45%;         /* Green for success messages */
    --warning: 32 100% 49%;          /* Orange for warnings */
    --info: 207 90% 54%;             /* Blue for information messages */
    
    /* UI Elements - used for cards, inputs, etc. */
    --card: 0 0% 100%;              /* White for card backgrounds */
    --card-foreground: 0 0% 20%;     /* Dark text on cards */
    --popover: 0 0% 100%;           /* White for popover backgrounds */
    --popover-foreground: 0 0% 20%;  /* Dark text on popovers */
    --muted: 0 0% 88%;              /* Light grey for muted elements */
    --muted-foreground: 0 0% 62%;    /* Darker grey for muted text */
    --border: 0 0% 88%;             /* Light grey for borders */
    --input: 0 0% 88%;              /* Light grey for input backgrounds */
    --ring: 120 39% 34%;            /* Green for focus rings */
    
    /* Chart colors - used for data visualization */
    --chart-1: 120 39% 34%;         /* Primary green */
    --chart-2: 174 70% 30%;         /* Teal */
    --chart-3: 45 100% 52%;         /* Accent yellow */
    --chart-4: 0 70% 55%;           /* Red */
    --chart-5: 207 90% 54%;         /* Blue */
    
    /* Sidebar - special styles for the navigation sidebar */
    --sidebar-background: 0 0% 100%; /* White background */
    --sidebar-foreground: 0 0% 20%;  /* Dark text */
    --sidebar-primary: 120 39% 34%;  /* Green for active items */
    --sidebar-primary-foreground: 0 0% 100%; /* White text on active items */
    --sidebar-accent: 0 0% 96%;      /* Light grey for hover states */
    --sidebar-accent-foreground: 0 0% 20%; /* Dark text on hover states */
    --sidebar-border: 0 0% 88%;      /* Light grey for borders */
    --sidebar-ring: 120 39% 34%;     /* Green for focus rings */
    
    /* Border radius for consistent rounding */
    --radius: 0.5rem;
  }
  
  /* Typography classes for consistent font usage */
  .font-heading {
    font-family: 'Montserrat', sans-serif; /* Clean, modern font for headings */
  }
  
  .font-body {
    font-family: 'Open Sans', sans-serif; /* Highly readable font for body text */
  }
`;

// Apply the styles to the document
document.head.appendChild(styles);

// Initialize the React application by rendering the App component into the root element
createRoot(document.getElementById("root")!).render(<App />);
