# Flerte Gamificado - Mobile App

App mobile Flutter para o sistema de ensino gamificado de flerte.

## 🚀 Funcionalidades

- ✅ Onboarding interativo com personalização de avatar
- ✅ Chat multimodal com IA (texto, áudio, imagem)
- ✅ Sistema de pontuação e feedback inteligente
- ✅ Gamificação completa (XP, níveis, conquistas)
- ✅ Módulo de moda com análise de looks
- ✅ Integração com bot WhatsApp
- ✅ Sistema de assinaturas com trial gratuito
- ✅ Autenticação social (Google, Apple)

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com as seguintes camadas:

```
lib/
├── core/                   # Configurações e serviços centrais
│   ├── app/               # Configuração principal do app
│   ├── config/            # Configurações e constantes
│   ├── services/          # Serviços globais
│   └── theme/             # Temas e estilos
├── features/              # Funcionalidades por módulo
│   ├── auth/              # Autenticação
│   ├── onboarding/        # Onboarding
│   ├── chat/              # Chat com IA
│   ├── gamification/      # Sistema de gamificação
│   ├── fashion/           # Módulo de moda
│   └── profile/           # Perfil do usuário
└── shared/                # Componentes e utilitários compartilhados
    ├── models/            # Modelos de dados
    ├── providers/         # Providers Riverpod
    ├── widgets/           # Widgets reutilizáveis
    └── utils/             # Utilitários
```

## 🛠️ Stack Tecnológica

### Core
- **Flutter** 3.22+ - Framework principal
- **Dart** 3.0+ - Linguagem de programação

### State Management
- **Riverpod** - Gerenciamento de estado reativo
- **Riverpod Generator** - Geração automática de providers

### Navigation
- **GoRouter** - Roteamento declarativo

### UI & Animations
- **Lottie** - Animações vetoriais
- **Rive** - Animações interativas
- **Flutter Animate** - Animações fluidas

### HTTP & API
- **Dio** - Cliente HTTP
- **Retrofit** - Geração de clientes API

### Local Storage
- **Hive** - Banco de dados local NoSQL
- **Shared Preferences** - Preferências simples

### Authentication
- **Google Sign In** - Login com Google
- **Sign in with Apple** - Login com Apple

### Payments
- **In App Purchase** - Compras nativas
- **RevenueCat** - Gerenciamento de assinaturas

### Media & Files
- **Image Picker** - Seleção de imagens
- **File Picker** - Seleção de arquivos
- **Just Audio** - Reprodução de áudio
- **Record** - Gravação de áudio

### Push Notifications
- **Firebase Messaging** - Notificações push
- **Flutter Local Notifications** - Notificações locais

### Analytics & Monitoring
- **Firebase Analytics** - Analytics
- **Firebase Crashlytics** - Crash reporting

## 🚦 Como Executar

### Pré-requisitos
- Flutter SDK 3.22+
- Dart SDK 3.0+
- Android Studio / VS Code
- Xcode (para iOS)

### Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd flerte-gamificado/mobile
```

2. **Instale as dependências**:
```bash
flutter pub get
```

3. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. **Gere os arquivos necessários**:
```bash
flutter packages pub run build_runner build
```

5. **Execute o app**:
```bash
flutter run
```

### Comandos Úteis

```bash
# Gerar código automaticamente
flutter packages pub run build_runner build

# Gerar código em modo watch
flutter packages pub run build_runner watch

# Limpar e regenerar
flutter packages pub run build_runner build --delete-conflicting-outputs

# Executar testes
flutter test

# Executar testes de integração
flutter test integration_test/

# Analisar código
flutter analyze

# Formatar código
dart format .

# Build para produção
flutter build apk --release
flutter build ios --release
```

## 🧪 Testes

### Estrutura de Testes
```
test/
├── unit/                  # Testes unitários
├── widget/                # Testes de widgets
└── integration_test/      # Testes de integração
```

### Executar Testes
```bash
# Todos os testes
flutter test

# Testes unitários
flutter test test/unit/

# Testes de widget
flutter test test/widget/

# Testes de integração
flutter test integration_test/

# Com coverage
flutter test --coverage
```

## 📱 Build & Deploy

### Android
```bash
# Debug
flutter build apk --debug

# Release
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
# Debug
flutter build ios --debug

# Release
flutter build ios --release
```

## 🔧 Configuração de Desenvolvimento

### VS Code Extensions Recomendadas
- Flutter
- Dart
- Bracket Pair Colorizer
- Error Lens
- GitLens

### Debug Configuration
```json
{
  "name": "Flutter (Debug)",
  "type": "dart",
  "request": "launch",
  "program": "lib/main.dart",
  "args": ["--flavor", "development"]
}
```

## 📋 Checklist de Desenvolvimento

### Antes de Fazer Commit
- [ ] Código formatado (`dart format .`)
- [ ] Análise sem erros (`flutter analyze`)
- [ ] Testes passando (`flutter test`)
- [ ] Build funcionando (`flutter build apk --debug`)

### Antes de Release
- [ ] Versão atualizada no `pubspec.yaml`
- [ ] Changelog atualizado
- [ ] Testes de integração passando
- [ ] Build de release funcionando
- [ ] Ícones e splash screens atualizados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para detalhes.

## 📞 Suporte

- **Email**: dev@flertegamificado.com
- **Discord**: [Link do servidor]
- **Documentação**: [Link da documentação]
