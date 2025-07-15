import ModernNavbar from "./NavBar.tsx";
import ElementList from "./large_components/ElementList.tsx";
import { Suspense, useState, useRef, useEffect } from "react";
import SettingCard from "./large_components/SettingCard.tsx";

export default function PanelLayout() {
    const [showFilter, setShowFilter] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState<string>('300px');

    useEffect(() => {
        if (contentRef.current) {
            const fullHeight = contentRef.current.scrollHeight;
            requestAnimationFrame(() => {
                setMaxHeight(showFilter ? `${fullHeight + 100}px` : "32px");
            });
        }
    }, [showFilter]);

    return (
        <div className="vh-100 vw-100 d-flex flex-column bg-dark text-white">
            <ModernNavbar />

            <div className="container-fluid flex-grow-1 py-3 overflow-hidden">
                <div className="row h-100 g-3">
                    <div className="col-12 col-lg-5 d-flex flex-column gap-3">
                        <div className="card military-card bg-success bg-opacity-75 text-white text-center p-4 flex-fill">
                            <h2 className="fw-bold">Karte 1</h2>
                            <p className="mb-0">Oben links</p>
                        </div>
                        <div className="card military-card bg-success bg-opacity-50 text-white text-center p-4 flex-fill">
                            <h2 className="fw-bold">Karte 2</h2>
                            <p className="mb-0">Unten links</p>
                        </div>
                    </div>

                    <div id="karte-3" className="col-12 col-lg-7 d-flex flex-column h-100 gap-3">

                        {/* Filter Panel */}
                        <div
                            id="karte-3-1"
                            className="card military-card bg-success bg-opacity-25 p-3 d-flex flex-column"
                            style={{

                                flex: showFilter ? '0 0 auto' : '0 0 2rem',
                                overflow: 'visible',
                                transition: 'flex 0.3s ease'
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '1rem' }}>
                                <h5
                                    className="mb-0 fw-bold text-white"
                                    style={{ letterSpacing: '0.05rem', fontSize: '1.1rem' }}
                                >
                                    🔍 Suchfilter
                                </h5>
                                <button
                                    onClick={() => setShowFilter(prev => !prev)}
                                    className="btn btn-sm px-5 py-2 rounded-pill border-0"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        backdropFilter: 'blur(4px)',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {showFilter ? '🔓 an' : '🔒 aus'}
                                </button>
                            </div>

                            <div
                                className="mt-3 overflow-auto"
                                style={{
                                    maxHeight: showFilter ? '50vh' : '0',
                                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                                    opacity: showFilter ? 1 : 0,
                                    pointerEvents: showFilter ? 'auto' : 'none',
                                }}
                            >

                                    <SettingCard />

                            </div>
                        </div>

                        {/* Elementliste */}
                        <div
                            id="karte-3-2"
                            className="card military-card bg-success bg-opacity-50 p-3 d-flex flex-column flex-grow-1 overflow-hidden"
                        >
                            <div className="flex-grow-1 overflow-auto">
                                <Suspense fallback={<p className="text-white">Loading...</p>}>
                                    <ElementList />
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

                @media (max-width: 768px) {
                    #karte-3 {
                        flex-direction: column;
                    }
                    #karte-3-1,
                    #karte-3-2 {
                        flex: 1 1 50%;
                    }
                }
                
            `}</style>
        </div>
    );
}