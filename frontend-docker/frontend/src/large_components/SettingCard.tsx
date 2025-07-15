import 'bootstrap/dist/css/bootstrap.min.css';

export default function SettingCard() {
    return (
        <div
            className="w-100 h-100 d-flex flex-column overflow-auto"
            style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                borderRadius: '1rem',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
        >


            <form className="row g-2 text-white small">

                <div className="col-12">
                    <label className="form-label">Name</label>

                    <input type="text" className="form-control form-control-sm rounded-pill" placeholder="z.B. Kühlschrank" />
                </div>

                <div className="col-6">
                    <label className="form-label">Shelf</label>
                    <input type="text" className="form-control form-control-sm rounded-pill" placeholder="Shelf ID" />
                </div>

                <div className="col-6">
                    <label className="form-label">Barcode</label>
                    <input type="text" className="form-control form-control-sm rounded-pill" placeholder="z.B. 123456789" />
                </div>

                <div className="col-4">
                    <label className="form-label">Max-Amount</label>
                    <input type="number" className="form-control form-control-sm rounded-pill" placeholder="100" />
                </div>

                <div className="col-4">
                    <label className="form-label">Min-Amount</label>
                    <input type="number" className="form-control form-control-sm rounded-pill" placeholder="5" />
                </div>

                <div className="col-4">
                    <label className="form-label">Expires in (Tage)</label>
                    <input type="number" className="form-control form-control-sm rounded-pill" placeholder="30" />
                </div>

                <div className="col-12 d-flex align-items-center gap-2">
                    <label className="form-label mb-0">Abgelaufen:</label>
                    <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" id="expiredCheck" style={{ transform: 'scale(1.2)' }} />
                    </div>
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                    <button type="reset" className="btn btn-outline-light btn-sm rounded-pill px-3">Reset</button>
                    <button type="submit" className="btn btn-light btn-sm rounded-pill px-3">Suchen</button>
                </div>
            </form>
        </div>
    );
}
