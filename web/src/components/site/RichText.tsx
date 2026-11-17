/**
 * Renders the simple page format edited in the admin:
 *   "## Title"  → heading
 *   "- item"    → bullet (consecutive bullets form one list)
 *   other lines → paragraph (a blank line starts a new one)
 * Text is rendered as React text (never as HTML), so admin content can't inject markup.
 */

type Block = { type: 'h2'; text: string } | { type: 'ul'; items: string[] } | { type: 'p'; text: string };

export function parseRichText(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join('\n') });
    paragraph = [];
  };

  for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith('## ')) {
      flush();
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (line.startsWith('- ')) {
      flush();
      const last = blocks.at(-1);
      if (last?.type === 'ul') last.items.push(line.slice(2));
      else blocks.push({ type: 'ul', items: [line.slice(2)] });
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

export function RichText({ text }: { text: string }) {
  return (
    <div className="rich-text">
      {parseRichText(text).map((block, index) =>
        block.type === 'h2' ? (
          <h2 key={index}>{block.text}</h2>
        ) : block.type === 'ul' ? (
          <ul key={index}>
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={index}>{block.text}</p>
        )
      )}
    </div>
  );
}
