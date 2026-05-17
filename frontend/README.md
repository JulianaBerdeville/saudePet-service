# SaudePet - Frontend

App móvel para gestão de saúde de pets com React Native + Expo.

## Tecnologias

- React Native
- Expo
- React Navigation
- Axios para chamadas API
- Expo Secure Store para token seguro

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar URL da API

Abra `src/api/client.js` e ajuste a `API_URL` para sua máquina:

```javascript
const API_URL = 'http://192.168.1.X:4000/api'; // Use seu IP local
```

Para emulador Android: `10.0.2.2:4000`
Para emulador iOS: `localhost:4000`

### 3. Rodar app

Comando geral (escolha plataforma no menu):
```bash
npm start
```

Ou específico:
```bash
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

### 4. Testando

- Escaneie o QR code com Expo Go (app gratuito).
- Ou rode em emulador.

## Estrutura

```
src/
├── api/
│   ├── client.js        # Cliente HTTP com interceptor de token
│   ├── auth.js          # Endpoints de autenticação
│   ├── pets.js          # Endpoints de pets
│   └── events.js        # Endpoints de eventos
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js        # Lista de pets
│   ├── PetFormScreen.js     # Criar/editar pet
│   ├── PetDetailsScreen.js  # Lista de eventos do pet
│   ├── EventFormScreen.js   # Criar/editar evento
│   └── ProfileScreen.js     # Perfil, logout, desativar
├── stores/
│   └── authContext.js   # Context + reducer para autenticação
├── navigation/
│   └── RootNavigator.js # Stack de navegação (Auth/App)
└── components/          # Componentes reutilizáveis (futuro)
```

## Fluxo de autenticação

1. **Inicialização**: AuthProvider restaura token do SecureStore
2. **Login/Register**: Salva token e seta no axios header
3. **Requisições**: Token incluído em `Authorization: Bearer <token>`
4. **Logout**: Remove token do storage e clears context

## Endpoints consumidos

### Autenticação
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- DELETE /auth/account

### Pets
- POST /pets
- GET /pets
- GET /pets/:id
- PUT /pets/:id
- DELETE /pets/:id

### Eventos
- POST /events
- GET /events
- GET /events/:id
- PUT /events/:id
- DELETE /events/:id

## Funcionalidades

✓ Criar conta
✓ Login/Logout
✓ Desativar conta
✓ Criar pet
✓ Editar pet
✓ Apagar pet
✓ Registrar evento (vacina, consulta, medicamento, banho, tosa, outro)
✓ Editar evento
✓ Apagar evento
✓ Listar pets e eventos do pet
✓ Armazenamento seguro de token

## Segurança

- Token JWT armazenado em `expo-secure-store` (mais seguro que AsyncStorage)
- Token enviado em header para cada requisição autenticada
- Logout limpa o storage
- Verificação se usuário está ativo na API

## TODO

- [ ] Testes automatizados
- [ ] Upload de fotos de pets (câmera/galeria)
- [ ] Notificações push para lembretes de eventos
- [ ] Modo offline com sincronização
- [ ] Filtros avançados de eventos (data range)
- [ ] Backup/restore de dados

## Problemas comuns

### "Cannot connect to API"
- Verifique se backend está rodando em `http://localhost:4000`
- No emulador, use `10.0.2.2:4000` (Android) ou `localhost:4000` (iOS)
- Se no device físico, use seu IP local: `http://192.168.X.X:4000`

### Token não persiste
- Cheque se `expo-secure-store` está configurado
- No web, cai back para AsyncStorage (menos seguro)

## Build e Deploy

### EAS (Expo Application Services)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
eas submit  # Submeter para App Store/Play Store
```

Mais em: https://docs.expo.dev/eas/

## License

ISC
