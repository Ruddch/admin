# Admin Panel

Админ-панель для управления токенами, карточками, турнирами и пользователями.

## Структура проекта

```
src/
├── api/              # API слой
│   ├── types.ts      # Типы для всех сущностей
│   ├── authApi.ts    # API для авторизации
│   ├── tokensApi.ts  # API для токенов
│   ├── cardsApi.ts   # API для карточек
│   ├── tournamentsApi.ts # API для турниров
│   └── usersApi.ts   # API для пользователей
├── auth/             # Модуль авторизации
│   └── AuthContext.tsx # Контекст авторизации
├── components/       # Переиспользуемые компоненты
│   ├── Sidebar.tsx   # Боковое меню
│   └── Header.tsx    # Шапка админки
├── layouts/          # Layout компоненты
│   └── AdminLayout.tsx # Основной layout с sidebar и header
├── pages/            # Страницы приложения
│   ├── LoginPage.tsx      # Страница входа
│   ├── TokensPage.tsx     # Страница управления токенами
│   ├── CardsPage.tsx      # Страница управления карточками
│   ├── TournamentsPage.tsx # Страница управления турнирами
│   └── UsersPage.tsx      # Страница управления пользователями
├── router/           # Роутинг
│   └── AppRouter.tsx # Конфигурация маршрутов
├── utils/            # Утилиты
│   └── cookies.ts    # Работа с cookies
├── App.tsx           # Корневой компонент
└── main.tsx          # Точка входа
```

## Установка и запуск

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать проект
npm run build
```

## Деплой на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Настройка репозитория:

1. Перейдите в Settings → Pages вашего репозитория
2. В разделе "Source" выберите "GitHub Actions"
3. Убедитесь, что workflow файл `.github/workflows/deploy.yml` находится в репозитории

### Настройка base path:

Если ваш репозиторий **не в корне** GitHub Pages (например, `username.github.io/admin`):

1. Откройте `.github/workflows/deploy.yml`
2. Найдите секцию `env` в шаге "Build"
3. Раскомментируйте строку с `VITE_BASE_PATH` и укажите правильный путь:
   ```yaml
   VITE_BASE_PATH: '/admin/'
   ```
   Где `admin` - это название вашего репозитория

Если репозиторий **в корне** GitHub Pages (например, `username.github.io`), оставьте `VITE_BASE_PATH` закомментированным - будет использоваться значение по умолчанию `/`.

### Переменные окружения (опционально):

Если нужно изменить базовый URL API, добавьте секрет в Settings → Secrets and variables → Actions:
- `VITE_API_BASE_URL` - базовый URL API (по умолчанию: `https://back.hodleague.com`)

### Автоматический деплой:

После настройки, каждый push в ветку `main` автоматически запустит сборку и деплой на GitHub Pages.

Также можно запустить деплой вручную через Actions → Deploy to GitHub Pages → Run workflow.

## Функциональность

- ✅ Авторизация по логину и паролю
- ✅ Защищенные маршруты
- ✅ Навигация между страницами
- ✅ Layout с Sidebar и Header
- ✅ Страницы для управления: Tokens, Cards, Tournaments, Users
- ✅ Фильтры для всех списков
- ✅ CRUD операции для всех сущностей
- ✅ API интеграция с реальным бэкендом
