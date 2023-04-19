const data = [
    {
        "id": 154,
        "created": `${getFutureDate(-1)}T18:40:33.456037Z`,
        "shipped_on": `${getFutureDate(-1)}T07:34:56Z`,
        "shipper": "James Fran Co",
        "delivery": "2023-04-13T07:34:56Z",
        "est_delivery": getFutureDate(1),
        "pro": "1",
        "status": "available",
        "carrier": {
            "name": "ARM Better"
        },
        "items": [
            {
                "item_number": 1,
                "pallets": 4,
                "part_number": "G78-0000-02",
                "quantity": 3400.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000 Qty: 3400 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            },
            {
                "item_number": 2,
                "pallets": 5,
                "part_number": "G78-0000-03",
                "quantity": 300.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-03 Qty: 300 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            },
            {
                "item_number": 3,
                "pallets": 7,
                "part_number": "G78-0000-04",
                "quantity": 400.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-04 Qty: 400 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            }
        ]
    },
    {
        "id": 254,
        "created": `${getFutureDate(3)}T18:40:33.456037Z`,
        "shipped_on": `${getFutureDate(3)}T07:34:56Z`,
        "shipper": "James Fran Co",
        "delivery": "2023-04-13T07:34:56Z",
        "est_delivery": getFutureDate(5),
        "pro": "2",
        "status": "available",
        "carrier": {
            "name": "Fedecks"
        },
        "items": [
            {
                "item_number": 1,
                "pallets": 4,
                "part_number": "G78-0000-02",
                "quantity": 3400.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-02 Qty: 3400 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            },
            {
                "item_number": 2,
                "pallets": 5,
                "part_number": "G78-0000-03",
                "quantity": 300.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-03 Qty: 300 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            },
            {
                "item_number": 3,
                "pallets": 6,
                "part_number": "G78-0000-04",
                "quantity": 400.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-04 Qty: 400 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            }
        ]
    },
    {
        "id": 155,
        "created": `${getFutureDate(3)}T18:40:33.456037Z`,
        "shipped_on": `${getFutureDate(3)}T07:34:56Z`,
        "shipper": "James Fran Co",
        "delivery": "2023-04-13T07:34:56Z",
        "est_delivery": getFutureDate(5),
        "pro": "1",
        "status": "available",
        "carrier": {
            "name": "ARM Best"
        },
        "items": [
            {
                "item_number": 1,
                "pallets": 1,
                "part_number": "G78-0000",
                "quantity": 3400.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-02 Qty: 3400 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            },
            {
                "item_number": 2,
                "pallets": 1,
                "part_number": "G78-0000",
                "quantity": 300.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-03 Qty: 300 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            },
            {
                "item_number": 3,
                "pallets": 1,
                "part_number": "G78-0000-04",
                "quantity": 400.0,
                "purchase_order": "5T6-02",
                "description": "PN: G78-0000-04 Qty: 400 P0: 5T6-02",
                "shipment": "http://127.0.0.1:8000/shipping/shipments/1/"
            }
        ]
    }
];

// Define a function using the function above which returns the date today pushed forward by the number of days specified in the parameter
function getFutureDate(days) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    // Define statement to check if the day is a Saturday or Sunday and if so, add 2 days to the date
    if (today.getDay() === 6) {
        today.setDate(today.getDate() + 2);;
    } else if (today.getDay() === 0) {
        today.setDate(today.getDate() + 1);;
    }    

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

export default data;