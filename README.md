# Starian Test

CRUD de produtos construído com Angular 21 e Angular Material 21, seguindo boas práticas de arquitetura, reatividade via signals e qualidade garantida por testes unitários.

---

## Stack

| Camada                 | Tecnologia                                | Justificativa                                                                                                           |
| ---------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Framework              | Angular 21                                | Última versão estável; suporte nativo a signals e componentes standalone                                                |
| UI                     | Angular Material 21 (M3)                  | Design system maduro, acessível e alinhado ao Material Design 3                                                         |
| Testes                 | Vitest + Angular TestBed                  | Vitest é significativamente mais rápido que Jest no ecossistema Angular; integração nativa com o builder do Angular CLI |
| Estilo                 | SCSS com mixins                           | Separação entre lógica de estilo (mixins em `_typography.scss`) e aplicação por componente, sem poluir o escopo global  |
| Gerenciador de pacotes | Yarn 3 (Berry)                            | Resolução determinística de dependências via PnP                                                                        |
| Commits                | Conventional Commits + commitlint + Husky | Histórico legível e padronizado; permite geração de changelogs automáticos                                              |
| Formatação             | Prettier                                  | Estilo de código consistente sem debate, aplicado via lint-staged no pre-commit                                         |

---

## Arquitetura

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces e tipos do domínio
│   │   └── services/        # Serviços com lógica de negócio e HTTP
│   ├── features/
│   │   └── products/
│   │       ├── product-list/          # Listagem de produtos
│   │       │   ├── product-delete-button/  # Botão de exclusão (componente isolado)
│   │       │   └── product-delete-dialog/  # Dialog de confirmação
│   │       ├── product-form/          # Formulário compartilhado (criar/editar)
│   │       └── product-edit/          # Tela de edição (carrega produto e delega ao form)
│   └── shared/
│       └── components/
│           └── page-header/   # Header reutilizável com título e botão voltar
└── styles/
    └── _typography.scss       # Mixins de tipografia (escala Roboto)
```

### Decisões de design

**Signals em vez de BehaviorSubject**
Os serviços utilizam `signal()` do Angular para estado reativo. Signals têm leitura síncrona, granularidade de rastreamento mais precisa que o `ChangeDetectionStrategy.OnPush` com observables, e eliminam a necessidade de `async pipe` e gerenciamento explícito de subscriptions na maioria dos casos.

**Serviços separados por responsabilidade**

- `ProductListService` — carregamento e exclusão da lista
- `ProductGetService` — busca de produto individual por ID
- `ProductFormService` — criação e atualização (salvar)

Essa divisão evita que um único serviço acumule estado conflitante entre telas diferentes (ex: `loading` de lista vs. `loading` de formulário).

**`deletingProductIds: signal<Set<number>>`**
A exclusão usa um `Set` em vez de um único `number | null`, permitindo que o usuário dispare exclusões paralelas de produtos diferentes sem que um cancele o estado do outro.

**`ProductDeleteButtonComponent` isolado**
O botão de exclusão encapsula toda sua responsabilidade: abrir o dialog de confirmação, chamar o serviço e exibir o snackbar de erro. O `ProductListComponent` não precisa conhecer `MatDialog` nem `MatSnackBar`.

**`ProductFormComponent` compartilhado**
O mesmo componente de formulário é usado para criação e edição. O modo é determinado pelo `@Input() initialData?: Product`. Isso evita duplicação de lógica de validação e submissão.

**Mixins de tipografia via SCSS**
Em vez de classes utilitárias globais (estilo Tailwind), a tipografia é definida em `src/styles/_typography.scss` como mixins Sass e incluída diretamente nas classes de cada componente (`@include typography.body-md`). Isso mantém o CSS encapsulado e evita dependência de classes no template HTML.

---

## Pré-requisitos

- Node.js 20+
- Yarn 3+ (`corepack enable`)

---

## Comandos

```bash
# Instalar dependências
yarn install

# Servidor de desenvolvimento
yarn start
# → http://localhost:4200

# Executar testes unitários
yarn test

# Build de produção
yarn build
```

---

## API

A aplicação consome a [Fake Store API](https://fakestoreapi.com):

| Operação        | Método   | Endpoint        |
| --------------- | -------- | --------------- |
| Listar produtos | `GET`    | `/products`     |
| Buscar produto  | `GET`    | `/products/:id` |
| Criar produto   | `POST`   | `/products`     |
| Editar produto  | `PUT`    | `/products/:id` |
| Excluir produto | `DELETE` | `/products/:id` |

> A Fake Store API é uma API de mock — as mutações (POST, PUT, DELETE) retornam respostas simuladas e não persistem dados reais.

---

## Testes

73 testes unitários cobrindo serviços e componentes:

```bash
yarn test
# Test Files  9 passed (9)
# Tests       73 passed (73)
```

Cada camada tem cobertura própria:

- **Serviços** — lógica HTTP com `HttpClientTestingModule`, estados de loading/error e comportamentos concorrentes
- **Componentes** — interação com template, estados de UI e integração com serviços mockados
- **Dialogs** — renderização e ações de confirmação/cancelamento

---

## Qualidade de código

- **Prettier** aplicado automaticamente via `lint-staged` no pre-commit
- **Commitlint** valida mensagens no padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `style:`, `docs:`, `chore:`)
- **Husky** orquestra os hooks de git
