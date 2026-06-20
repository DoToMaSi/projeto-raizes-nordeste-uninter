# Raízes do Nordeste

Front-end de um sistema de franquia de alimentação nordestina, desenvolvido como projeto acadêmico. A aplicação simula um canal de pedidos multiplataforma (Web, Mobile e Totem) com autenticação, cardápio dinâmico por loja, carrinho, fidelidade, pagamento externo mockado e acompanhamento de pedidos.

**Demo ao vivo:** [https://dotomasi.github.io/projeto-raizes-nordeste-uninter/](https://dotomasi.github.io/projeto-raizes-nordeste-uninter/)

---

## GitHub

| Recurso | URL |
| --- | --- |
| Repositório | [github.com/DoToMaSi/projeto-raizes-nordeste-uninter](https://github.com/DoToMaSi/projeto-raizes-nordeste-uninter) |
| GitHub Pages | [dotomasi.github.io/projeto-raizes-nordeste-uninter](https://dotomasi.github.io/projeto-raizes-nordeste-uninter/) |
| Issues | [github.com/DoToMaSi/projeto-raizes-nordeste-uninter/issues](https://github.com/DoToMaSi/projeto-raizes-nordeste-uninter/issues) |

**Autor:** Douglas Tomacheski de Abreu e Silva — [dotomasi@outlook.com](mailto:dotomasi@outlook.com)

---

## Funcionalidades

| ID | Descrição |
| --- | --- |
| **FR01** | Cadastro, login e consentimento LGPD antes da coleta de dados |
| **FR02** | Seleção de loja com cardápio e preços dinâmicos por unidade |
| **FR03** | Navegação no cardápio, personalização de itens e carrinho reativo |
| **FR04** | Programa de fidelidade — pontos convertidos em desconto no checkout |
| **FR05** | Fluxo de pagamento desacoplado com gateway externo simulado |
| **FR06** | Acompanhamento de pedido em tempo real simulado (Recebido → Cozinha → Pronto) |

### Fluxo principal

1. Aceitar o modal de privacidade (LGPD)
2. Fazer login ou cadastro
3. Escolher a loja (ex.: Recife - Centro)
4. Navegar pelo cardápio (Tapiocas, Cuscuz, Bebidas)
5. Personalizar item e adicionar ao carrinho
6. Finalizar pedido com opção de usar pontos de fidelidade
7. Pagar via gateway mockado externo
8. Acompanhar status do pedido na timeline

### Conta demo

| Campo | Valor |
| --- | --- |
| E-mail | `maria@email.com` |
| Senha | `123456` |
| Pontos | 500 (equivale a R$ 5,00 de desconto) |

---

## Stack tecnológica

- **Angular 20** — componentes standalone, zoneless change detection
- **Angular Signals** — `signal`, `computed`, `effect`, `input`, `output`
- **Injeção moderna** — `inject()` em serviços e componentes
- **Control flow nativo** — `@if`, `@for`, `@switch`
- **Tailwind CSS v4** — estilização via utility classes
- **daisyUI** — componentes semânticos (`btn`, `card`, `modal`, `navbar`, `steps`, etc.)
- **Reactive Forms** — formulários reativos
- **Mock data** — JSON local simulando backend (`src/assets/mock/`)

---

## Arquitetura

```
src/app/
├── core/
│   ├── models/       # User, Store, Product, CartItem, Order, LgpdConsent
│   ├── guards/       # lgpd, auth, store, home-redirect
│   └── services/     # Auth, Cart, Menu, Order, Payment, Loyalty, etc.
├── features/
│   ├── lgpd/         # Modal de consentimento
│   ├── auth/         # Login e cadastro
│   ├── store/        # Seleção de loja
│   ├── menu/         # Cardápio e personalização
│   ├── cart/         # Carrinho e checkout
│   ├── payment/      # Gateway mockado externo
│   └── order/        # Acompanhamento de pedido
└── shared/
    └── components/   # App shell (navbar + bottom nav)
```

Estado global gerenciado por serviços singleton com Signals (`providedIn: 'root'`). Dados mockados carregados via `HttpClient` a partir de arquivos JSON.

### Rotas

| Rota | Descrição |
| --- | --- |
| `/auth/login` | Login |
| `/auth/register` | Cadastro |
| `/loja` | Seleção de loja |
| `/cardapio` | Cardápio da loja selecionada |
| `/carrinho` | Carrinho de compras |
| `/checkout` | Finalização com fidelidade |
| `/pagamento/:orderId/aguardando` | Aguardando redirecionamento |
| `/pagamento/:orderId/gateway` | Gateway externo simulado |
| `/pagamento/:orderId/callback` | Retorno do pagamento |
| `/pedido/:orderId` | Timeline do pedido |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 22+
- npm 10+

---

## Desenvolvimento local

```bash
# Clonar o repositório
git clone https://github.com/DoToMaSi/projeto-raizes-nordeste-uninter.git
cd projeto-raizes-nordeste-uninter

# Instalar dependências
npm ci

# Servidor de desenvolvimento
npm start
```

Acesse [http://localhost:4200](http://localhost:4200). A aplicação recarrega automaticamente ao salvar alterações.

### Scripts disponíveis

| Script | Comando | Descrição |
| --- | --- | --- |
| `start` | `npm start` | Servidor de desenvolvimento |
| `build` | `npm run build` | Build de produção |
| `build:pages` | `npm run build:pages` | Build otimizado para GitHub Pages |
| `test` | `npm test` | Testes unitários (Karma + Jasmine) |
| `watch` | `npm run watch` | Build contínuo em modo development |

---

## CI/CD

O projeto usa GitHub Actions com dois fluxos separados por branch:

### CI — branch `develop`

Arquivo: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

- Dispara em **push** e **pull requests** para `develop`
- Executa testes e build padrão
- Uso: desenvolvimento e validação contínua

### Deploy — branch `master`

Arquivo: [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml)

- Dispara apenas em **push** para `master` (ou manualmente via `workflow_dispatch`)
- Executa testes → build com `baseHref` para GitHub Pages → deploy
- Publica em: **https://dotomasi.github.io/projeto-raizes-nordeste-uninter/**

### Fluxo de branches recomendado

```
develop  →  commits diários, CI automático
   ↓
master   →  merge para release, deploy automático no GitHub Pages
```

> **Configuração única no GitHub:** em *Settings → Pages*, selecione **GitHub Actions** como source.

---

## Lojas e cardápio mock

Três unidades disponíveis com preços distintos:

- Recife - Centro
- Recife - Boa Viagem
- Olinda - Histórico

Categorias: **Tapiocas**, **Cuscuz**, **Bebidas** — cada produto suporta tamanho (P/M/G) e adicionais.

Arquivos de dados em [`src/assets/mock/`](src/assets/mock/).

---

## Requisitos não funcionais

- **Mobile-first** — layout responsivo com bottom nav no mobile e navbar no desktop/tablet
- **Acessibilidade** — alvos de toque ≥ 44×44 px, contraste via tema daisyUI
- **Performance** — estado derivado via `computed()`, sem subscriptions RxJS desnecessárias

---

## Licença

Projeto privado (`"private": true`). Todos os direitos reservados ao autor.
