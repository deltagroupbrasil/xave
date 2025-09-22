# Flerte Gamificado - App Mobile + Bot WhatsApp

## Visão Geral
Aplicativo mobile gamificado para ensino de técnicas de flerte e sedução, com bot integrado ao WhatsApp para acompanhamento contínuo.

## Arquitetura do Projeto

```
flerte-gamificado/
├── mobile/                 # App Flutter
├── backend/               # API Node.js/NestJS
├── docs/                  # Documentação
├── infrastructure/        # Docker, K8s, scripts
├── shared/               # Tipos e utilitários compartilhados
└── tools/                # Scripts de desenvolvimento
```

## Stack Tecnológica

### Mobile (Flutter)
- **Framework**: Flutter 3.22+
- **Arquitetura**: Clean Architecture
- **State Management**: Riverpod
- **Navegação**: GoRouter
- **Animações**: Lottie/Rive para avatares
- **Testes**: flutter_test, integration_test

### Backend (Node.js)
- **Framework**: NestJS com TypeScript
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Storage**: MinIO (S3 compatible)
- **Autenticação**: JWT + OAuth (Google/Apple)
- **Pagamentos**: Stripe + Pagar.me
- **IA**: OpenAI GPT-4, Whisper, Computer Vision

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (futuro)
- **CI/CD**: GitHub Actions
- **Monitoramento**: Prometheus + Grafana
- **Logs**: Winston + OpenTelemetry

## Funcionalidades Principais

### Core Features
- ✅ Onboarding interativo com personalização de avatar
- ✅ Chat multimodal (texto, áudio, imagem) com IA
- ✅ Sistema de pontuação e feedback inteligente
- ✅ Gamificação (XP, níveis, conquistas, missões)
- ✅ Módulo de moda com análise de looks
- ✅ Bot WhatsApp para consultas rápidas
- ✅ Sistema de assinaturas com trial gratuito

### Recursos Avançados
- 🔄 Avatares animados com expressões dinâmicas
- 🔄 Análise de sentimentos e contexto
- 🔄 Recomendações personalizadas de moda
- 🔄 Cenários fictícios para treinamento
- 🔄 Sistema de ranking e competições

## Modelo de Negócio
- **Assinatura Mensal**: R$ 19,99
- **Assinatura Anual**: R$ 199,90 (16% desconto)
- **Trial Gratuito**: 7 dias
- **Futuro**: Microtransações (roupas virtuais, cenários)

## Roadmap de Desenvolvimento

### Fase 1 - MVP (0-3 meses)
- [x] Estrutura do projeto
- [ ] Fundamentos mobile e backend
- [ ] Chat textual com IA
- [ ] Sistema de pontuação básico
- [ ] Pagamentos e assinaturas
- [ ] Bot WhatsApp básico

### Fase 2 - Multimídia (3-6 meses)
- [ ] Suporte a áudio e imagem
- [ ] Avatares animados
- [ ] Gamificação avançada
- [ ] Módulo de moda automatizado

### Fase 3 - Escala (6-12 meses)
- [ ] Múltiplos personagens
- [ ] Integração com redes sociais
- [ ] Expansão internacional
- [ ] Recursos premium

## Como Executar

### Pré-requisitos
- Node.js 18+
- Flutter 3.22+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Desenvolvimento Local

1. **Clone e instale dependências**:
```bash
git clone <repository>
cd flerte-gamificado
npm run setup
```

2. **Configure variáveis de ambiente**:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

3. **Inicie os serviços**:
```bash
docker-compose up -d  # Banco e Redis
npm run dev:backend   # API NestJS
npm run dev:mobile    # Flutter app
```

4. **Execute migrações**:
```bash
npm run db:migrate
npm run db:seed
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

- **Equipe de Desenvolvimento**: dev@flertegamificado.com
- **Suporte**: suporte@flertegamificado.com
- **Website**: https://flertegamificado.com

---

**Nota**: Este é um projeto em desenvolvimento ativo. Funcionalidades podem estar incompletas ou em fase de testes.
