# activity-log-service API (Step-2)

| Item | Value |
| --- | --- |
| Port | `8107` |
| Base URL | `http://localhost:8107` |
| Prefix | `/api/v1/activity-logs` |
| Auth | Bearer hospital JWT |
| Endpoints | **3** |

Audit trail rows land in the hospital `activity_logs` table (JWT `schemaName`). Call after clinical mutations from the FE (or gateway).

---

## Endpoints

### `POST /api/v1/activity-logs`

```json
{
  "page": "PATIENTS",
  "action": "CREATED",
  "target": "Patient GAN-DL-PT-00001",
  "beforeValue": null,
  "afterValue": "{\"fullName\":\"Ravi Kumar\"}",
  "activityTimestamp": "2026-08-31T10:00:00",
  "performedByUserId": "…",
  "performedByUserName": "Hospital Admin",
  "performedByRole": "ADMIN"
}
```

`action`: `VIEWED` \| `CREATED` \| `UPDATED` \| `DELETED`.

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "…",
    "page": "PATIENTS",
    "action": "CREATED",
    "target": "Patient GAN-DL-PT-00001",
    "before": null,
    "after": "{\"fullName\":\"Ravi Kumar\"}",
    "timestamp": "2026-08-31T10:00:00",
    "performedByUserId": "…",
    "performedByUserName": "Hospital Admin",
    "performedByRole": "ADMIN"
  }
}
```

### `GET /api/v1/activity-logs`

Query filters: `page?`, `action?`, `search?` → `List<ActivityLogResponse>`.

### `GET /api/v1/activity-logs/{id}`

Path UUID → `ActivityLogResponse`.

**Note:** Platform Super Admin JWTs (`schemaName: public`) cannot write hospital activity logs via tenant routing.

← [API_GUIDE.md](../API_GUIDE.md)
