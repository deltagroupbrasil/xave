import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'providers/auth_provider.dart';
import 'pages/auth/login_page.dart';

void main() {
  runApp(FlerteGamificadoApp());
}

class FlerteGamificadoApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AuthProvider()),
        ChangeNotifierProvider(create: (context) => AppState()..initializeApp()),
      ],
      child: MaterialApp(
        title: 'Flerte Gamificado',
        theme: ThemeData(
          primarySwatch: Colors.pink,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: HomePage(),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    ChatPage(),
    MissionsPage(),
    ProfilePage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flerte Gamificado'),
        backgroundColor: Colors.pink[600],
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment),
            label: 'Missões',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.pink[600],
        onTap: _onItemTapped,
      ),
    );
  }
}

class ChatPage extends StatefulWidget {
  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _controller = TextEditingController();

  void _sendMessage(String text, AppState appState) {
    if (text.trim().isEmpty) return;

    appState.sendMessage(text);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        return Column(
          children: [
            Container(
              padding: EdgeInsets.all(16),
              color: Colors.pink[50],
              width: double.infinity,
              child: Text(
                '💬 Chat com Sofia - Sua Mentora Virtual',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.pink[700],
                ),
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
              child: ListView.builder(
                itemCount: appState.messages.length,
                itemBuilder: (context, index) {
                  final message = appState.messages[index];
                  return ChatBubble(message: message);
                },
              ),
            ),
            if (appState.isLoading)
              Container(
                padding: EdgeInsets.all(8),
                child: Row(
                  children: [
                    SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                    SizedBox(width: 8),
                    Text('Sofia está digitando...'),
                  ],
                ),
              ),
            Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    spreadRadius: 1,
                    blurRadius: 3,
                    offset: Offset(0, -1),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'Digite sua mensagem...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                      onSubmitted: (text) => _sendMessage(text, appState),
                      enabled: !appState.isLoading,
                    ),
                  ),
                  SizedBox(width: 8),
                  FloatingActionButton(
                    mini: true,
                    onPressed: appState.isLoading
                        ? null
                        : () => _sendMessage(_controller.text, appState),
                    backgroundColor: Colors.pink[600],
                    child: Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

class ChatBubble extends StatelessWidget {
  final ChatMessage message;

  ChatBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: Row(
        mainAxisAlignment: message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!message.isUser) ...[
            CircleAvatar(
              backgroundColor: Colors.pink[100],
              child: Text('🤖'),
            ),
            SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: message.isUser ? Colors.pink[600] : Colors.grey[200],
                borderRadius: BorderRadius.circular(18),
              ),
              child: Text(
                message.text,
                style: TextStyle(
                  color: message.isUser ? Colors.white : Colors.black87,
                ),
              ),
            ),
          ),
          if (message.isUser) ...[
            SizedBox(width: 8),
            CircleAvatar(
              backgroundColor: Colors.blue[100],
              child: Text('👤'),
            ),
          ],
        ],
      ),
    );
  }
}

class MissionsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        if (appState.isLoading && appState.missions.isEmpty) {
          return Center(child: CircularProgressIndicator());
        }

        return Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '🎯 Suas Missões',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.pink[700],
                ),
              ),
              SizedBox(height: 20),
              Expanded(
                child: ListView.builder(
                  itemCount: appState.missions.length,
                  itemBuilder: (context, index) {
                    final mission = appState.missions[index];
                    return MissionCard(
                      title: mission.title,
                      description: mission.description,
                      xp: mission.xpReward,
                      completed: mission.status == 'COMPLETED',
                      progress: mission.progress,
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class MissionCard extends StatelessWidget {
  final String title;
  final String description;
  final int xp;
  final bool completed;
  final int progress;

  MissionCard({
    required this.title,
    required this.description,
    required this.xp,
    required this.completed,
    this.progress = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(
              completed ? Icons.check_circle : Icons.radio_button_unchecked,
              color: completed ? Colors.green : Colors.grey,
              size: 32,
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: completed ? Colors.green : Colors.black87,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.pink[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${xp} XP',
                style: TextStyle(
                  color: Colors.pink[700],
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer2<AppState, AuthProvider>(
      builder: (context, appState, authProvider, child) {
        final profile = appState.userProfile;

        return SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: Colors.pink[100],
                  child: Text('👤', style: TextStyle(fontSize: 40)),
                ),
                SizedBox(height: 16),

                if (authProvider.isAuthenticated) ...[
                  Text(
                    authProvider.user!.fullName,
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Text(
                    authProvider.user!.email,
                    style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                  ),
                ] else ...[
                  Text(
                    'Usuário Demo',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                ],

                SizedBox(height: 8),
                Text(
                  'Nível ${profile.currentLevel} - ${_getLevelTitle(profile.currentLevel)}',
                  style: TextStyle(color: Colors.grey[600], fontSize: 16),
                ),

                SizedBox(height: 24),

                Card(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem('Interações', '${profile.totalInteractions}', Icons.chat),
                        _buildStatItem('XP', '${profile.totalXp}', Icons.stars),
                        _buildStatItem('Missões', '${appState.missions.where((m) => m.status == "COMPLETED").length}', Icons.check_circle),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 16),

                if (authProvider.isAuthenticated)
                  Card(
                    child: ListTile(
                      leading: Icon(Icons.logout, color: Colors.red[600]),
                      title: Text('Sair'),
                      onTap: () async {
                        await authProvider.logout();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Logout realizado com sucesso')),
                        );
                      },
                    ),
                  )
                else
                  Card(
                    child: ListTile(
                      leading: Icon(Icons.login, color: Colors.pink[600]),
                      title: Text('Fazer Login'),
                      trailing: Icon(Icons.arrow_forward_ios),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => LoginPage()),
                        );
                      },
                    ),
                  ),

                SizedBox(height: 8),

                Card(
                  child: ListTile(
                    leading: Icon(Icons.settings, color: Colors.grey[600]),
                    title: Text('Configurações'),
                    trailing: Icon(Icons.arrow_forward_ios),
                  ),
                ),

                SizedBox(height: 20),

                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.pink[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Text(
                        '🎉 Bem-vindo ao Flerte Gamificado!',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.pink[700],
                        ),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Complete missões, converse com a Sofia e melhore suas habilidades sociais!',
                        style: TextStyle(color: Colors.pink[600]),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.pink[600], size: 32),
        SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.pink[700],
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  String _getLevelTitle(int level) {
    if (level == 1) return 'Iniciante';
    if (level <= 3) return 'Aprendiz';
    if (level <= 6) return 'Intermediário';
    if (level <= 10) return 'Avançado';
    return 'Mestre';
  }
}