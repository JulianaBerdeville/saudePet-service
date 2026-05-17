# SaúdePet - Service

Aplicação criada para atender à disciplina de Projeto Integrador em Ciência de Dados da Universidade Virtual do Estado de São Paulo. (PI III Turma 10).
Esta é uma aplicação monorepo contendo o backend (API REST em Node/Express) e o frontend mobile (React Native / Expo) para gestão da saúde de pets.

## Visão geral

- Backend: Express + MongoDB. Contendo endpoints para autenticação, pets e eventos (vacinas, consultas, etc.).
- Frontend: Expo (React Native).

## Estrutura do repositório

- `backend/` - API Node.js
- `frontend/` - App mobile (Expo / React Native)

## Pré-requisitos

- Node.js 18+;
- npm;
- Docker & docker-compose;
- Expo CLI.

## Backend

### Instalação de dependências

```bash
cd backend
npm install
```

### env vars

Crie um `.env` na pasta `backend/` com pelo menos:

```
PORT=3000
MONGO_URI=mongodb://mongo:27017/saudepet
JWT_SECRET=uma_chave_secreta
```

Caso faça uso do docker-compose estes valores podem ser definidos em `docker-compose.yml`.

### Scripts

- `npm run start` — inicia a API;
- `npm run dev` — inicia com `nodemon`;
- `npm run test` — executa testes;
- `npm run lint` — roda ESLint.

### Endpoints principais

- `POST /api/auth/register` — cria usuário;
- `POST /api/auth/login` — login, que retorna `token` e `user`;
- `GET /api/auth/me` — retorna dados do usuário autenticado (requer header `Authorization: Bearer <token>`);
- `POST /api/auth/logout` — logout;
- `DELETE /api/auth/account` — desativa conta;

- `GET /api/pets` — listar pets vinculado ao usuário logado;
- `POST /api/pets` — adiciona pet;

- `GET /api/events` — lista eventos;
- `POST /api/events` — cria evento (suporta evento de `type: 'vacina'` com subdocumento `vaccine`);

Nota: leia `backend/README.md` para documentação adicional dos endpoints.

## Frontend (mobile)

### Instalação de dependências

```bash
cd frontend
npm install
```

### Inicilaizando o projeto

- Inicie o backend (local ou via docker-compose);
- No `frontend/`:

```bash
npm start
# ou
expo start
```

## Contribuição

- Para rodar localmente com containers:

```bash
docker-compose up 
docker-compose logs -f
```

- Para rodar só o backend localmente:

```bash
cd backend
npm run dev
```

- Para rodar o frontend localmente:

```bash
cd frontend
npm start
```