# CRM v2 MVP — Product & Technical Blueprint

## 1) Цели MVP

Собрать «чистую» CRM с нуля для процесса dealflow:

- единая база инвесторов;
- база проектов;
- этапы сделки и статусный pipeline;
- история коммуникаций;
- Excel-импорт + ручной ввод;
- матчинг инвестор ↔ проект (прозрачный score + AI-комментарий);
- аудит действий пользователей.

## 2) Роли

- **Analyst**: ведет базу, импортирует данные, запускает матчинг, вносит касания.
- **Partner**: просматривает/подтверждает гипотезы, управляет pipeline и решениями.
- **Admin**: управляет справочниками, ролями и доступом.

## 3) Сущности MVP

1. **investors**
2. **projects**
3. **deals**
4. **deal_stages** (справочник с возможностью редактировать порядок)
5. **communications**
6. **matching_runs**
7. **matching_feedback** (обучающий контур)
8. **message_templates**
9. **audit_log**

## 4) Поля (MVP)

### Investors (обязательные)

- name
- investor_type
- stage_focus
- sector_focus
- geography_focus
- check_size_min / check_size_max
- source

### Projects (обязательные)

- name
- sector
- stage
- geography
- raise_target_usd
- summary

### Deals (обязательные)

- investor_id
- project_id
- stage_id
- deal_type (equity / debt / venture_loan / other)
- amount_usd (nullable)
- owner_user_id

### Communications (обязательные)

- deal_id
- channel (email/call/meeting/telegram/other)
- direction (inbound/outbound)
- happened_at
- summary
- next_action / next_action_at

## 5) Матчинг MVP

### 5.1 Прозрачный scoring

Весовая модель (настраиваемая):

- sector fit — 35
- stage fit — 25
- geography fit — 20
- check size fit — 10
- relationship warmth — 10

### 5.2 AI layer

Для top-N из rule-based матчинга:

- AI объяснение «почему подходит/не подходит»;
- AI draft первого контакта;
- предложение `next_action`.

### 5.3 Обучение от пользователя

Аналитик/партнер фиксирует:

- verdict: accepted / rejected / uncertain;
- комментарий «почему».

Эти данные пишутся в `matching_feedback` и используются в следующих версиях ранжирования.

## 6) Импорт данных

Режимы:

1. **Excel Batch Import**
   - upload файла;
   - preview распознавания;
   - подсветка ошибок по строкам;
   - soft-dedup (по нормализованным полям: name + type + geography);
   - upsert с отчетом.

2. **Manual form**
   - форма создания инвестора/проекта.

3. **Quick-add list**
   - быстрый ввод нескольких записей подряд.

## 7) UI (первый релиз)

- Dashboard (pipeline snapshot)
- Investors
- Projects
- Deals
- Matching
- Communications timeline
- Templates
- Import Center
- Audit Log (read-only)

## 8) API (первый срез)

- `POST /api/import/investors/preview`
- `POST /api/import/investors/commit`
- `POST /api/investors`
- `POST /api/projects`
- `POST /api/deals`
- `POST /api/communications`
- `POST /api/matching/run`
- `POST /api/matching/feedback`

## 9) План реализации (итеративно)

### Iteration 1
- SQL schema + RLS baseline.
- CRUD investors/projects/deals.
- Deal stages configurable.
- Communications timeline.

### Iteration 2
- Import Center (preview/validate/dedup/commit).
- Rule-based matcher.
- AI explanation + template generation.

### Iteration 3
- Feedback loop + ranking adjustments.
- Audit log UI.
- Hardening + acceptance tests.

## 10) Интеграции (MVP)

- **Supabase**: DB, auth, storage (для Excel файлов).
- **Vercel**: deploy + env management.
- **Telegram**: отложено на post-MVP (по согласованию).
- **External CRM API**: закладываем интерфейс адаптера, без реализации в MVP.
