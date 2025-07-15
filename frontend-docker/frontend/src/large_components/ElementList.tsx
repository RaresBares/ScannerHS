import { useState } from 'react'

export default function ElementList() {
    const [filter, setFilter] = useState('all')
    const items = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        category: ['A', 'B', 'C'][i % 3],
        name: `Element ${i + 1}`,
    }))

    const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter)

    return (
        <div style={{ width: '100%', paddingLeft: '1rem', paddingRight: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex flex-wrap gap-2 mb-3" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                {['all', 'A', 'B', 'C'].map(cat => (
                    <button
                        key={cat}
                        className={`btn btn-sm ${
                            filter === cat ? 'btn-success text-white' : 'btn-outline-light'
                        } rounded-pill px-3 py-1 shadow-sm`}
                        onClick={() => setFilter(cat)}
                        style={{ minWidth: 80, userSelect: 'none' }}
                    >
                        {cat === 'all' ? 'Alle' : `Kategorie ${cat}`}
                    </button>
                ))}
            </div>

            <ul
                className="list-group flex-grow-1"
                style={{
                    overflowY: 'auto',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                    marginBottom: 0,
                }}
            >
                {filteredItems.map(item => (
                    <li
                        key={item.id}
                        className="list-group-item bg-transparent text-white border-secondary rounded mb-2 shadow-sm"
                        style={{ cursor: 'pointer', transition: 'background-color 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
