import test from 'node:test';
import assert from 'node:assert/strict';
import { localizeArticle } from './i18n.js';

test('localizeArticle updates the article title and body for a non-English language', () => {
  const article = {
    id: 1,
    title: 'AI infrastructure spending is reshaping the next decade of global growth',
    summary: 'Chipmakers, cloud providers, and power grids are racing to support the infrastructure needed for an AI-powered economy.',
    content: [
      'A new wave of capital is moving from software experimentation into physical infrastructure.',
      'The scale of AI demand has pushed cloud providers and utilities to rethink capacity planning.',
    ],
    category: 'Tech',
    author: 'Ava Brooks',
    publishedAt: '2025-01-15T00:00:00.000Z',
    readTime: '6 min read',
  };

  const localized = localizeArticle(article, 'ta');

  assert.notEqual(localized.title, article.title);
  assert.match(localized.title, /உள்கட்டமைப்பு|AI|வளர்ச்சி/);
  assert.notEqual(localized.summary, article.summary);
  assert.ok(Array.isArray(localized.content));
  assert.ok(localized.content.length >= 2);
});
