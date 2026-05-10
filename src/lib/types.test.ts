import { describe, expect, it } from 'vitest';

import {
  comparePlatformCategories,
  getPlatformCategory,
  sanitizePlatformInput,
  sanitizePlatformPatch,
} from './types';

describe('getPlatformCategory', () => {
  it('normalizes known aliases to canonical categories', () => {
    expect(getPlatformCategory('Jurídicas')).toBe('Trabalho');
    expect(getPlatformCategory('outras')).toBe('Outros');
    expect(getPlatformCategory(' entretenimento ')).toBe('Jogos');
  });

  it('falls back to Outros when category is empty', () => {
    expect(getPlatformCategory('')).toBe('Outros');
    expect(getPlatformCategory(null)).toBe('Outros');
    expect(getPlatformCategory(undefined)).toBe('Outros');
  });
});

describe('comparePlatformCategories', () => {
  it('keeps canonical categories in the configured order', () => {
    const categories = ['Outros', 'RPG', 'IA', 'Jogos', 'Trabalho'];

    categories.sort(comparePlatformCategories);

    expect(categories).toEqual(['Trabalho', 'IA', 'RPG', 'Jogos', 'Outros']);
  });
});

describe('sanitizePlatformInput', () => {
  it('normalizes and validates a complete platform payload', () => {
    expect(
      sanitizePlatformInput({
        name: '  Lexio  ',
        description: '  Plataforma jurídica com IA.  ',
        category: 'Jurídicas',
        accessUrl: 'https://lexio.web.app',
        iconUrl: 'https://example.com/icon.png',
        authMethod: 'ambos',
        visible: true,
        order: 10,
      })
    ).toEqual({
      name: 'Lexio',
      description: 'Plataforma jurídica com IA.',
      category: 'Trabalho',
      accessUrl: 'https://lexio.web.app/',
      iconUrl: 'https://example.com/icon.png',
      authMethod: 'ambos',
      visible: true,
      order: 10,
    });
  });

  it('rejects non-https access URLs', () => {
    expect(() =>
      sanitizePlatformInput({
        name: 'Lexio',
        description: '',
        category: 'Trabalho',
        accessUrl: 'http://lexio.web.app',
        iconUrl: '',
        authMethod: 'email',
        visible: true,
        order: 0,
      })
    ).toThrow('URL de acesso deve usar HTTPS.');
  });

  it('rejects invalid auth methods', () => {
    expect(() =>
      sanitizePlatformInput({
        name: 'Lexio',
        description: '',
        category: 'Trabalho',
        accessUrl: 'https://lexio.web.app',
        iconUrl: '',
        authMethod: 'senha' as never,
        visible: true,
        order: 0,
      })
    ).toThrow('Método de acesso inválido.');
  });
});

describe('sanitizePlatformPatch', () => {
  it('only sanitizes the fields present in a patch payload', () => {
    expect(
      sanitizePlatformPatch({
        category: 'outras',
        iconUrl: 'https://example.com/new-icon.svg',
        order: 12,
      })
    ).toEqual({
      category: 'Outros',
      iconUrl: 'https://example.com/new-icon.svg',
      order: 12,
    });
  });

  it('rejects invalid patch URLs', () => {
    expect(() => sanitizePlatformPatch({ iconUrl: 'data:image/png;base64,abc' })).toThrow(
      'URL do ícone deve usar HTTPS.'
    );
  });
});