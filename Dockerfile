# ── 1) Basis-Image
FROM python:3.10-slim

# ── 2) Arbeitsverzeichnis
WORKDIR /app

# ── 3) Abhängigkeiten installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── 4) Restlichen Code rein
COPY . .

# ── 5) Startkommando
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
