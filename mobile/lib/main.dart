import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'core/app/app.dart';
import 'core/config/app_config.dart';
import 'core/services/logger_service.dart';
import 'core/services/notification_service.dart';
import 'shared/utils/app_initializer.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Configure system UI
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  try {
    // Initialize core services
    await _initializeServices();
    
    // Run app with error handling
    runApp(
      ProviderScope(
        child: FlerteGamificadoApp(),
      ),
    );
  } catch (error, stackTrace) {
    LoggerService.instance.error('Failed to initialize app', error, stackTrace);
    
    // Show error screen
    runApp(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 64,
                  color: Colors.red,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Erro ao inicializar o aplicativo',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Por favor, reinicie o aplicativo',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Future<void> _initializeServices() async {
  // Initialize logger
  LoggerService.instance.info('Initializing Flerte Gamificado app...');

  // Initialize Hive for local storage
  await Hive.initFlutter();
  LoggerService.instance.info('Hive initialized');

  // Initialize Firebase
  await Firebase.initializeApp();
  LoggerService.instance.info('Firebase initialized');

  // Initialize notification service
  await NotificationService.instance.initialize();
  LoggerService.instance.info('Notification service initialized');

  // Initialize app-specific services
  await AppInitializer.initialize();
  LoggerService.instance.info('App services initialized');

  LoggerService.instance.info('App initialization completed successfully');
}
