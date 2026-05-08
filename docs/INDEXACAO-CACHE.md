# Indexacao e Cache

## O que deve ser indexado

- A home publica do portal.
- Os metadados institucionais da marca.
- O sitemap do proprio portal.

## O que nao deve ser indexado

- `/admin`
- `/admin/login`
- Superficies internas ou futuras rotas administrativas

## Estrategia de sitemap

O sitemap lista apenas o portal. As plataformas cadastradas no catalogo sao destinos externos, nao paginas internas da aplicacao, entao nao devem ser publicadas como URLs do proprio dominio no sitemap.

## Estrategia de robots

- Permitir rastreamento da home publica.
- Bloquear areas administrativas.
- Publicar referencia explicita para `sitemap.xml`.

## Estrategia de cache

### HTML

Arquivos HTML devem sair com `Cache-Control: no-store, max-age=0` para evitar servir shell antigo do portal apos deploy.

### Assets estaticos

JS, CSS, fontes e imagens versionadas do build devem sair com `Cache-Control: public, max-age=31536000, immutable`.

### Dados do catalogo

Os dados do catalogo sao buscados do Firestore no cliente. O cache efetivo desses dados e controlado pelo SDK e pelo estado do navegador, nao por pre-render dinamico do Next.

## Implicacoes

- Mudancas de layout e shell precisam refletir imediatamente apos deploy.
- Mudancas de catalogo aparecem via Firestore sem depender de rebuild.
- O portal nao deve prometer indexacao das plataformas externas como se fossem paginas internas.