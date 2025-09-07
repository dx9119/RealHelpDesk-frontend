# RealHelpDesk-frontend
Эксперимент по созданию фронтенда на React с использованием инструментов искусственного интеллекта. Компоненты формировались поэтапно на основе заданных условий, с частичным ручным редактированием.

## components

Содержит переиспользуемые UI-компоненты, сгруппированные по функциональным областям:

- **auth** — компоненты для аутентификации, регистрации:
    - `LoginForm.jsx`
    - `Logout.jsx`
    - `RegisterForm.jsx`

- **captcha** — отображение капчи:
    - `CaptchaViewer.jsx`

- **email** — управление email-уведомлениями:
    - `EmailNotificationInfo.jsx`
    - `EmailNotificationPolicy.jsx`
    - `EmailNotificationSettings.jsx`
    - `EmailVerificationForm.jsx`
    - `EmailVerification.js`
    - `NotificationSettings.js`

- **help** — поиск по заявкам:
    - `SearchHelp.jsx`

- **message** — работа с сообщениями:
    - `MessagesList.jsx`
    - `TicketMessageForm.jsx`

- **portal** — управление порталами и пользователями:
    - `AddPortalUsers.jsx`
    - `CreatePortal.jsx`
    - `DeletePortals.jsx`
    - `ManagePortalUsers.jsx`
    - `PortalEditor.jsx`
    - `PortalInfo.jsx`
    - `PortalSettings.jsx`
    - `SharedPortals.jsx`
    - `UserPortals.jsx`

- **tiket** — компоненты для работы с тикетами:
    - `CreateTicketForm.jsx`
    - `NoAnswerTickets.jsx`
    - `PortalTickets.jsx`
    - `SearchTicketByPortals.jsx`
    - `TicketDelete.jsx`
    - `TicketIdListByType.jsx`
    - `TicketList.jsx`
    - `TicketSearchForm.jsx`
    - `TicketSearchResults.jsx`
    - `TicketView.jsx`

- **user** — управление профилем пользователя:
    - `UserAccount.jsx`
    - `UserProfileForm.jsx`
    - `UserProfile.jsx`

## pages

Страницы приложения:

- Основные страницы:
    - `CreateTicketPage.jsx`
    - `Footer.jsx`
    - `Header.jsx`
    - `HomePage.jsx`
    - `LoginPage.jsx`
    - `MyTicketPage.jsx`
    - `NotifyPage.jsx`
    - `OpenTicketPage.jsx`
    - `PasswordResetPage.jsx`
    - `PortalPage.jsx`
    - `PortalSettingsPage.jsx`
    - `ProfilePage.jsx`
    - `RegisterPage.jsx`
    - `TicketsPage.jsx`

- Страницы ошибок:
    - `ErrorPage.jsx`
    - `Page403.jsx`
    - `Page418.jsx`
    - `Page500.jsx`


## services

Сервисы для работы с API и авторизацией:

- `authService.js`
- `axiosInstance.js`

---
