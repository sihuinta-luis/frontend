export const fallbackOrders = [
  {
    id: "1",
    orderNumber: "ORD-001",
    date: new Date().toISOString(),
    status: "Completed",
    products: [
      { id: "1", name: "Hamburger Classic", unitPrice: 10, quantity: 2 },
      { id: "2", name: "French Fries", unitPrice: 5, quantity: 1 },
    ],
    productCount: 2,
    finalPrice: 25,
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: "InProgress",
    products: [{ id: "3", name: "Cheeseburger", unitPrice: 12, quantity: 1 }],
    productCount: 1,
    finalPrice: 12,
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    date: new Date().toISOString(),
    status: "Pending",
    products: [
      { id: "4", name: "Chicken Burger", unitPrice: 11, quantity: 2 },
      { id: "5", name: "Soda", unitPrice: 3, quantity: 2 },
    ],
    productCount: 2,
    finalPrice: 28,
  },
];
