/**
 * Catálogo inicial das plataformas e categorias do ecossistema Protagonista RPG.
 *
 * Importado pelo botão "Importar Catálogo" no painel admin para popular o
 * Firestore de uma vez. Idempotente — compara por `name` e só cria as que faltam.
 *
 * Plataformas com `visible: false` ficam no banco mas ocultas na landing
 * pública (apps cujo deploy ainda não está ativo).
 *
 * `categorySlug` é resolvido para `categoryId` no momento da importação.
 */

import type { CategoryInput, PlatformInput } from './types';

const FAVICON = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const CATEGORY_CATALOG: (CategoryInput & { slug: string })[] = [
  {
    slug: 'rpg',
    name: 'RPG & Mesa Virtual',
    description: 'Plataformas para jogos de interpretação e mesas online.',
    color: 'tertiary',
    icon: 'casino',
    order: 10,
  },
  {
    slug: 'ia',
    name: 'IA & Agentes',
    description: 'Sistemas autônomos e ferramentas alimentadas por inteligência artificial.',
    color: 'secondary',
    icon: 'auto_awesome',
    order: 20,
  },
  {
    slug: 'juridico',
    name: 'Jurídico',
    description: 'Plataformas voltadas para o setor jurídico e Ministério Público.',
    color: 'info',
    icon: 'gavel',
    order: 30,
  },
  {
    slug: 'produtividade',
    name: 'Produtividade',
    description: 'Ferramentas de organização, anotações e gestão pessoal.',
    color: 'success',
    icon: 'workspaces',
    order: 40,
  },
  {
    slug: 'entretenimento',
    name: 'Entretenimento',
    description: 'Bolões, jogos e experiências interativas.',
    color: 'warning',
    icon: 'sports_esports',
    order: 50,
  },
  {
    slug: 'educacao',
    name: 'Educação & Saúde',
    description: 'Aprendizado, acompanhamento e bem-estar.',
    color: 'success',
    icon: 'school',
    order: 60,
  },
];

export const PLATFORM_CATALOG: (Omit<PlatformInput, 'categoryId'> & {
  categorySlug?: string;
})[] = [
  {
    name: 'OmniForge RPG',
    description:
      'Gerador de campanhas de RPG com IA — sessões, NPCs, encontros e narrativa coesa por agentes especializados.',
    accessUrl: 'https://www.protagonistarpg.com.br/omniforge/',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'google',
    visible: true,
    order: 10,
    categorySlug: 'rpg',
  },
  {
    name: 'Salomone IA',
    description:
      'Plataforma de agentes autônomos — loop ReAct, multi-LLM (OpenRouter, Gemini, Groq, DeepSeek), 10 ferramentas integradas.',
    accessUrl: 'https://salomone.web.app',
    iconUrl: FAVICON('salomone.web.app'),
    authMethod: 'google',
    visible: true,
    order: 20,
    categorySlug: 'ia',
  },
  {
    name: 'Lexio',
    description:
      'SaaS de produção jurídica com IA — pipelines multi-agente, jurisprudência DataJud/CNJ, teses, pareceres e caderno de pesquisa.',
    accessUrl: 'https://lexio.web.app',
    iconUrl: FAVICON('lexio.web.app'),
    authMethod: 'google',
    visible: true,
    order: 30,
    categorySlug: 'juridico',
  },
  {
    name: 'CAOCIPP',
    description:
      'Sistema de gestão do Centro de Apoio Operacional do MP-RS — consultas jurídicas e expedientes administrativos.',
    accessUrl: 'https://consultascao.web.app',
    iconUrl: FAVICON('consultascao.web.app'),
    authMethod: 'email',
    visible: true,
    order: 40,
    categorySlug: 'juridico',
  },
  {
    name: 'Anotes',
    description:
      'Gravador de áudio com IA — transcrição, resumos, mapas mentais. Web e mobile sincronizados.',
    accessUrl: 'https://anotes.web.app',
    iconUrl: FAVICON('anotes.web.app'),
    authMethod: 'google',
    visible: true,
    order: 50,
    categorySlug: 'produtividade',
  },
  {
    name: 'Superbolão',
    description:
      'Bolões privados da Copa do Mundo FIFA 2026 — palpites por jogo, ranking ao vivo, apuração automática.',
    accessUrl: 'https://superbolao.web.app',
    iconUrl: FAVICON('superbolao.web.app'),
    authMethod: 'google',
    visible: true,
    order: 60,
    categorySlug: 'entretenimento',
  },
  {
    name: 'Protagonista RPG',
    description:
      'Plataforma RPG completa: ficha de personagem, dice box 3D, mesa virtual via WebRTC e narrativa assistida por IA.',
    accessUrl: 'https://app.protagonistarpg.com.br',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'ambos',
    visible: false,
    order: 70,
    categorySlug: 'rpg',
  },
  {
    name: 'OmniMesa',
    description:
      'VTT (Virtual Tabletop) completo com mapas, tokens, sistemas D&D 5e e chat com IA Gemini.',
    accessUrl: '',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'google',
    visible: false,
    order: 80,
    categorySlug: 'rpg',
  },
  {
    name: 'OmniDice',
    description:
      'Dice roller 3D profissional baseado em física — Rapier3D + Three.js, com suporte a streaming OBS.',
    accessUrl: '',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'nenhum',
    visible: false,
    order: 90,
    categorySlug: 'rpg',
  },
  {
    name: 'Psico SaaS',
    description:
      'Acompanhamento psicológico — diário de humor, integração WhatsApp, painel da psicóloga, relatório clínico com IA.',
    accessUrl: 'https://fsalamoni.github.io/Psico-/',
    iconUrl: FAVICON('fsalamoni.github.io'),
    authMethod: 'email',
    visible: true,
    order: 100,
    categorySlug: 'educacao',
  },
  {
    name: 'Laura',
    description:
      'Jogo educacional sandbox 2D estilo Toca Boca — renderização de avatar SVG e mundo interativo.',
    accessUrl: 'https://fsalamoni.github.io/Laura/',
    iconUrl: FAVICON('fsalamoni.github.io'),
    authMethod: 'nenhum',
    visible: true,
    order: 110,
    categorySlug: 'educacao',
  },
];
