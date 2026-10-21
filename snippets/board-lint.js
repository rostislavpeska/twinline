// twinline board lint: read-only Figma Plugin API code.
// Finds every layer that sticks out of its parent on every page, so overlapping grids, clipped specimen text and
// cut-off previews show up without looking. Layers inside instances and variants inside a component set are skipped:
// their sizes belong to the component, not to the board.
// Run it in a plugin runner or through an agent's Figma connection. The result is JSON: pages, layers scanned, hits,
// and per page the worst examples with node id, side and size in pixels.
const out = { pages: 0, scanned: 0, issues: 0, byPage: {}, errors: [] };
const insideInstance = (n) => {
  for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) if (p.type === 'INSTANCE') return true;
  return false;
};
for (const page of figma.root.children) {
  try { await page.loadAsync(); } catch (e) { out.errors.push(`${page.name}: ${e.message}`); continue; }
  out.pages++;
  const nodes = page.findAll((n) => n.visible !== false && n.parent && n.parent.type !== 'PAGE'
    && n.parent.type !== 'COMPONENT_SET' && !insideInstance(n) && n.absoluteBoundingBox && n.parent.absoluteBoundingBox);
  const list = [];
  for (const n of nodes) {
    out.scanned++;
    const a = n.absoluteBoundingBox;
    const b = n.parent.absoluteBoundingBox;
    const right = a.x + a.width - (b.x + b.width);
    const left = b.x - a.x;
    const bottom = a.y + a.height - (b.y + b.height);
    const top = b.y - a.y;
    const over = Math.max(right, left, bottom, top);
    if (over > 1) {
      list.push({ id: n.id, node: n.name.slice(0, 40), type: n.type, parent: n.parent.name.slice(0, 40), px: Math.round(over),
        side: over === right ? 'right' : over === left ? 'left' : over === bottom ? 'bottom' : 'top', clipped: !!n.parent.clipsContent });
    }
  }
  if (list.length) {
    out.issues += list.length;
    out.byPage[page.name] = {
      count: list.length,
      clipped: list.filter((i) => i.clipped).length,
      worstPx: Math.max(...list.map((i) => i.px)),
      parents: [...new Set(list.map((i) => i.parent))].slice(0, 6),
      examples: list.sort((x, y) => y.px - x.px).slice(0, 3),
    };
  }
}
return out;
