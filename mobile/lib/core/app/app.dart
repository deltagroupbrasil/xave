import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../config/app_theme.dart';
import '../config/app_router.dart';
import '../services/logger_service.dart';
import '../../shared/providers/app_state_provider.dart';

class FlerteGamificadoApp extends ConsumerWidget {
  const FlerteGamificadoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final appState = ref.watch(appStateProvider);

    return MaterialApp.router(
      title: 'Flerte Gamificado',
      debugShowCheckedModeBanner: false,
      
      // Theme configuration
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: appState.themeMode,
      
      // Localization
      locale: appState.locale,
      supportedLocales: const [
        Locale('pt', 'BR'),
        Locale('en', 'US'),
      ],
      
      // Router configuration
      routerConfig: router,
      
      // Global error handling
      builder: (context, child) {
        ErrorWidget.builder = (FlutterErrorDetails errorDetails) {
          LoggerService.instance.error(
            'Flutter error caught by ErrorWidget',
            errorDetails.exception,
            errorDetails.stack,
          );
          
          return _buildErrorWidget(context, errorDetails);
        };
        
        return child ?? const SizedBox.shrink();
      },
    );
  }

  Widget _buildErrorWidget(BuildContext context, FlutterErrorDetails errorDetails) {
    return Material(
      child: Container(
        color: Colors.red.shade50,
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: 64,
                  color: Colors.red.shade400,
                ),
                const SizedBox(height: 16),
                Text(
                  'Oops! Algo deu errado',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.red.shade700,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Por favor, reinicie o aplicativo',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.red.shade600,
                  ),
                ),
                if (kDebugMode) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      errorDetails.exception.toString(),
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
