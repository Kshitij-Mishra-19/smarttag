                    CUSTOMER
                       │
                       ↓
                   TABLE QR
                       │
                       ↓
                 CUSTOMER WEB
                       │
                       ↓
                  FASTAPI API
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Database     Payment       Device
          │         Gateway       Gateway
          │            │            │
          ↓            ↓            ↓
       Products     Webhook       SmartTag
       Tags         Verify        Lock
       Orders