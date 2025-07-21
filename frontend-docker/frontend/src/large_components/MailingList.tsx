import { useEffect, useState } from 'react'

type Notification = {
    id: number
    title: string
    description: string
    date: string
}

function fetch_notifications(): Promise<Notification[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: 'Lagerwarnung: Joghurt',
                    description: 'Der Joghurt im Kühlschrank läuft bald ab.',
                    date: '2025-07-18'
                },
                {
                    id: 2,
                    title: 'Neues Produkt hinzugefügt',
                    description: 'Ein neues Produkt wurde erfolgreich registriert.',
                    date: '2025-07-17'
                },
                {
                    id: 3,
                    title: 'Update verfügbar',
                    description: 'Es gibt ein neues Update für dein Dashboard.',
                    date: '2025-07-15'
                }
            ])
        }, 1000)
    })
}

function notify_deletion(id: number): void {
    console.log(`Benachrichtigung mit ID ${id} wurde gelöscht.`)
}

export default function MailingList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [openNotification, setOpenNotification] = useState<Notification | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch_notifications().then(data => {
            setNotifications(data)
            setLoading(false)
        })
    }, [])

    const removeNotification = (id: number) => {
        notify_deletion(id)
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    return (
        <>
            <div className="d-flex flex-column gap-2" style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '1rem',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.0)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                overflowY: 'hidden',
                height: '100%'
            }}>
                {loading ? (
                    <div className="d-flex justify-content-center py-4">
                        <div className="spinner"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <p className="text-white text-center small opacity-50">Keine Benachrichtigungen</p>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            className="position-relative px-4 py-3 rounded-4 bg-light bg-opacity-10 text-white small shadow-sm notification-item"
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(4px)',
                            }}
                            onClick={() => setOpenNotification(n)}
                        >
                            <span className="fw-bold">{n.title}</span>
                            <span className="ms-2 text-secondary" style={{ fontSize: '0.75rem' }}>{n.date}</span>

                            <button
                                className="btn btn-sm fancy-x shadow-sm"
                                onClick={e => {
                                    e.stopPropagation()
                                    removeNotification(n.id)
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>

            {openNotification && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
                    onClick={() => setOpenNotification(null)}
                >
                    <div
                        className="bg-dark text-white rounded-4 shadow-lg p-4"
                        style={{ maxWidth: '90%', width: '400px', backdropFilter: 'blur(8px)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h5 className="mb-2">{openNotification.title}</h5>
                        <p className="text-secondary small mb-2">{openNotification.date}</p>
                        <p className="mb-0">{openNotification.description}</p>
                        <div className="text-end mt-3">
                            <button
                                className="btn btn-sm btn-light rounded-pill px-3"
                                onClick={() => setOpenNotification(null)}
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .notification-item {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease, background-color 0.3s ease;
                }

                .notification-item:hover {
                    transform: translateX(-4px);
                    background-color: rgba(255,255,255,0.05);
                }

                .fancy-x {
                    position: absolute;
                    top: 50%;
                    right: 1rem;
                    transform: translateY(-50%);
                    border: none;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 0.9rem;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .notification-item:hover .fancy-x {
                    opacity: 1;
                    background: rgba(255, 80, 80, 0.2);
                    color: #ffdddd;
                }

                .fancy-x:hover {
                    background: rgba(255, 80, 80, 0.3);
                    color: #ffffff;
                    box-shadow: 0 0 6px rgba(255, 100, 100, 0.5);
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
            `}</style>
        </>
    )
}
