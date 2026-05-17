# SaudePet - Backend

Uma aplicação para gestão de saúde dos pets, criado para atender ao Projeto Integrador em Ciência de Dados III, da Universidade Virtual do Estado de São Paulo.

## ESTRUTURA DO PROJETO

```
saudePet-service/
├── backend/                  # API REST
│   ├── src/
│   │   ├── config/           # Configuração do banco de dados MongoDB
│   │   ├── models/           # Schemas Mongoose
│   │   ├── controllers/      # Regras de negócio
│   │   ├── routes/           # Endpoints
│   │   ├── middleware/       # Autenticação, error handlers
│   │   ├── utils/            # Utilitários (tokens JWT)
│   │   ├── index.js          # Servidor
│   │   └── app.js            # app Express
│   ├── package.json
│   ├── docker-compose.yml    # Configura Banco de dados e API
│   └── README.md
│
└── frontend/                # Frontend
    ├── src/
    │   ├── api/             # Client HTTP
    │   ├── screens/         # Telas
    │   ├── stores/          # Context API
    │   ├── navigation/      # React Navigation
    │   ├── components/      # Componentes (futuro)
    │   └── utils/           # Utilitários
    ├── App.js
    ├── app.json
    ├── package.json
    └── README.md
```

## SETUP

### Backend

1. **Instale dependências**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```

3. **Inicie MongoDB**:

   **Docker Compose**
   ```bash
   docker-compose up
   ```

4. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

### Frontend

1. **Instale dependências**:
   ```bash
   cd mobile
   npm install
   ```

2. **Inicie Expo**:
   ```bash
   npm start
   ```

## 📋 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `DELETE /api/auth/account` - Desativar conta
- `GET /api/auth/me` - Dados do usuário

### Pets
- `POST /api/pets` - Criar pet
- `GET /api/pets` - Listar pet
- `PUT /api/pets/:id` - Editar pet
- `DELETE /api/pets/:id` - Deletar pet

### Eventos
- `POST /api/events` - Criar evento
- `GET /api/events` - Listar eventos
- `PUT /api/events/:id` - Editar evento
- `DELETE /api/events/:id` - Deletar evento

## Readme dos projetos

- [Backend README](./backend/README.md)
- [Mobile README](./mobile/README.md)