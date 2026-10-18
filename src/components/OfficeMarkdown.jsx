const sectionHeadings = new Set([
  'WHAT IT DECIDES',
  'WHAT IT DOES NOT CONTROL',
  'WHY IT MATTERS',
]);

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).map((part, index) => {
    const isBold = (part.startsWith('**') && part.endsWith('**')) ||
      (part.startsWith('__') && part.endsWith('__'));

    return isBold
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part;
  });
}

function getHeading(line) {
  const markdownHeading = line.match(/^#{1,6}\s+(.+?)\s*#*$/);
  const title = (markdownHeading?.[1] ?? line).trim();
  return markdownHeading || sectionHeadings.has(title.toUpperCase()) ? title : null;
}

function getListItem(line) {
  return line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.+)$/)?.[1] ?? null;
}

export default function OfficeMarkdown({ content }) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = getHeading(line);
    if (heading) {
      blocks.push({ type: 'heading', text: heading });
      index += 1;
      continue;
    }

    if (getListItem(line) !== null) {
      const items = [];
      while (index < lines.length && getListItem(lines[index]) !== null) {
        items.push(getListItem(lines[index]));
        index += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim()) {
      if (getHeading(lines[index].trim()) || getListItem(lines[index]) !== null) break;
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }

  return (
    <div className="space-y-4 py-4 font-sans text-sm leading-[1.5]">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h4 key={index} className="pt-1 font-semibold uppercase tracking-wide">
              {block.text}
            </h4>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
