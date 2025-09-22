import 'package:logger/logger.dart';
import 'package:flutter/foundation.dart';

class LoggerService {
  static LoggerService? _instance;
  static LoggerService get instance => _instance ??= LoggerService._();

  late final Logger _logger;

  LoggerService._() {
    _logger = Logger(
      filter: kDebugMode ? DevelopmentFilter() : ProductionFilter(),
      printer: PrettyPrinter(
        methodCount: 2,
        errorMethodCount: 8,
        lineLength: 120,
        colors: true,
        printEmojis: true,
        printTime: true,
      ),
      output: kDebugMode ? ConsoleOutput() : null,
    );
  }

  void debug(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.d(message, error: error, stackTrace: stackTrace);
  }

  void info(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.i(message, error: error, stackTrace: stackTrace);
  }

  void warning(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.w(message, error: error, stackTrace: stackTrace);
  }

  void error(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e(message, error: error, stackTrace: stackTrace);
  }

  void fatal(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.f(message, error: error, stackTrace: stackTrace);
  }

  // Custom logging methods for specific events
  void logUserAction(String action, Map<String, dynamic>? parameters) {
    info('User Action: $action', parameters);
  }

  void logApiCall(String endpoint, String method, int statusCode, Duration duration) {
    info('API Call: $method $endpoint - $statusCode (${duration.inMilliseconds}ms)');
  }

  void logNavigation(String from, String to) {
    info('Navigation: $from -> $to');
  }

  void logInteraction(String type, Map<String, dynamic>? data) {
    info('Interaction: $type', data);
  }

  void logPerformance(String operation, Duration duration) {
    if (duration.inMilliseconds > 1000) {
      warning('Slow operation: $operation took ${duration.inMilliseconds}ms');
    } else {
      debug('Performance: $operation took ${duration.inMilliseconds}ms');
    }
  }
}
