from datetime import datetime
from app.database import LogSessionLocal
from app.models.inventory_log import InventoryLog

def log_action(user_uuid: str, action: str, barcode: str = None, shelf_id: int = None, details: dict = None):
    db = LogSessionLocal()
    log = InventoryLog(
        user_uuid=user_uuid,
        action=action,
        barcode=barcode,
        shelf_id=shelf_id,
        created_at=datetime.utcnow(),
        details=details or {}
    )
    db.add(log)
    db.commit()
    db.close()
