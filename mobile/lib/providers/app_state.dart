import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
  });
}

class Mission {
  final String id;
  final String title;
  final String description;
  final int xpReward;
  final String status;
  final int progress;

  Mission({
    required this.id,
    required this.title,
    required this.description,
    required this.xpReward,
    required this.status,
    required this.progress,
  });
}

class UserProfile {
  final int totalXp;
  final int currentLevel;
  final int totalInteractions;
  final int streakDays;

  UserProfile({
    required this.totalXp,
    required this.currentLevel,
    required this.totalInteractions,
    required this.streakDays,
  });
}

class AppState extends ChangeNotifier {
  final String _userId = 'demo_user_123'; // Usuário demo por enquanto

  List<ChatMessage> _messages = [];
  List<Mission> _missions = [];
  UserProfile _userProfile = UserProfile(
    totalXp: 150,
    currentLevel: 1,
    totalInteractions: 0,
    streakDays: 0,
  );

  bool _isLoading = false;

  List<ChatMessage> get messages => _messages;
  List<Mission> get missions => _missions;
  UserProfile get userProfile => _userProfile;
  bool get isLoading => _isLoading;

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // Adiciona mensagem do usuário
    _messages.add(ChatMessage(
      text: text,
      isUser: true,
      timestamp: DateTime.now(),
    ));
    notifyListeners();

    _isLoading = true;
    notifyListeners();

    try {
      // Chama a API
      final response = await ApiService.sendMessage(text, _userId);

      // Adiciona resposta da IA
      _messages.add(ChatMessage(
        text: response['aiResponse'] ?? 'Desculpe, não consegui processar sua mensagem.',
        isUser: false,
        timestamp: DateTime.now(),
      ));

      // Atualiza XP se fornecido
      if (response['xpGained'] != null) {
        _userProfile = UserProfile(
          totalXp: _userProfile.totalXp + (response['xpGained'] as int),
          currentLevel: _userProfile.currentLevel,
          totalInteractions: _userProfile.totalInteractions + 1,
          streakDays: _userProfile.streakDays,
        );
      }
    } catch (e) {
      print('Erro ao enviar mensagem: $e');
      // Em caso de erro, adiciona uma resposta de fallback
      _messages.add(ChatMessage(
        text: 'Desculpe, estou com problemas de conexão. Tente novamente.',
        isUser: false,
        timestamp: DateTime.now(),
      ));
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMissions() async {
    _isLoading = true;
    notifyListeners();

    try {
      final missionsData = await ApiService.getUserMissions(_userId);
      _missions = missionsData.map((data) => Mission(
        id: data['id'] ?? '',
        title: data['title'] ?? '',
        description: data['description'] ?? '',
        xpReward: data['xpReward'] ?? 0,
        status: data['status'] ?? 'PENDING',
        progress: data['progress'] ?? 0,
      )).toList();
    } catch (e) {
      print('Erro ao carregar missões: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadUserProfile() async {
    try {
      final profileData = await ApiService.getUserProfile(_userId);
      final stats = profileData['stats'] ?? {};

      _userProfile = UserProfile(
        totalXp: stats['totalXp'] ?? 150,
        currentLevel: stats['currentLevel'] ?? 1,
        totalInteractions: stats['totalInteractions'] ?? 0,
        streakDays: stats['streakDays'] ?? 0,
      );
      notifyListeners();
    } catch (e) {
      print('Erro ao carregar perfil: $e');
    }
  }

  void initializeApp() {
    loadMissions();
    loadUserProfile();
  }
}