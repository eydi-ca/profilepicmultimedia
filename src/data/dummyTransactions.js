export const dummyTransactions = [
  {
    id: "tx-001",
    reference_no: "PAY-7721-AX90",
    amount: 4950.00,
    status: "completed",
    purchase_type: "full_unlock",
    customer_email: "nico.robin@archaeo.com",
    created_at: "2026-02-08T10:30:00Z",
    profiles: { full_name: "Nico Robin" }
  },
  {
    id: "tx-002",
    reference_no: "PAY-8832-BK12",
    amount: 500.00,
    status: "pending",
    purchase_type: "credits_pack_10",
    customer_email: "vinsmoke.sanji@baratie.fr",
    created_at: "2026-02-09T14:15:00Z",
    profiles: { full_name: "Sanji Vinsmoke" }
  },
  {
    id: "tx-003",
    reference_no: "PAY-1674-BK14",
    amount: 1100.00,
    status: "pending",
    purchase_type: "credits_pack_30",
    customer_email: "tony.chopper@kureha.fr",
    created_at: "2026-03-09T15:22:00Z",
    profiles: { full_name: "Tony Tony Chopper" }
  }
  // Add more as needed for testing...
];