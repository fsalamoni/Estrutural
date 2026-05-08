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
      'Clique em "Nova Plataforma" no topo do painel.',
      'Preencha o nome da plataforma (ex: Notion, Discord, GitHub).',
      'Adicione uma descrição breve para os usuários.',
      'Defina a categoria do catalogo: Trabalho, IA, RPG, Jogos ou Outros.',
      'Insira a URL de acesso completa (https://...).',
      'Selecione o método de acesso: E-mail, Google, Ambos ou Acesso direto.',
      'Para o ícone: envie um arquivo (PNG/SVG) ou cole uma URL de imagem.',
      'Defina a ordem de exibição (0 = primeiro).',
      'Selecione "Ativo" para aparecer publicamente.',
      'Clique em "Criar Plataforma". Aparece no portal imediatamente.',
    ],
  },
  edit: {
    title: 'Como editar uma plataforma',
    steps: [
      'Na lista de plataformas, clique no ícone de lápis (editar).',
      'O formulário abre com os dados atuais preenchidos.',
      'Altere os campos desejados: nome, descrição, categoria, URL, ícone, método ou ordem.',
      'Para trocar o ícone: clique em "Enviar arquivo" ou cole uma nova URL.',
      'Clique em "Salvar Alterações". As mudanças refletem no portal em segundos.',
    ],
  },
  hide: {
    title: 'Como ocultar / reexibir uma plataforma',
    steps: [
      'Na lista de plataformas, clique no ícone de olho (visibility).',
      'Quando visível: ícone preenchido — plataforma aparece no portal.',
      'Quando oculto: ícone riscado — plataforma só aparece no painel admin.',
      'A mudança é imediata, sem recarregar a página.',
      'Use para ocultar temporariamente plataformas em manutenção.',
    ],
  },
  order: {
    title: 'Como reordenar plataformas',
    steps: [
      'Nos cards de plataforma, use os botões ▲ e ▼ para mover.',
      'Ou edite a plataforma e altere o campo "Ordem" manualmente.',
      '0 = aparece primeiro, 1 = segundo, etc.',
      'Plataformas com mesma ordem são ordenadas por data de criação.',
      'O portal reflete a nova ordem imediatamente.',
    ],
  },
  delete: {
    title: 'Como excluir uma plataforma',
    steps: [
      'Na lista, clique no ícone de lixeira (excluir).',
      'Uma confirmação aparece para evitar exclusões acidentais.',
      'Confirme para excluir. A ação é permanente e irreversível.',
      'O ícone no Storage também é removido automaticamente.',
      'Para remover temporariamente, prefira ocultar ao invés de excluir.',
    ],
  },
  domain: {
    title: 'Como apontar para plataformas externas',
    steps: [
      'Publique cada worker ou plataforma no endereco final que voce deseja expor.',
      'Se o destino for outro site do Firebase, use a URL web.app correspondente.',
      'Se o destino for um Worker externo, use a URL publica dele no campo "URL de Acesso".',
      'Cadastre essa URL completa no painel em "Nova Plataforma".',
      'Use a visibilidade para ativar ou ocultar cada destino sem remover o cadastro.',
      'Assim o portal central continua em fsalomone.web.app e apenas direciona para os outros endpoints, sem interferir no codigo ou deploy deles.',
    ],
  },
};

const TOPICS = [
  { key: 'add', icon: 'add_circle', label: 'Adicionar' },
  { key: 'edit', icon: 'edit', label: 'Editar' },
  { key: 'hide', icon: 'visibility', label: 'Ocultar' },
  { key: 'order', icon: 'swap_vert', label: 'Ordenar' },
  { key: 'delete', icon: 'delete', label: 'Excluir' },
  { key: 'domain', icon: 'dns', label: 'Domínio' },
] as const;

export default function InstructionsPanel() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<keyof typeof INSTRUCTIONS>('add');

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-secondary-container px-5 py-3 text-sm font-display font-semibold text-on-secondary-container shadow-[0_0_20px_rgba(87,27,193,0.4)] hover:brightness-110 hover:scale-105 transition-all uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-sm">help_outline</span>
        <span className="hidden sm:inline">Ajuda</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-outline-variant bg-surface-container-lowest shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">menu_book</span>
                <h2 className="font-display text-base font-bold text-on-surface uppercase tracking-wider">
                  Guia de Uso
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-on-primary-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2 border-b border-outline-variant p-4">
              {TOPICS.map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-label font-medium transition-all uppercase tracking-wider
                    ${active === key
                      ? 'bg-secondary-container text-on-secondary-container shadow-[0_0_12px_rgba(87,27,193,0.4)]'
                      : 'border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
                    }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="font-display text-sm font-bold text-on-surface mb-5 uppercase tracking-wide">
                {INSTRUCTIONS[active].title}
              </h3>
              <ol className="space-y-4">
                {INSTRUCTIONS[active].steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary-container/20 text-xs font-display font-bold text-secondary">
                      {i + 1}
                    </span>
                    <span className="font-sans text-sm leading-relaxed text-on-surface-variant">{step}</span>
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
