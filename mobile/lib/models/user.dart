import 'dart:convert';

class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phoneNumber;
  final String gender;
  final DateTime dateOfBirth;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final int currentLevel;
  final int totalXp;
  final int totalInteractions;
  final int streakDays;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phoneNumber,
    required this.gender,
    required this.dateOfBirth,
    required this.createdAt,
    required this.updatedAt,
    required this.isActive,
    this.currentLevel = 1,
    this.totalXp = 0,
    this.totalInteractions = 0,
    this.streakDays = 0,
  });

  String get fullName => '$firstName $lastName';

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] ?? '',
      email: map['email'] ?? '',
      firstName: map['firstName'] ?? '',
      lastName: map['lastName'] ?? '',
      phoneNumber: map['phoneNumber'],
      gender: map['gender'] ?? 'OTHER',
      dateOfBirth: DateTime.parse(map['dateOfBirth'] ?? DateTime.now().toIso8601String()),
      createdAt: DateTime.parse(map['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(map['updatedAt'] ?? DateTime.now().toIso8601String()),
      isActive: map['isActive'] ?? true,
      currentLevel: map['currentLevel'] ?? 1,
      totalXp: map['totalXp'] ?? 0,
      totalInteractions: map['totalInteractions'] ?? 0,
      streakDays: map['streakDays'] ?? 0,
    );
  }

  factory User.fromJson(String source) => User.fromMap(json.decode(source));

  String toJson() => json.encode({
    'id': id,
    'email': email,
    'firstName': firstName,
    'lastName': lastName,
    'phoneNumber': phoneNumber,
    'gender': gender,
    'dateOfBirth': dateOfBirth.toIso8601String(),
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
    'isActive': isActive,
    'currentLevel': currentLevel,
    'totalXp': totalXp,
    'totalInteractions': totalInteractions,
    'streakDays': streakDays,
  });

  User copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? gender,
    DateTime? dateOfBirth,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isActive,
    int? currentLevel,
    int? totalXp,
    int? totalInteractions,
    int? streakDays,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      gender: gender ?? this.gender,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isActive: isActive ?? this.isActive,
      currentLevel: currentLevel ?? this.currentLevel,
      totalXp: totalXp ?? this.totalXp,
      totalInteractions: totalInteractions ?? this.totalInteractions,
      streakDays: streakDays ?? this.streakDays,
    );
  }
}