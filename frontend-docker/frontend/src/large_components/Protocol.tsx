import { useEffect, useState } from 'react'

type ProtocolEntry = {
    id: number
    timestamp: string
    description: string
    details: string
}

function fetch_protocols(): Promise<ProtocolEntry[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    timestamp: '2025-07-21 14:32',
                    description: 'Produkt gelöscht: Apfel',
                    details: 'Benutzer hat das Produkt „Apfel“ im Kühlschrank entfernt.',
                },
                {
                    id: 2,
                    timestamp: '2025-07-20 18:11',
                    description: 'Neuer Benutzer registriert',
                    details: 'Ein neuer Benutzer wurde mit Adminrechten angelegt.',
                },
                {
                    id: 3,
                    timestamp: '2025-07-19 09:58',
                    description: 'Scanvorgang abgeschlossen',
                    details: 'Der Kühlschrank wurde erfolgreich gescannt und aktualisiert.',
                },
                {
                    id: 4,
                    timestamp: '2025-07-19 09:58',
                    description: 'Scanvorgang abgeschlossen',
                    details: 'Der Kühlschrank wurde erfolgreich gescannt und aktualisiert.',
                },
                {
                    id: 5,
                    timestamp: '2025-07-19 09:58',
                    description: 'Scanvorgang abgeschlossen',
                    details: 'Der Kühlschrank wurde erfolgreich gescannt und aktualisiert.',
                },
                {
                    id: 6,
                    timestamp: '2025-07-19 09:58',
                    description: 'Scanvorgang abgeschlossen',
                    details: 'Der Kühlschrank wurde erfolgreich gescannt und aktualisiert.',
                }
            ])
        }, 1000)
    })
}

export default function Protocol() {
    const [entries, setEntries] = useState<ProtocolEntry[]>([])
    const [openEntry, setOpenEntry] = useState<ProtocolEntry | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch_protocols().then(data => {
            setEntries(data)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (openEntry) {
            document.body.classList.add('modal-open')
        } else {
            document.body.classList.remove('modal-open')
        }
    }, [openEntry])

    return (
        <>
            <div className="protocol-container">
                <div className="protocol-scroll">
                    {loading ? (
                        <div className="d-flex justify-content-center py-4">
                            <div className="spinner" />
                        </div>
                    ) : entries.length === 0 ? (
                        <p className="text-white text-center small opacity-50">Keine Protokolleinträge</p>
                    ) : (
                        entries.map(entry => (
                            <div
                                key={entry.id}
                                className="protocol-entry"
                                onClick={() => setOpenEntry(entry)}
                            >
                                <div className="protocol-timestamp">{entry.timestamp}</div>
                                <div className="protocol-description">{entry.description}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {openEntry && (
                <div className="protocol-overlay" onClick={() => setOpenEntry(null)}>
                    <div
                        className="bg-dark text-white rounded-4 shadow-lg p-4"
                        style={{ maxWidth: '90%', width: '400px', backdropFilter: 'blur(8px)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h5 className="mb-2 fw-bold">{openEntry.description}</h5>
                        <p className="text-secondary small mb-2">{openEntry.timestamp}</p>
                        <p className="mb-0">{openEntry.details}</p>
                        <div className="text-end mt-3">
                            <button className="btn btn-sm btn-light rounded-pill px-3" onClick={() => setOpenEntry(null)}>
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .protocol-container {
                    padding: 1rem;
                    background-color: rgba(255, 255, 255, 0.03);
                    border-radius: 1rem;
                    backdrop-filter: blur(6px);
                    border: 1px solid rgba(255, 255, 255, 0.0);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .protocol-scroll {
                    overflow-y: overlay;
                    scrollbar-gutter: stable;

                    max-height: 50vh;
                    padding-right: 0.5rem;
                    padding-bottom: 0.5rem;
                }

                .protocol-entry {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    border-radius: 1rem;
                    background-color: rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(4px);
                    cursor: pointer;
                    transition: all 0.25s ease;
                    color: white;
                    font-size: 0.92rem;
                    font-family: 'Inter', sans-serif;
                    margin-bottom: 0.5rem;
                    padding-right: 1rem;
                }

                .protocol-entry:hover {
                    transform: translateY(-2px);
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .protocol-timestamp {
                    color: #9fa7b3;
                    font-weight: 500;
                    font-size: 0.85rem;
                    flex: 0 0 40%;
                }

                .protocol-description {
                    flex: 1;
                    font-size: 0.95rem;
                    font-weight: 600;
                    text-align: right;
                }

                .spinner {
                    width: 32px;
                    height: 32px;
                    border: 4px solid rgba(255,255,255,0.15);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .protocol-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: auto;
                }

                body.modal-open .military-card:hover {
                    transform: none !important;
                    background-color: inherit !important;
                    transition: none !important;
                }
            `}</style>
        </>
    )
}
