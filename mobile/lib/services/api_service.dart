import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3002/api/v1';

  // Auth methods
  static Future<Map<String, dynamic>> signIn(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/signin'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return {
          'success': true,
          'data': json.decode(response.body),
        };
      } else {
        final error = json.decode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao fazer login',
        };
      }
    } catch (e) {
      print('Erro ao fazer login: $e');
      return {
        'success': false,
        'message': 'Erro de conexão. Verifique sua internet.',
      };
    }
  }

  static Future<Map<String, dynamic>> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String dateOfBirth,
    required String gender,
    String? phoneNumber,
  }) async {
    try {
      final body = {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'dateOfBirth': dateOfBirth,
        'gender': gender,
      };

      if (phoneNumber != null && phoneNumber.isNotEmpty) {
        body['phoneNumber'] = phoneNumber;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode(body),
      );

      if (response.statusCode == 201) {
        return {
          'success': true,
          'data': json.decode(response.body),
        };
      } else {
        final error = json.decode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao criar conta',
        };
      }
    } catch (e) {
      print('Erro ao criar conta: $e');
      return {
        'success': false,
        'message': 'Erro de conexão. Verifique sua internet.',
      };
    }
  }

  static Future<Map<String, dynamic>> logout(String token) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/logout'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      return {
        'success': response.statusCode == 200,
      };
    } catch (e) {
      print('Erro ao fazer logout: $e');
      return {
        'success': false,
      };
    }
  }

  static Future<Map<String, dynamic>> sendMessage(String message, String userId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/interactions'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'userId': userId,
          'message': message,
          'type': 'TEXT',
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('Erro na API: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao enviar mensagem: $e');
      // Fallback para resposta mock se a API falhar
      return {
        'aiResponse': _getMockResponse(message),
        'xpGained': 10,
      };
    }
  }

  static Future<List<Map<String, dynamic>>> getUserMissions(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/gamification/daily-missions'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> missions = json.decode(response.body);
        return missions.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Erro na API: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao buscar missões: $e');
      // Fallback para missões mock
      return _getMockMissions();
    }
  }

  static Future<Map<String, dynamic>> getUserProfile(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/gamification/profile'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Erro na API: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao buscar perfil: $e');
      // Fallback para perfil mock
      return {
        'stats': {
          'totalXp': 150,
          'currentLevel': 1,
          'totalInteractions': 5,
          'streakDays': 2,
        },
        'achievements': [],
        'missions': _getMockMissions(),
      };
    }
  }

  static String _getMockResponse(String message) {
    List<String> responses = [
      "Que interessante! Conte-me mais sobre isso.",
      "Hmm, entendo. E como você se sente sobre isso?",
      "Essa é uma boa pergunta! Vamos explorar juntos.",
      "Você está indo bem! Continue assim.",
      "Que tal tentarmos uma abordagem diferente?",
    ];
    return responses[DateTime.now().millisecond % responses.length];
  }

  static List<Map<String, dynamic>> _getMockMissions() {
    return [
      {
        'id': '1',
        'title': 'Primeira Conversa',
        'description': 'Inicie uma conversa no chat',
        'xpReward': 50,
        'status': 'COMPLETED',
        'progress': 100,
      },
      {
        'id': '2',
        'title': 'Seja Criativo',
        'description': 'Faça 5 perguntas interessantes',
        'xpReward': 100,
        'status': 'IN_PROGRESS',
        'progress': 60,
      },
      {
        'id': '3',
        'title': 'Pratique Diariamente',
        'description': 'Use o app por 3 dias seguidos',
        'xpReward': 200,
        'status': 'PENDING',
        'progress': 0,
      },
    ];
  }
}