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
        await new Promise(resolve => setTimeout(resolve, 500))
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
        <div
            className="w-100 h-100 d-flex flex-column"
            style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '1rem',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.0)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                overflowY: 'hidden'
            }}
        >
            <form className="row g-2 text-white small" onSubmit={e => { e.preventDefault(); handleSave() }}>
                <div className="col-12">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.name}
                        onChange={e => handleChange('name', e.target.value)}
                    />
                </div>

                <div className="col-6">
                    <label className="form-label">Anzahl</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.amount}
                        onChange={e => handleChange('amount', e.target.value)}
                    />
                </div>

                <div className="col-6">
                    <label className="form-label">Barcode</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.barcode}
                        onChange={e => handleChange('barcode', e.target.value)}
                    />
                </div>

                <div className="col-4">
                    <label className="form-label">Upper Bound</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.max}
                        onChange={e => handleChange('max', e.target.value)}
                    />
                </div>

                <div className="col-4">
                    <label className="form-label">Lower Bound</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.min}
                        onChange={e => handleChange('min', e.target.value)}
                    />
                </div>

                <div className="col-4">
                    <label className="form-label">Expiry Date</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.expiry}
                        onChange={e => handleChange('expiry', e.target.value)}
                    />
                </div>

                <div className="col-6">
                    <label className="form-label">Created At</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.createdAt}
                        onChange={e => handleChange('createdAt', e.target.value)}
                    />
                </div>

                <div className="col-6">
                    <label className="form-label">Beschreibung</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        value={formData.description}
                        onChange={e => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-2" style={{
                    paddingTop: '1rem',
                }}>
                    <button type="reset" className="btn btn-outline-light btn-sm rounded-pill px-3">Reset</button>
                    <button type="submit" className="btn btn-light btn-sm rounded-pill px-3">💾 Speichern</button>
                </div>
            </form>
        </div>
    )
}
