// Base Colors
// Primary: Deep blue (#1F3A93)
// Secondary: Light blue (#4C83FF)
// Accent: Orange (#FF6B6B)
// Background: Off-white (#F8F9FA)
// Text: Dark gray (#333333)

// Container Classes
export const containerClasses = {
  // Main page container
  pageContainer: "min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8",
  
  // Content container with max width
  contentContainer: "mt-2 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto",

  // Banner
  banner: "h-14 sm:h-20 lg:h-24 w-full my-3 bg-blue-900 rounded-lg px-4 flex items-center justify-center",
  
  // Card container with shadow
  cardContainer: "bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 w-full",

  // Card container with shadow
  smallCardContainer: "bg-blue-50 rounded-lg shadow-lg p-2 sm:p-2 lg:p-4 w-full",
  
  // Section container
  sectionContainer: "mb-6 sm:mb-8 lg:mb-10",
  
  // Two column layout (for desktop)
  twoColumnContainer: "lg:grid lg:grid-cols-2 lg:gap-8",
};

// Typography Classes
export const typographyClasses = {
  // Page title
  pageTitle: "text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-800 text-center mb-6",

  // Banner title
  bannerText: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-montserrat",
  bannerTextNormal: "text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white",
  
  // Section title
  sectionTitle: "text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-800 mb-4",
  
  // Form labels
  formLabel: "block text-sm font-medium text-gray-700 mb-2",
  
  // Regular paragraph text
  bodyHeader: "text-md sm:text-lg lg:text-xl font-semibold text-gray-600",
  
  // Regular paragraph text
  bodyText: "text-base text-gray-600",
  
  // Small text / helper text
  smallText: "text-xs sm:text-sm lg:text-sm text-gray-500 font-montserrat",
  smallTextNormal: "text-xs sm:text-sm lg:text-sm text-gray-500",
  
  // Link text
  linkText: "text-blue-600 hover:text-blue-800 underline transition-colors duration-200",

  // Message
  messageText: "mt-2 text-sm sm:text-sm lg:text-md text-orange-800",
};

// Font Classes
export const fontClasses = {  
  // Sans-serif fonts
  sans: "font-sans", // Default sans-serif stack
  montserrat: "font-['Montserrat',sans-serif]",
}

// Form Element Classes
export const formClasses = {
  // Form container
  formContainer: "space-y-4 sm:space-y-5 lg:space-y-6",
  
  // Form group
  formGroup: "space-y-1 mb-4",
  
  // Text input
  input: "mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
  
  // Select dropdown
  select: "mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm",
  
  // Checkbox container
  checkboxContainer: "flex items-center",
  
  // Checkbox input
  checkbox: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
  
  // Radio button container
  radioContainer: "flex items-center",
  
  // Radio input
  radio: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300",
  
  // Invalid/error field
  inputError: "mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm",
  
  // Error message
  errorText: "mt-2 text-sm text-red-600",
};

// Button Classes
export const buttonClasses = {
  // Primary button (blue)
  primaryButton: "w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200",
  
  // Secondary button (light blue)
  secondaryButton: "w-full flex justify-center mt-4 py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200",
  
  // Accent button (orange)
  accentButton: "w-full flex justify-center mt-4 py-2 px-4 border border-orange-500 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200",
  
  // Text button (no background)
  textButton: "text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200",
  
  // Disabled button
  disabledButton: "w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-300 cursor-not-allowed",
};