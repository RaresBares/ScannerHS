import ModernNavbar from "./NavBar.tsx";
import ElementList from "./large_components/ElementList.tsx";
import {Suspense, useState} from "react";
import SettingCard from "./large_components/SettingCard.tsx";

export default function PanelLayout() {


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

                    <div id="karte-3" className="col-12 col-lg-7 d-flex flex-column flex-md-row flex-lg-column gap-3">
                        {

                            <div id="karte-3-1" className="card military-card bg-success bg-opacity-25 overflow-auto p-2">

                            <SettingCard />
                        </div>

                        }

                        <div id="karte-3-2" className="card military-card bg-success bg-opacity-50 p-3 d-flex flex-column" style={{ flex: "1 1 0", minHeight: 0 }}>
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