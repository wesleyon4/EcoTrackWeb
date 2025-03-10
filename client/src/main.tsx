import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom tailwind styles to match design
const styles = document.createElement("style");
styles.textContent = `
  :root {
    /* Primary green colors */
    --primary: 120 39% 34%;
    --primary-foreground: 0 0% 100%;
    
    /* Secondary teal colors */
    --secondary: 174 70% 30%;
    --secondary-foreground: 0 0% 100%;
    
    /* Accent/warning colors */
    --accent: 45 100% 52%;
    --accent-foreground: 0 0% 20%;
    
    /* Neutral colors */
    --background: 95 25% 96%;
    --foreground: 0 0% 20%;
    
    /* Status colors */
    --destructive: 0 70% 55%;
    --destructive-foreground: 0 0% 100%;
    
    --success: 122 42% 45%;
    --warning: 32 100% 49%;
    --info: 207 90% 54%;
    
    /* UI Elements */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 20%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 20%;
    --muted: 0 0% 88%;
    --muted-foreground: 0 0% 62%;
    --border: 0 0% 88%;
    --input: 0 0% 88%;
    --ring: 120 39% 34%;
    
    /* Chart colors */
    --chart-1: 120 39% 34%;
    --chart-2: 174 70% 30%;
    --chart-3: 45 100% 52%;
    --chart-4: 0 70% 55%;
    --chart-5: 207 90% 54%;
    
    /* Sidebar */
    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 0 0% 20%;
    --sidebar-primary: 120 39% 34%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 0 0% 96%;
    --sidebar-accent-foreground: 0 0% 20%;
    --sidebar-border: 0 0% 88%;
    --sidebar-ring: 120 39% 34%;
    
    --radius: 0.5rem;
  }
  
  .font-heading {
    font-family: 'Montserrat', sans-serif;
  }
  
  .font-body {
    font-family: 'Open Sans', sans-serif;
  }
`;

document.head.appendChild(styles);

createRoot(document.getElementById("root")!).render(<App />);
