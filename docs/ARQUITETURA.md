# Arquitetura

## Papel do sistema

Estrutural e Plataformas Salomone sao um portal-hub. O sistema nao hospeda nem executa as plataformas de destino; ele apenas lista, organiza e direciona o acesso para URLs externas.

## Camadas principais

1. App web em Next.js 16 com export estatico.
2. Firebase Hosting para entrega do frontend.
3. Firebase Auth para autenticacao do admin.
4. Firestore para metadados do catalogo.
5. Firebase Storage para icones das plataformas.

## Fluxo funcional

1. A landing publica assina a colecao `platforms` filtrando apenas registros visiveis.
2. O painel admin autentica o usuario, valida se o e-mail autorizado corresponde ao admin configurado e entao libera CRUD do catalogo.
3. Criacao e edicao de plataforma passam por validacao compartilhada no frontend e na camada de escrita do Firestore.
4. Firestore Rules e Storage Rules sao a ultima borda de protecao para payload, autenticacao e upload.

## Modelo de dados

Cada documento de `platforms` contem:

- `name`
- `description`
- `category`
- `accessUrl`
- `iconUrl`
- `authMethod`
- `visible`
- `order`
- `createdAt`
- `updatedAt`

Categorias canonicas:

- `Trabalho`
- `IA`
- `RPG`
- `Jogos`
- `Outros`

Metodos de acesso canonicos:

- `email`
- `google`
- `ambos`
- `nenhum`

## Limites e invariantes atuais

- `accessUrl` e `iconUrl` persistidos devem usar `https`.
- `name` deve ter entre 1 e 120 caracteres.
- `description` pode estar vazia e vai ate 1000 caracteres.
- `order` deve ser inteiro maior ou igual a zero.
- Apenas o admin pode criar, editar ou excluir plataformas e icones.

## Fronteiras de confianca

1. O cliente nunca e confiavel por si so.
2. A validacao compartilhada em TypeScript melhora UX e reduz erros, mas nao substitui as Rules.
3. Firestore Rules e Storage Rules sao a fronteira autoritativa.
4. O bucket de icones e publicamente legivel por necessidade de exibicao, mas a escrita e restrita ao admin.

## Decisoes operacionais

- Publicacao ativa apenas via Firebase Hosting.
- O sitemap indexa o portal, nao as plataformas externas.
- O catalogo e mantido no Firestore e carregado no cliente em tempo real.