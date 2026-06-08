# Задание: Расширение веб-приложения для онлайн-записи к мастерам салона красоты

## Контекст проекта

У меня есть уже работающее full-stack веб-приложение для онлайн-записи клиентов к мастерам салона красоты. Стек:
- **Frontend** (`frontend/`): React.js + Vite + TailwindCSS + React Router + Axios + React Context API (AppContext)
- **Admin panel** (`admin/`): отдельное React-приложение с контекстами AdminContext, MasterContext, AppContext
- **Backend** (`backend/`): Node.js + Express.js + Mongoose + MongoDB Atlas; структура MVC — routes/, controllers/, models/
- **Доп. сервисы**: Cloudinary (медиафайлы через Multer), JWT + bcrypt (аутентификация), Stripe/Razorpay (оплата)

**Существующие API-группы**: `/api/user`, `/api/admin`, `/api/master`

**Существующие коллекции MongoDB**:
- `users` — пользователи
- `masters` — мастера красоты (поля: name, email, password, image, speciality, slots_booked и др.)
- `appointments` — записи на приём

## Что нужно реализовать

### 1. Расширение моделей данных

**masterModel.js** — добавить поля:
- `portfolio` — массив объектов `{ imageUrl: String, category: String, description: String, createdAt: Date }`
- `rating` — Number (default: 0)
- `reviewCount` — Number (default: 0)

**userModel.js** — добавить поля:
- `bonusPoints` — Number (default: 0)
- `totalVisits` — Number (default: 0)
- `achievements` — массив строк (например: ["first_visit", "loyal_client", "vip"])
- `isVip` — Boolean (default: false)

**Новая коллекция reviewModel.js**:
- masterId, userId, appointmentId (только после завершённого визита), rating (1–5), comment, isApproved (default: false), createdAt

**Новая коллекция chatModel.js**:
- userId, messages: [{ sender: "user" | "admin", text, createdAt }]

### 2. Новые API-маршруты (backend)

**Портфолио** (`/api/master/portfolio`):
- `POST /api/master/portfolio` — загрузка фото через Cloudinary + Multer
- `DELETE /api/master/portfolio/:imageId` — удаление из портфолио и Cloudinary
- `GET /api/master/portfolio/:masterId` — получение портфолио

**Отзывы** (`/api/user/reviews`):
- `POST /api/user/reviews` — публикация отзыва (только если appointmentId имеет статус "completed")
- `GET /api/user/reviews/:masterId` — одобренные отзывы мастера
- `DELETE /api/user/reviews/:reviewId` — удаление своего отзыва

При создании/удалении отзыва — автоматически пересчитывать `rating` и `reviewCount` у мастера через агрегацию MongoDB.

**Лояльность** (`/api/user/loyalty`):
- `GET /api/user/loyalty` — баланс бонусов, достижения, статус VIP
- `POST /api/user/use-bonus` — списать бонусные баллы при оплате

Логика начисления бонусов (вызывать при завершении визита):
- +5% от стоимости услуги в бонусных баллах
- +1 к totalVisits
- Достижения: "first_visit" (1 визит), "loyal_client" (5 визитов), "vip" (10 визитов или bonusPoints >= 1000)
- isVip = true при соответствии условиям

**Модерация отзывов** (`/api/admin/reviews`):
- `GET /api/admin/reviews` — все отзывы включая неодобренные
- `PATCH /api/admin/reviews/:reviewId/approve` — одобрить
- `DELETE /api/admin/reviews/:reviewId` — удалить

**Чат поддержки**:
- `GET /api/user/chat` — история чата текущего пользователя
- `POST /api/user/chat` — отправить сообщение от пользователя
- `GET /api/admin/chats` — список всех чатов
- `POST /api/admin/chat/:userId` — ответить пользователю от администратора

### 3. Frontend-компоненты (React)

**Страница мастера**:
- Галерея портфолио с фильтрацией по категории
- Блок отзывов: звёздный рейтинг, список одобренных отзывов, форма добавления отзыва (только при наличии завершённого визита)
- Средний рейтинг и количество отзывов рядом с именем мастера

**Каталог мастеров**:
- Сортировка по рейтингу (по убыванию)
- Звёздный рейтинг в карточке мастера

**Личный кабинет пользователя**:
- Раздел «Мои достижения»: бонусные баллы, список достижений с иконками, прогресс до следующего уровня, статус VIP
- Возможность использовать бонусные баллы при оплате в разделе «Мои записи»

**Виджет чата поддержки**:
- Плавающая кнопка в правом нижнем углу на клиентской части
- Окно чата с историей сообщений и полем ввода
- В админ-панели: список чатов и интерфейс ответа администратора

**Административная панель**:
- Страница модерации отзывов: просмотр, «Одобрить» / «Удалить»
- Управление портфолио мастера: загрузка и удаление изображений

### 4. Адаптивность

Все новые компоненты — адаптивные (mobile / tablet / desktop) через TailwindCSS breakpoints: `sm:`, `md:`, `lg:`.

## Порядок выполнения

1. Изучи текущую структуру проекта (модели, маршруты, компоненты)
2. Расширь Mongoose-схемы (masterModel, userModel, создай reviewModel, chatModel) 
3. Реализуй backend-маршруты и контроллеры
4. Реализуй frontend-компоненты
5. Подключи всё к административной панели
6. Проверь адаптивность