# Flerte Gamificado - Backend API

Backend NestJS para o aplicativo Flerte Gamificado.

## 🚀 Funcionalidades

- ✅ Autenticação JWT + OAuth (Google, Apple)
- ✅ Sistema de usuários e perfis
- ✅ Interações multimodais com IA (texto, áudio, imagem)
- ✅ Sistema de gamificação (XP, níveis, conquistas)
- ✅ Missões diárias e semanais
- ✅ Módulo de análise de moda
- ✅ Bot WhatsApp integrado
- ✅ Sistema de assinaturas e pagamentos
- ✅ Conformidade LGPD

## 🏗️ Arquitetura

```
src/
├── auth/                   # Autenticação e autorização
├── users/                  # Gerenciamento de usuários
├── characters/             # Configuração de avatares
├── interactions/           # Interações com IA
├── gamification/           # Sistema de gamificação
├── missions/               # Missões e desafios
├── fashion/                # Análise de moda
├── payments/               # Pagamentos e assinaturas
├── whatsapp/               # Bot WhatsApp
├── ai-orchestrator/        # Orquestração de IA
├── storage/                # Gerenciamento de arquivos
├── notifications/          # Notificações push
├── database/               # Configuração do banco
├── common/                 # Serviços compartilhados
└── config/                 # Configurações
```

## 🛠️ Stack Tecnológica

### Core
- **NestJS** 10+ - Framework Node.js
- **TypeScript** 5+ - Linguagem tipada
- **Prisma** 5+ - ORM e migrations

### Database & Cache
- **PostgreSQL** 15+ - Banco principal
- **Redis** 7+ - Cache e filas

### Authentication & Security
- **JWT** - Tokens de acesso
- **Passport** - Estratégias de autenticação
- **bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP

### AI & External Services
- **OpenAI** - GPT-4, Whisper, Vision
- **Stripe** - Pagamentos internacionais
- **Pagar.me** - Pagamentos Brasil
- **WhatsApp Business API** - Bot integrado

### Storage & Files
- **MinIO** - Storage S3-compatible
- **Multer** - Upload de arquivos

### Monitoring & Logs
- **Winston** - Logging estruturado
- **Prometheus** - Métricas
- **Bull** - Filas de tarefas

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (opcional)

### Instalação

1. **Instale as dependências**:
```bash
npm install
```

2. **Configure as variáveis de ambiente**:
```bash
cp ../.env.example .env
# Edite .env com suas configurações
```

3. **Inicie os serviços de infraestrutura**:
```bash
# Com Docker
docker-compose up -d postgres redis minio

# Ou configure manualmente PostgreSQL e Redis
```

4. **Execute as migrações**:
```bash
npm run db:migrate
```

5. **Popule o banco com dados iniciais**:
```bash
npm run db:seed
```

6. **Inicie o servidor**:
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev          # Servidor com hot-reload
npm run start:debug        # Servidor com debug

# Database
npm run db:generate        # Gerar cliente Prisma
npm run db:migrate         # Executar migrações
npm run db:seed           # Popular banco com dados
npm run db:studio         # Interface visual do banco
npm run db:reset          # Resetar banco (cuidado!)

# Testes
npm run test              # Testes unitários
npm run test:watch        # Testes em modo watch
npm run test:cov          # Testes com coverage
npm run test:e2e          # Testes end-to-end

# Qualidade de código
npm run lint              # Verificar linting
npm run format            # Formatar código

# Build
npm run build             # Build para produção
```

## 📡 API Endpoints

### Autenticação
```
POST   /api/v1/auth/signup           # Criar conta
POST   /api/v1/auth/signin           # Login
POST   /api/v1/auth/refresh          # Renovar token
GET    /api/v1/auth/google           # Login Google
GET    /api/v1/auth/me               # Dados do usuário
POST   /api/v1/auth/logout           # Logout
```

### Usuários
```
GET    /api/v1/users/me              # Perfil do usuário
PUT    /api/v1/users/me              # Atualizar perfil
DELETE /api/v1/users/me              # Desativar conta
GET    /api/v1/users/stats           # Estatísticas
GET    /api/v1/users/subscription    # Dados da assinatura
```

### Interações
```
POST   /api/v1/interactions          # Nova interação texto
POST   /api/v1/interactions/audio    # Interação áudio
POST   /api/v1/interactions/image    # Análise de imagem
GET    /api/v1/interactions          # Histórico
GET    /api/v1/interactions/stats    # Estatísticas
```

### Documentação Completa
Acesse `/api/docs` quando o servidor estiver rodando para ver a documentação Swagger completa.

## 🧪 Testes

### Estrutura
```
test/
├── unit/                 # Testes unitários
├── integration/          # Testes de integração
└── e2e/                 # Testes end-to-end
```

### Executar Testes
```bash
# Todos os testes
npm run test

# Com coverage
npm run test:cov

# Testes específicos
npm run test -- --testPathPattern=auth
npm run test -- --testNamePattern="should create user"

# End-to-end
npm run test:e2e
```

## 🔧 Configuração

### Variáveis de Ambiente Principais
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/flerte_gamificado
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=sk-your-openai-key

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PAGARME_API_KEY=ak_test_your_pagarme_key

# WhatsApp
WHATSAPP_TOKEN=your_whatsapp_token
```

### Configuração de Desenvolvimento
```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  // ... outras configurações
});
```

## 🚀 Deploy

### Docker
```bash
# Build da imagem
docker build -t flerte-backend .

# Executar container
docker run -p 3000:3000 --env-file .env flerte-backend
```

### Kubernetes
```bash
# Aplicar manifests
kubectl apply -f k8s/
```

### Variáveis de Produção
- Configure `NODE_ENV=production`
- Use secrets seguros para JWT e APIs
- Configure SSL/TLS
- Ative monitoramento e logs

## 🔒 Segurança

### Implementado
- ✅ Helmet para headers de segurança
- ✅ Rate limiting por IP
- ✅ Validação de entrada com class-validator
- ✅ Sanitização de dados
- ✅ JWT com refresh tokens
- ✅ Hash seguro de senhas (bcrypt)
- ✅ CORS configurado

### Boas Práticas
- Mantenha dependências atualizadas
- Use HTTPS em produção
- Configure firewall adequadamente
- Monitore logs de segurança
- Faça backups regulares

## 📊 Monitoramento

### Métricas Disponíveis
- Latência de requests
- Taxa de erro por endpoint
- Uso de CPU e memória
- Conexões de banco ativas
- Filas de processamento

### Dashboards
- Grafana: `http://localhost:3001`
- Prometheus: `http://localhost:9090`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript estrito
- Siga as regras do ESLint/Prettier
- Escreva testes para novas funcionalidades
- Documente APIs com Swagger
- Use conventional commits

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](../LICENSE) para detalhes.

## 📞 Suporte

- **Email**: dev@flertegamificado.com
- **Documentação**: `/api/docs`
- **Issues**: GitHub Issues
