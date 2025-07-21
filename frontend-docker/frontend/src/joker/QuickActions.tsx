import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

type Mode = 'scan' | 'consume' | 'search' | null

interface QuickActionsProps {
    onSelectItem: (itemId: string) => void
}

export default function QuickActions({ onSelectItem }: QuickActionsProps) {
    const [mode, setMode] = useState<Mode>(null)
    const [barcode, setBarcode] = useState<string>('')

    const scan = (code: string): void => console.log('Scanning:', code)
    const consume = (code: string): void => console.log('Consuming:', code)
    const search = (code: string): void => console.log('Searching:', code)

    const handleSubmit = (): void => {
        if (!barcode.trim()) return
        if (mode === 'scan') {
            scan(barcode)
            // Feld leeren, aber im Scan-Modus bleiben
            onSelectItem(barcode)
            setBarcode('')
            return
        }
        if (mode === 'consume') {
            consume(barcode)
            // Feld leeren, aber im Consume-Modus bleiben
            onSelectItem(barcode)
            setBarcode('')
            return
        }
        if (mode === 'search') {
            search(barcode)
            onSelectItem(barcode)
            setBarcode('')
            setMode(null)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="quick-actions-panel d-flex flex-column justify-content-center rounded h-100">
            {mode ? (
                <div className="mode-container d-flex flex-column p-3">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Eingabe..."
                        value={barcode}
                        onChange={e => setBarcode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary flex-fill"
                            onClick={() => { setMode(null); setBarcode('') }}
                        >Abbrechen</button>
                        <button
                            className="btn btn-primary flex-fill"
                            onClick={handleSubmit}
                        >Senden</button>
                    </div>
                </div>
            ) : (
                <div className="button-container d-flex justify-content-center align-items-center gap-2">
                    <button
                        className="quick-action-button"
                        onClick={() => setMode('scan')}
                    >🔍 Scan</button>
                    <button
                        className="quick-action-button text-dark"
                        onClick={() => setMode('consume')}
                    >🍽️ Consume</button>
                    <button
                        className="quick-action-button"
                        onClick={() => setMode('search')}
                    >🔎 Search</button>
                </div>
            )}

            <style>{`
                .quick-actions-panel {
                    background-color: transparent !important;
                    /* stärkerer, tieferer Schatten */
                    box-shadow: 0 10px 30px rgba(0, 128, 64, 0.3);
                    overflow: hidden;
                    padding: 1rem;
                }
                .button-container {
                    flex: none;
                    padding: 1rem;
                    background: transparent;
                }
                .mode-container {
                    background: transparent;
                }
                .quick-action-button {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: bold;
                    border: none;
                    background-color: #28a745;
                    color: white;
                    /* stärkerer Button-Schatten */
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
                    transition: transform 0.2s ease, box-shadow 0.3s ease;
                }
                .quick-action-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
                }
                .quick-action-button:active {
                    transform: scale(0.95);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </div>
    )
}
