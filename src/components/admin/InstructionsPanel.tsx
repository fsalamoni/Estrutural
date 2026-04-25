'use client';

import { useState } from 'react';

interface Step {
  title: string;
  steps: string[];
}

const INSTRUCTIONS: Record<string, Step> = {
  add: {
    title: 'Como adicionar uma plataforma',
    steps: [
      'Clique no botão "Nova Plataforma" no topo do painel.',
      'Preencha o nome da plataforma (ex: Notion, Discord, GitHub).',
      'Adicione uma descrição breve para os usuários saberem o que é.',
      'Insira a URL de acesso completa (ex: https://meusite.protagonistarpg.com.br).',
      'Selecione o método de acesso: E-mail, Google, Ambos ou Acesso direto.',
      'Para o ícone: envie um arquivo (PNG/SVG) ou cole uma URL de imagem.',
      'Defina a ordem de exibição (0 = primeiro, 1 = segundo, etc.).',
      'Marque como "Visível" para aparecer publicamente. Pode deixar oculto e publicar depois.',
      'Clique em "Criar Plataforma". Ela aparece na landing page imediatamente.',
    ],
  },
  edit: {
    title: 'Como editar uma plataforma',
    steps: [
      'Na tabela de plataformas, clique no botão "Editar" na linha desejada.',
      'O formulário abre com os dados atuais preenchidos.',
      'Altere os campos que desejar: nome, descrição, URL, ícone, método de acesso ou ordem.',
      'Para trocar o ícone: clique em "Enviar arquivo" ou cole uma nova URL.',
      'Clique em "Salvar Alterações". As mudanças refletem na landing page em segundos.',
    ],
  },
  hide: {
    title: 'Como ocultar / reexibir uma plataforma',
    steps: [
      'Na coluna "Visível" da tabela, clique no toggle (botão deslizante) da plataforma.',
      'Quando roxo: a plataforma está visível para todos na landing page.',
      'Quando cinza: a plataforma está oculta (só você vê no painel admin).',
      'A mudança é imediata, sem necessidade de recarregar a página.',
      'Use isso para ocultar temporariamente uma plataforma em manutenção.',
    ],
  },
  delete: {
    title: 'Como excluir uma plataforma',
    steps: [
      'Na tabela, clique no botão vermelho "Excluir" na linha da plataforma.',
      'Uma confirmação aparece para evitar exclusões acidentais.',
      'Clique em "Excluir" para confirmar. A ação é permanente e irreversível.',
      'Se quiser apenas remover temporariamente, prefira ocultar (toggle) em vez de excluir.',
    ],
  },
  order: {
    title: 'Como reordenar plataformas',
    steps: [
      'Abra o formulário de edição de uma plataforma (botão "Editar").',
      'Altere o campo "Ordem de exibição": 0 = aparece primeiro, 1 = segundo, etc.',
      'Use números inteiros. Plataformas com mesma ordem são ordenadas por data de criação.',
      'Salve as alterações. A landing page reflete a nova ordem imediatamente.',
    ],
  },
  domain: {
    title: 'Como adicionar sub-plataformas no domínio protagonistarpg.com.br',
    steps: [
      'Acesse o Cloudflare Dashboard → protagonistarpg.com.br → DNS.',
      'Clique em "Add record" para adicionar um subdomínio.',
      'Para apontar para Cloudflare Pages: Type=CNAME, Name=suaplataforma, Target=seu-projeto.pages.dev.',
      'Para apontar para um Cloudflare Worker: Type=CNAME, Name=suaplataforma, Target=worker.workers.dev.',
      'Ative o proxy Cloudflare (nuvem laranja) para HTTPS automático.',
      'No campo "URL de Acesso" da plataforma aqui no painel, use: https://suaplataforma.protagonistarpg.com.br.',
    ],
  },
};

export default function InstructionsPanel() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<keyof typeof INSTRUCTIONS>('add');

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full
                   bg-accent-purple px-5 py-3 text-sm font-semibold text-white shadow-lg
                   shadow-accent-purple/30 hover:bg-violet-600 transition-all
                   hover:shadow-accent-purple/50 hover:scale-105"
      >
        <span>❓</span>
        <span className="hidden sm:inline">Ajuda</span>
      </button>

      {/* Painel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l
                          border-dark-border bg-dark-card shadow-2xl sm:h-screen">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-border p-5">
              <h2 className="text-lg font-semibold text-white">📖 Guia de Uso</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Navegação de tópicos */}
            <div className="flex flex-wrap gap-2 border-b border-dark-border p-4">
              {(Object.keys(INSTRUCTIONS) as Array<keyof typeof INSTRUCTIONS>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all
                    ${active === key
                      ? 'bg-accent-purple text-white'
                      : 'border border-dark-border text-gray-400 hover:border-accent-purple hover:text-white'
                    }`}
                >
                  {{
                    add: '➕ Adicionar',
                    edit: '✏️ Editar',
                    hide: '👁 Ocultar',
                    delete: '🗑 Excluir',
                    order: '↕️ Ordenar',
                    domain: '🌐 Domínio',
                  }[key]}
                </button>
              ))}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="mb-4 text-base font-semibold text-white">
                {INSTRUCTIONS[active].title}
              </h3>
              <ol className="space-y-3">
                {INSTRUCTIONS[active].steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center
                                     rounded-full bg-accent-purple/20 text-xs font-semibold
                                     text-accent-glow">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
