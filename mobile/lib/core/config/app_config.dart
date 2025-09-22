import 'package:flutter/foundation.dart';

class AppConfig {
  static const String appName = 'Flerte Gamificado';
  static const String appVersion = '1.0.0';
  static const String packageName = 'com.flertegamificado.app';

  // API Configuration
  static const String baseUrl = kDebugMode 
    ? 'http://localhost:3000/api/v1'
    : 'https://api.flertegamificado.com/api/v1';
  
  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Authentication
  static const Duration tokenRefreshThreshold = Duration(minutes: 5);
  static const String jwtTokenKey = 'jwt_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';

  // Local Storage Keys
  static const String onboardingCompletedKey = 'onboarding_completed';
  static const String themeKey = 'theme_mode';
  static const String localeKey = 'locale';
  static const String characterConfigKey = 'character_config';
  static const String userStatsKey = 'user_stats';

  // Feature Flags
  static const bool enableAnalytics = !kDebugMode;
  static const bool enableCrashReporting = !kDebugMode;
  static const bool enableDebugLogs = kDebugMode;
  static const bool enableBiometricAuth = true;
  static const bool enableSocialLogin = true;

  // Subscription & Trial
  static const Duration trialDuration = Duration(days: 7);
  static const String monthlyProductId = 'flerte_monthly_subscription';
  static const String annualProductId = 'flerte_annual_subscription';

  // Chat & AI
  static const int maxMessageLength = 500;
  static const int maxAudioDurationSeconds = 60;
  static const int maxImageSizeMB = 5;
  static const Duration typingIndicatorDelay = Duration(milliseconds: 800);

  // Gamification
  static const int maxDailyMissions = 3;
  static const int maxWeeklyMissions = 5;
  static const int baseXpPerInteraction = 10;
  static const int bonusXpThreshold = 80; // Score threshold for bonus XP

  // WhatsApp Bot
  static const String whatsappBotNumber = '+5511999999999';
  static const String whatsappDeepLink = 'https://wa.me/5511999999999';

  // Social Links
  static const String websiteUrl = 'https://flertegamificado.com';
  static const String privacyPolicyUrl = 'https://flertegamificado.com/privacy';
  static const String termsOfServiceUrl = 'https://flertegamificado.com/terms';
  static const String supportEmail = 'suporte@flertegamificado.com';
  static const String instagramUrl = 'https://instagram.com/flertegamificado';
  static const String tiktokUrl = 'https://tiktok.com/@flertegamificado';

  // Animation & UI
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  static const Duration fastAnimationDuration = Duration(milliseconds: 150);
  static const Duration slowAnimationDuration = Duration(milliseconds: 500);
  static const double defaultBorderRadius = 12.0;
  static const double cardElevation = 2.0;

  // Validation
  static const int minPasswordLength = 8;
  static const int maxNameLength = 50;
  static const int minAge = 18;

  // Error Messages
  static const String genericErrorMessage = 'Algo deu errado. Tente novamente.';
  static const String networkErrorMessage = 'Verifique sua conexão com a internet.';
  static const String serverErrorMessage = 'Nossos servidores estão temporariamente indisponíveis.';
  static const String unauthorizedErrorMessage = 'Sessão expirada. Faça login novamente.';

  // Environment-specific configurations
  static bool get isProduction => kReleaseMode;
  static bool get isDevelopment => kDebugMode;
  static bool get isProfile => kProfileMode;

  // Debug configurations
  static bool get showPerformanceOverlay => kDebugMode && false;
  static bool get showSemanticsDebugger => kDebugMode && false;
  static bool get debugShowMaterialGrid => kDebugMode && false;
}
