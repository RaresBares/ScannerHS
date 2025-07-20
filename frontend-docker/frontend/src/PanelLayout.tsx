import { Suspense, useState, useRef } from 'react'
import ModernNavbar from './NavBar'
import SettingCard from './large_components/SettingCard'
import ElementList, { type ElementListHandle, type Item } from './large_components/ElementList'
import ElementEditCard from './large_components/ElementEditCard'

export default function PanelLayout() {
    const [showFilter, setShowFilter] = useState(true)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const listRef = useRef<ElementListHandle>(null)

    const handleItemClick = (id: number) => {
        const item = listRef.current?.getItemById(id)
        if (item) {
            setSelectedItem(item)
            setEditOpen(true)
        }
    }

    const handleSaveSuccess = () => {
        if (selectedItem) {
            listRef.current?.updateItem(selectedItem.id, selectedItem)
        }
    }

    return (
        <div className="vh-100 vw-100 d-flex flex-column bg-dark text-white">
            <ModernNavbar />
            <div className="container-fluid flex-grow-1 py-3 overflow-hidden">
                <div className="row h-100 g-3">
                    {/* Linke Seite */}
                    <div className="col-12 col-lg-6 d-flex flex-column gap-3">
                        <div className="card military-card bg-success bg-opacity-75 text-white text-center p-4 flex-fill">
                            <h2 className="fw-bold">Karte 1</h2>
                            <p className="mb-0">Oben links</p>
                        </div>

                        {/* ElementEditCard mit Toggle */}
                        <div
                            className="card military-card bg-success bg-opacity-50 text-white text-start p-0 flex-fill position-relative overflow-hidden"
                            style={{
                                transition: 'max-height 0.5s ease',
                                maxHeight: editOpen ? '50vh' : '5rem'
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center p-3" style={{ minHeight: '4.5rem' }}>
                                <h5 className="mb-0 fw-bold text-white">📝 Element bearbeiten</h5>
                                <button
                                    className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                                    onClick={() => setEditOpen(prev => !prev)}
                                >
                                    {editOpen ? 'Zuklappen' : 'Aufklappen'}
                                </button>
                            </div>

                            <div
                                className="px-4 pt-1 pb-4"
                                style={{
                                    opacity: editOpen ? 1 : 0,
                                    transition: 'opacity 0.5s ease',
                                    pointerEvents: editOpen ? 'auto' : 'none'
                                }}
                            >
                                <ElementEditCard
                                    selectedItem={selectedItem}
                                    onSaveSuccess={handleSaveSuccess}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rechte Seite */}
                    <div className="col-12 col-lg-6 d-flex flex-column h-100 gap-3">
                        {/* Filter-Karte */}
                        <div className="card military-card bg-success bg-opacity-25 p-0 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center p-3" style={{ minHeight: '4.5rem' }}>
                                <h5 className="mb-0 fw-bold text-white">🔍 Suchfilter</h5>
                                <button
                                    onClick={() => setShowFilter(prev => !prev)}
                                    className="btn btn-sm px-4 py-1 rounded-pill border-0"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        backdropFilter: 'blur(4px)',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {showFilter ? '🔓 an' : '🔒 aus'}
                                </button>
                            </div>

                            <div
                                className="p-3 overflow-auto"
                                style={{
                                    maxHeight: showFilter ? '60vh' : '0',
                                    transition: 'max-height 0.5s ease, opacity 0.5s ease',
                                    opacity: showFilter ? 1 : 0,
                                    pointerEvents: showFilter ? 'auto' : 'none'
                                }}
                            >
                                <SettingCard />
                            </div>
                        </div>

                        {/* Elementliste */}
                        <div className="card military-card bg-success bg-opacity-50 p-3 d-flex flex-column flex-grow-1 overflow-hidden">
                            <div className="flex-grow-1 overflow-auto">
                                <Suspense fallback={<p className="text-white">Loading...</p>}>
                                    <ElementList ref={listRef} onItemClick={handleItemClick} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .military-card {
                    border-radius: 1rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }
                .military-card:hover {
                    box-shadow: 0 6px 25px rgba(0,0,0,0.4);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    )
}