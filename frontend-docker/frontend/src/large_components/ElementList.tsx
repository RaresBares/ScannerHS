import {
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
    type ForwardRefRenderFunction
} from 'react'

export type Item = {
    id: number
    category: string
    name: string
    amount: number
    min: number
    max: number
    expiry: string
    createdAt?: string
    barcode?: string
    description?: string
    shelf?: string
}

export type ElementListHandle = {
    getItemById: (id: number) => Item | undefined
    updateItem: (id: number, newData: Partial<Item>) => void
    applyFilters: (filters: Record<string, any>) => void
}

type ElementListProps = {
    onItemClick?: (id: number) => void
}

function fetchInfo(filters?: Record<string, any>): Promise<Item[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            let data: Item[] = Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                category: ['A', 'B', 'C'][i % 3],
                name: `Element ${i + 1}`,
                amount: Math.floor(Math.random() * 100),
                min: 10,
                max: 80,
                expiry: new Date(Date.now() + Math.random() * 1e10).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString().split('T')[0],
                barcode: `CODE-${i + 1000}`,
                description: `Beschreibung für Element ${i + 1}`,
                shelf: `Shelf-${(i % 5) + 1}`
            }))
            console.log(filters )
            // Dummy-Filter
            if (filters?.name) {
                data = data.filter(item =>
                    item.name.toLowerCase().includes(filters.name.toLowerCase())
                )
            }
            if (filters?.barcode) {
                data = data.filter(item =>
                    item.barcode?.toLowerCase().includes(filters.barcode.toLowerCase())
                )
            }
            if (filters?.shelf) {
                data = data.filter(item =>
                    item.shelf?.toLowerCase().includes(filters.shelf.toLowerCase())
                )
            }

            resolve(data)
        }, 800)
    })
}

const ElementList: ForwardRefRenderFunction<ElementListHandle, ElementListProps> = (props, ref) => {
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [categoryFilter, setCategoryFilter] = useState('all')

    useEffect(() => {
        fetchInfo().then(data => {
            setItems(data)
            setLoading(false)
        })
    }, [])

    useImperativeHandle(ref, () => ({
        getItemById: id => items.find(item => item.id === id),
        updateItem: (id, newData) => {
            setItems(prev =>
                prev.map(item => (item.id === id ? { ...item, ...newData } : item))
            )
        },
        applyFilters: filters => {
            setLoading(true)
            fetchInfo(filters).then(data => {
                setItems(data)
                setLoading(false)
            })
        }
    }), [items])

    const visibleItems = categoryFilter === 'all'
        ? items
        : items.filter(item => item.category === categoryFilter)

    return (
        <div className="h-100 d-flex flex-column px-3 py-2">
            <div className="d-flex flex-wrap gap-2 mb-3">
                {['all', 'A', 'B', 'C'].map(cat => (
                    <button
                        key={cat}
                        className={`btn btn-sm ${categoryFilter === cat ? 'btn-success text-white' : 'btn-outline-success'} rounded-pill px-3 py-1 shadow`}
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat === 'all' ? 'Alle' : `Kategorie ${cat}`}
                    </button>
                ))}
            </div>

            <div className="flex-grow-1 overflow-auto">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-success" role="status" />
                    </div>
                ) : visibleItems.length === 0 ? (
                    <p className="text-white small opacity-50 text-center mt-4">Keine Elemente gefunden</p>
                ) : (
                    <div className="list-group">
                        {visibleItems.map(item => (
                            <div
                                key={item.id}
                                className="list-group-item list-group-item-action border-success d-flex justify-content-between align-items-center mb-2 shadow-sm rounded"
                                style={{
                                    backgroundColor: '#103d28',
                                    color: 'white',
                                    border: '1px solid #2fbf71',
                                    transition: 'background-color 0.2s ease',
                                    cursor: 'pointer',
                                    padding: '0.75rem 1rem'
                                }}
                                onClick={() => props.onItemClick?.(item.id)}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#165534')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#103d28')}
                            >
                                <div style={{ flex: 2 }}>{item.name}</div>
                                <div style={{ flex: 1, textAlign: 'center' }}>Menge: {item.amount}</div>
                                <div style={{ flex: 1, textAlign: 'center' }}>Min: {item.min}</div>
                                <div style={{ flex: 1, textAlign: 'center' }}>Max: {item.max}</div>
                                <div style={{ flex: 1, textAlign: 'end' }} className="text-muted small">
                                    {item.expiry}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default forwardRef(ElementList)
