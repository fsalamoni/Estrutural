# Verificacao

## Gate minimo antes de staging ou producao

```bash
npm run type-check
npm run lint
npm test
npm run build
```

## Checklist funcional

1. A landing publica carrega sem erro.
2. O login admin rejeita redirects externos.
3. Usuario nao autenticado e redirecionado para `/admin/login`.
4. Usuario autenticado e autorizado entra no painel.
5. Usuario autenticado sem permissao nao consegue operar o admin.
6. Criacao, edicao, exclusao, visibilidade e ordem funcionam.
7. Upload de icone rejeita arquivo invalido ou acima de 5 MB.
8. Links e categorias invalidas sao rejeitados antes da escrita.

## Checklist de seguranca

1. Firestore Rules barram escrita sem admin.
2. Firestore Rules barram payload fora do schema.
3. Storage Rules barram upload fora de `platform-icons/` e tipo/tamanho invalidos.
4. `storage.cors.json` esta aplicado ao bucket correto.
5. `NEXT_PUBLIC_ADMIN_EMAIL` esta alinhado entre app, ambiente e regras.

## Checklist de entrega

1. Workflow do GitHub Actions em `main` verde.
2. Deploy inclui hosting, rules, indexes e storage.
3. `robots.txt` e `sitemap.xml` respondem corretamente.
4. Headers de cache e seguranca estao presentes na resposta do Hosting.
5. A homepage publica responde `200`, nao exibe o estado de erro do catalogo e contem cards-chave como `Lexio` e `OmniDice`.

Para staging, o item 2 volta a incluir Hosting + Firestore + Storage agora que o bucket padrao existe. A validacao de login admin em staging pode usar Email/Password e Google, que ja estao habilitados no projeto.

## Evidencias de encerramento

Ao fechar a etapa, registrar:

- commit final publicado
- run do Actions bem-sucedido
- horario do deploy
- validacao manual da landing e do admin
- confirmacao de regras e CORS aplicados