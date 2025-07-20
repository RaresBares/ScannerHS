import { useState, useEffect } from 'react'
import type { Item } from './ElementList'

type Props = {
    selectedItem: Item | null
    onSaveSuccess: () => void
}

export default function ElementEditCard({ selectedItem, onSaveSuccess }: Props) {
    const [formData, setFormData] = useState<Item | null>(null)

    useEffect(() => {
        if (selectedItem) {
            setFormData({ ...selectedItem })
        }
    }, [selectedItem])

    const handleChange = (field: keyof Item, value: string) => {
        if (formData) {
            setFormData({ ...formData, [field]: value })
        }
    }

    const sendToServer = async (data: Item) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Gesendet an Server:', data)
    }

    const handleSave = async () => {
        if (formData) {
            await sendToServer(formData)
            onSaveSuccess()
        }
    }

    if (!formData) {
        return <p className="text-light">Kein Element ausgewählt.</p>
    }

    return (
        <div className="text-white">
            <h5 className="fw-bold mb-3">🔧 Element bearbeiten</h5>
            <div className="row g-3">
                {[
                    ['name', 'Name'],
                    ['amount', 'Anzahl'],
                    ['max', 'Upper Bound'],
                    ['min', 'Lower Bound'],
                    ['expiry', 'Expiry Date'],
                    ['createdAt', 'Created At'],
                    ['barcode', 'Barcode'],
                    ['description', 'Beschreibung'],
                ].map(([key, label]) => (
                    <div className="col-12" key={key}>
                        <label className="form-label small">{label}</label>
                        <input
                            type="text"
                            className="form-control form-control-sm bg-dark text-light border-success"
                            value={(formData as any)[key] || ''}
                            onChange={e => handleChange(key as keyof Item, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-3 text-end">
                <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={handleSave}
                >
                    Speichern
                </button>
            </div>
        </div>
    )
}
