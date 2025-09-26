export const meta = { id: 'bookmarks', name: 'Bookmarks', order: 10, width: 2 };

export default async function run(ctx) {
  const cfg = ctx.config.plugins?.bookmarks ?? {};
  const list = await ctx.readJson(ctx.paths.config('bookmarks.json')) ?? [];
  return [{
    id: 'bookmarks',
    title: cfg.title || 'Bookmarks',
    kind: 'bookmark-list',
    content: list, // [{title,url,icon?}]
    updatedAt: new Date().toISOString(),
    width: cfg.width || 2
  }];
}

