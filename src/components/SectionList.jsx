import Section from './Section'

export default function SectionList({ sections, items, shop, suggestions, onAdd, onToggle, onDelete }) {
  const ordered = shop
    ? [...sections].sort((a, b) => {
        const ai = shop.sectionOrder.indexOf(a.id)
        const bi = shop.sectionOrder.indexOf(b.id)
        const aPos = ai === -1 ? sections.length + a.defaultOrder : ai
        const bPos = bi === -1 ? sections.length + b.defaultOrder : bi
        return aPos - bPos
      })
    : [...sections].sort((a, b) => a.defaultOrder - b.defaultOrder)

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingTop: '8px' }}>
      {ordered.map(section => (
        <Section
          key={section.id}
          section={section}
          items={items.filter(i => i.sectionId === section.id)}
          suggestions={suggestions}
          onAdd={onAdd}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
