// Application configuration constants
export const AppConfig = {
  APP_NAME: 'Rathi Dental Nest',
  APP_VERSION: '0.0.1',
  
  // Database
  DATABASE_NAME: 'RathiDental.db',
  DATABASE_VERSION: 1,
  
  // API Configuration (for future use)
  API_BASE_URL: 'https://api.rathidental.com',
  API_TIMEOUT: 30000, // 30 seconds
  
  // Storage
  STORAGE_KEYS: {
    USER_TOKEN: '@rathi_dental_token',
    USER_DATA: 'user',//'@rathi_dental_user',
    THEME_MODE: '@rathi_dental_theme',
    NOTIFICATIONS_ENABLED: '@rathi_dental_notifications',
  },
  
  // Features
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_GAMES: true,
    ENABLE_VIDEO_LIBRARY: true,
    ENABLE_APPOINTMENTS: true,
  },
  
  // Pagination
  ITEMS_PER_PAGE: 20,
  
  // Image
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/jpg'],
  
  // Video
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_VIDEO_FORMATS: ['video/mp4', 'video/avi', 'video/mov'],
  
  // Reminders
  REMINDER_TIMES: {
    MORNING_BRUSH: '08:00',
    EVENING_BRUSH: '21:00',
    FLOSS: '08:15',
  },
  
  // Contact
  CLINIC_INFO: {
    name: 'Rathi Dental Nest',
    phone: '+91-XXXXXXXXXX',
    email: 'info@rathidental.com',
    address: 'Dr. D.Y. Patil Dental College and Hospital, Pimpri, Pune',
    website: 'https://www.rathidental.com',
  },
};
