import {
    useEffect,
    useState,
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
}

export type ElementListHandle = {
    getItemById: (id: number) => Item | undefined
    updateItem: (id: number, newData: Partial<Item>) => void
}

type ElementListProps = {
    onItemClick?: (id: number) => void
}

function fetchInfo(): Promise<Item[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                Array.from({ length: 50 }, (_, i) => ({
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
                }))
            )
        }, 1000)
    })
}

const ElementList: ForwardRefRenderFunction<ElementListHandle, ElementListProps> = (props, ref) => {
    const [filter, setFilter] = useState<string>('all')
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchInfo().then((data: Item[]) => {
            setItems(data)
            setLoading(false)
        })
    }, [])

    useImperativeHandle(ref, () => ({
        getItemById: (id: number) => items.find(item => item.id === id),
        updateItem: (id: number, newData: Partial<Item>) => {
            setItems(prev =>
                prev.map(item => (item.id === id ? { ...item, ...newData } : item))
            )
        },
    }), [items])

    const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter)

    return (
        <div className="h-100 d-flex flex-column px-3 py-2">
            <div className="d-flex flex-wrap gap-2 mb-3">
                {['all', 'A', 'B', 'C'].map(cat => (
                    <button
                        key={cat}
                        className={`btn btn-sm ${filter === cat ? 'btn-success text-white' : 'btn-outline-success'} rounded-pill px-3 py-1 shadow`}
                        onClick={() => setFilter(cat)}
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
                ) : (
                    <div className="list-group">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="list-group-item list-group-item-action border-success d-flex justify-content-between align-items-center mb-2 shadow-sm rounded"
                                style={{
                                    backgroundColor: '#103d28',
                                    color: 'white',
                                    border: '1px solid #2fbf71',
                                    transition: 'background-color 0.2s ease',
                                    cursor: 'pointer',
                                    padding: '0.75rem 1rem',
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
