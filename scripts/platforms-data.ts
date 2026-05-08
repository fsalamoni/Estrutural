/**
 * Dados-fonte (declarativos) das plataformas do hub Protagonista RPG.
 *
 * Este arquivo é a fonte de verdade git-trackeada. Use com `seed-platforms.mjs`
 * para popular o Firestore. Edições subsequentes podem ser feitas pelo painel admin.
 *
 * Plataformas com `visible: false` ficam no banco mas não aparecem na landing
 * pública — útil para apps cujo deploy ainda não está ativo.
 */

export type PlatformSeed = {
  slug: string;
  name: string;
  description: string;
  accessUrl: string;
  iconUrl: string;
  authMethod: 'email' | 'google' | 'ambos' | 'nenhum';
  visible: boolean;
  order: number;
};

const FAVICON = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const PLATFORMS: PlatformSeed[] = [
  {
    slug: 'protagonista-rpg',
    name: 'Protagonista RPG',
    description:
      'Plataforma RPG completa: ficha de personagem, dice box 3D, mesa virtual via WebRTC e narrativa assistida por IA.',
    accessUrl: 'https://app.protagonistarpg.com.br',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'ambos',
    visible: false,
    order: 10,
  },
  {
    slug: 'omniforge',
    name: 'OmniForge RPG',
    description:
      'Gerador de campanhas de RPG com IA — sessões, NPCs, encontros e narrativa coesa por agentes especializados.',
    accessUrl: 'https://www.protagonistarpg.com.br/omniforge/',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'google',
    visible: true,
    order: 20,
  },
  {
    slug: 'omnimesa',
    name: 'OmniMesa',
    description:
      'VTT (Virtual Tabletop) completo com mapas, tokens, sistemas D&D 5e e chat com IA Gemini.',
    accessUrl: '',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'google',
    visible: false,
    order: 30,
  },
  {
    slug: 'omnidice',
    name: 'OmniDice',
    description:
      'Dice roller 3D profissional baseado em física — Rapier3D + Three.js, com suporte a streaming OBS.',
    accessUrl: '',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'nenhum',
    visible: false,
    order: 40,
  },
  {
    slug: 'salomone-ia',
    name: 'Salomone IA',
    description:
      'Plataforma de agentes autônomos — loop ReAct, 10 ferramentas, multi-LLM (OpenRouter, Gemini, Groq, DeepSeek).',
    accessUrl: 'https://salomone.web.app',
    iconUrl: FAVICON('salomone.web.app'),
    authMethod: 'google',
    visible: true,
    order: 50,
  },
  {
    slug: 'lexio',
    name: 'Lexio',
    description:
      'SaaS de produção jurídica com IA — pipelines multi-agente, jurisprudência DataJud/CNJ, teses, pareceres e caderno de pesquisa.',
    accessUrl: 'https://lexio.web.app',
    iconUrl: FAVICON('lexio.web.app'),
    authMethod: 'google',
    visible: true,
    order: 60,
  },
  {
    slug: 'caocipp',
    name: 'CAOCIPP',
    description:
      'Sistema de gestão do Centro de Apoio Operacional do MP-RS — consultas jurídicas e expedientes administrativos.',
    accessUrl: 'https://consultascao.web.app',
    iconUrl: FAVICON('consultascao.web.app'),
    authMethod: 'email',
    visible: true,
    order: 70,
  },
  {
    slug: 'gravador',
    name: 'Anotes (Gravador)',
    description:
      'Gravador de áudio com IA — transcrição, resumos, mapas mentais, web + mobile sincronizados.',
    accessUrl: 'https://anotes.web.app',
    iconUrl: FAVICON('anotes.web.app'),
    authMethod: 'google',
    visible: true,
    order: 80,
  },
  {
    slug: 'superbolao',
    name: 'Superbolão',
    description:
      'Bolões privados da Copa do Mundo FIFA 2026 — palpites por jogo, ranking ao vivo, apuração automática.',
    accessUrl: 'https://superbolao.web.app',
    iconUrl: FAVICON('superbolao.web.app'),
    authMethod: 'google',
    visible: true,
    order: 90,
  },
  {
    slug: 'psico',
    name: 'Psico SaaS',
    description:
      'Acompanhamento psicológico — diário de humor, integração WhatsApp, painel da psicóloga, relatório clínico com IA.',
    accessUrl: '',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'email',
    visible: false,
    order: 100,
  },
  {
    slug: 'laura',
    name: 'Laura',
    description:
      'Jogo educacional sandbox 2D estilo Toca Boca — renderização de avatar SVG e mundo interativo.',
    accessUrl: '',
    iconUrl: FAVICON('protagonistarpg.com.br'),
    authMethod: 'nenhum',
    visible: false,
    order: 110,
  },
];
