#!/usr/bin/env bash
# 1) User anlegen
curl -s -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d "@examples/example_user_create.json"

# 2) Login und Token holen
TOKEN=$(curl -s -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d "@examples/example_user_login.json" | jq -r .access_token)

# 3) Inventar setzen
curl -s -X POST http://localhost:8000/set_amount \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "@examples/example_inventory_set.json"

# 4) Inventar listen
curl -s -X GET http://localhost:8000/inventory \
  -H "Authorization: Bearer $TOKEN"

# 5) Inventar löschen
curl -s -X DELETE http://localhost:8000/clear_inventory \
  -H "Authorization: Bearer $TOKEN"
