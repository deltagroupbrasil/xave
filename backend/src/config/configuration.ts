export default () => ({
  // Application
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'flerte_user',
    password: process.env.DB_PASSWORD || 'flerte_password_dev',
    name: process.env.DB_NAME || 'flerte_gamificado',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  // AI Services
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 1000,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    whisperModel: process.env.WHISPER_MODEL || 'whisper-1',
    visionModel: process.env.VISION_MODEL || 'gpt-4-vision-preview',
  },

  // Storage (MinIO/S3)
  storage: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost:9000',
    accessKey: process.env.MINIO_ACCESS_KEY || 'flerte_minio',
    secretKey: process.env.MINIO_SECRET_KEY || 'flerte_minio_password',
    bucketName: process.env.MINIO_BUCKET_NAME || 'flerte-media',
    useSSL: process.env.MINIO_USE_SSL === 'true',
  },

  // Payment Gateways
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  pagarme: {
    apiKey: process.env.PAGARME_API_KEY,
    encryptionKey: process.env.PAGARME_ENCRYPTION_KEY,
  },

  // WhatsApp Business API
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  },

  // Email
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'noreply@flertegamificado.com',
    supportEmail: process.env.SUPPORT_EMAIL || 'suporte@flertegamificado.com',
  },

  // Firebase (Push Notifications)
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },

  // Social Login
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  apple: {
    clientId: process.env.APPLE_CLIENT_ID,
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY,
  },

  // Analytics & Monitoring
  mixpanel: {
    token: process.env.MIXPANEL_TOKEN,
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    whatsappMax: parseInt(process.env.RATE_LIMIT_WHATSAPP_MAX, 10) || 50,
  },

  // Content Moderation
  moderation: {
    openaiEnabled: process.env.OPENAI_MODERATION_ENABLED === 'true',
    customEnabled: process.env.CUSTOM_MODERATION_ENABLED === 'true',
  },

  // Development
  development: {
    debugMode: process.env.DEBUG_MODE === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    enableSwagger: process.env.ENABLE_SWAGGER !== 'false',
    corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001',
  },
});
