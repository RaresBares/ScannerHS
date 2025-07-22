import { useEffect, useState } from 'react'

type ProtocolEntry = {
    id: number
    timestamp: string
    description: string
    details: string
}

// Generiert automatisch Dummy-Protokolleinträge
function generateEntries(count: number): ProtocolEntry[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        timestamp: new Date(
            Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
        ).toLocaleString('de-CH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        description: `Ereignis ${i + 1}`,
        details: `Details zum Ereignis ${i + 1}. Weitere Infos und Hintergrunddaten.`,
    }))
}

export default function Protocol() {
    const [entries, setEntries] = useState<ProtocolEntry[]>([])
    const [loading, setLoading] = useState(true)

    // Beim Mount Dummy-Einträge erzeugen und laden
    useEffect(() => {
        const data = generateEntries(5)
        setEntries(data)
        setLoading(false)
    }, [])

    return (
        <div className="d-flex flex-column h-100">
            {/* Scrollbarer Bereich, füllt die gesamte Card-Höhe aus */}
            <div className="flex-grow-1 overflow-auto px-3 py-2">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-light" role="status" />
                    </div>
                ) : entries.length === 0 ? (
                    <p className="text-white text-center small opacity-50">
                        Keine Protokolleinträge
                    </p>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="d-flex justify-content-between align-items-center mb-2 p-3 rounded shadow-sm"
                            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                            onClick={() => {/* Optional: Klick-Handling */}}
                        >
                            <div className="text-muted small" style={{ flex: '0 0 120px' }}>
                                {entry.timestamp}
                            </div>
                            <div className="flex-grow-1 fw-semibold">
                                {entry.description}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
