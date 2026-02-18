# Só Uma Coisa — Próximas Etapas do Projeto

Etapas ordenadas para seguir o escopo do frontend Angular com identidade visual (Tailwind, Standalone Components, Signals).

---

## Fase 1 — Setup do Projeto

- [ ] **1.1** Garantir projeto com `--routing`, `--style=css`, `--standalone` (ou ajustar o existente)
- [ ] **1.2** Instalar dependências: `npm install tailwindcss @tailwindcss/forms postcss autoprefixer`
- [ ] **1.3** Inicializar Tailwind: `npx tailwindcss init`
- [ ] **1.4** Configurar `tailwind.config.js` com todos os tokens da identidade visual:
  - Cores: `ink`, `cream`, `warm-white`, `accent`, `accent-light`, `accent-pale`, `muted`, `border`, `moss`, `moss-pale`
  - Fontes: `sans` (Inter), `serif` (Fraunces)
  - Border radius: `card`, `btn`, `tag`
  - Box shadow: `card`, `phone`
  - Plugin: `@tailwindcss/forms`
- [ ] **1.5** Em `styles.css`: adicionar `@import` das fontes Google (Inter + Fraunces) e diretivas `@tailwind base/components/utilities`
- [ ] **1.6** Configurar `@layer base` em `styles.css`: `body` com `font-sans bg-warm-white text-ink antialiased`
- [ ] **1.7** Criar `environments/`: `environment.ts` (apiUrl dev) e `environment.prod.ts` (apiUrl produção)

---

## Fase 2 — Estrutura de Pastas (Feature-First)

- [x] **2.1** Criar estrutura sob `src/app/`:
  - `core/` → `guards/`, `interceptors/`, `models/`, `services/`
  - `shared/` → `components/`, `pipes/`
  - `features/` → `auth/`, `today/`, `history/`, `settings/`
- [x] **2.2** Garantir que todos os componentes sejam **Standalone** (sem NgModules)

---

## Fase 3 — Core: Modelos e Configuração

- [x] **3.1** Criar `core/models/user.model.ts`: interfaces `User`, `AuthResponse`
- [x] **3.2** Criar `core/models/daily-entry.model.ts`: interfaces `DailyEntry`, `HistoryResponse`
- [x] **3.3** Configurar `app.config.ts`:
  - `provideRouter(routes, withComponentInputBinding())`
  - `provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor]))`
- [x] **3.4** Configurar `app.routes.ts`: rotas raiz com lazy loading e `authGuard` onde aplicável
- [x] **3.5** Manter `app.component.ts` minimalista (apenas `<router-outlet>`)

---

## Fase 4 — Core: Guards e Interceptors

- [x] **4.1** Implementar `auth.guard.ts` (CanActivateFn): redirecionar para `/auth/login` se não autenticado
- [x] **4.2** Implementar `jwt.interceptor.ts`: adicionar header `Authorization: Bearer <token>` quando houver token
- [x] **4.3** Implementar `error.interceptor.ts`: em 401 fazer logout e redirecionar para login

---

## Fase 5 — Core: Services

- [ ] **5.1** **AuthService**: Signals `currentUser`, `isLoggedIn`; métodos `register`, `login`, `logout`, `getToken`, `isAuthenticated`; `fetchMe()` no construtor se houver token
- [ ] **5.2** **TodayService**: signal `today` (undefined | null | DailyEntry); métodos `load()`, `create(intention)`, `complete(completed)`, `skip()`
- [ ] **5.3** **HistoryService**: método `getMonth(month: string)` retornando `HistoryResponse`

---

## Fase 6 — Shared: Componentes e Pipes

- [ ] **6.1** **NavbarComponent**: links para home, history, settings; usar `RouterLinkActive` com `text-accent` na rota ativa (identidade visual)
- [ ] **6.2** **LoadingSpinnerComponent**: spinner de carregamento usando classes Tailwind da identidade
- [ ] **6.3** **FormatDatePipe**: transformar `YYYY-MM-DD` em data legível em pt-BR

---

## Fase 7 — Feature: Auth

- [ ] **7.1** Criar `features/auth/auth.routes.ts` (lazy)
- [ ] **7.2** **LoginComponent**: formulário email/senha, botão CTA `bg-accent`, chamada ao AuthService
- [ ] **7.3** **RegisterComponent**: formulário displayName, email, senha; mesmo padrão visual
- [ ] **7.4** Testar fluxo completo: registro → login → redirecionamento para `/home`

---

## Fase 8 — Feature: Today (Fluxo do Dia)

- [ ] **8.1** Criar `features/today/today.routes.ts` (lazy, protegido por authGuard)
- [ ] **8.2** **TodayComponent** (orquestrador):
  - Injetar `TodayService`; `viewState` computed a partir de `today` (loading | morning | focus | done)
  - Template com `@switch (viewState())`: LoadingSpinner, CheckinMorning, FocusCard, DayDone
  - `ngOnInit` → `svc.load()`; handler `onChecked` chamando `svc.complete(v)`
- [ ] **8.3** **CheckinMorningComponent**: fundo `bg-ink`, título serif italic creme, input com borda accent, botão "Definir minha coisa" e "pular por hoje"
- [ ] **8.4** **FocusCardComponent**: input `[entry]`, output `(checked)`; card com intenção; botões "Fiz isso" (moss-pale) e "Não fiz" (accent-pale)
- [ ] **8.5** **DayDoneComponent**: exibir estado do dia encerrado (usar `[entry]` e identidade visual)

---

## Fase 9 — Feature: History

- [ ] **9.1** Criar `features/history/history.routes.ts` (lazy, authGuard)
- [ ] **9.2** **HistoryComponent**: container da tela de histórico; integrar calendário e possível seletor de mês
- [ ] **9.3** **CalendarComponent**: lógica de cores por estado do dia:
  - `completed === true` → `bg-moss text-white`
  - `completed === false` → `bg-accent text-white`
  - `skipped === true` → `bg-border text-muted`
  - Futuro/sem entrada → `bg-warm-white/50 text-muted`
  - Hoje sem entrada → `bg-warm-white ring-2 ring-accent text-ink`

---

## Fase 10 — Feature: Settings

- [ ] **10.1** Criar `features/settings/settings.routes.ts` (lazy, authGuard)
- [ ] **10.2** **SettingsComponent**: formulário de edição (ex.: displayName, timezone) + botão de logout

---

## Fase 11 — Revisão e Polimento

- [ ] **11.1** Garantir que nenhum componente use cores ou fontes hardcoded — apenas classes Tailwind semânticas (`bg-ink`, `text-accent`, `font-serif`, etc.)
- [ ] **11.2** Conferir roteamento: `/` → `/home`, `**` → `/home`; rotas auth sem guard; home/history/settings com authGuard
- [ ] **11.3** Testar integração com a API Symfony (ambiente configurado em `environment.ts`)

---

## Referência Rápida — Identidade Visual

| Elemento           | Background   | Texto / Detalhe        |
|--------------------|-------------|-------------------------|
| Tela escura (check-in) | `bg-ink`    | `text-cream`            |
| Tela clara         | `bg-warm-white` | `text-ink`          |
| Card de intenção   | `bg-ink`    | `text-cream`, `border-accent/30` |
| CTA / Botão primário | `bg-accent` | `text-cream`, hover `bg-accent-light` |
| Fiz isso           | `bg-moss-pale` | `text-moss`          |
| Não fiz            | `bg-accent-pale` | `text-accent`       |

**Fontes:** títulos/destaque → `font-serif` (Fraunces); corpo/UI → `font-sans` (Inter).

---

*Só Uma Coisa: foco total. todo dia.*
