import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const Container = styled.div.attrs({
    className: "pt-4"
})``;

const ShipmentInfo = styled.div.attrs({
    className: "bg-white w-full flex mx-auto rounded-md shadow-lg",
})``;

const InfoHeader = styled.h3.attrs({
    className: "text-thril-red-dark font-bold md:text-lg text-xs after:content-[''] after:block after:mx-auto after:w-10/12 after:pt-2 after:border-b-2 after:border-thril-grey-dark",
})``

const InfoItem = styled.div.attrs({
    className: "items-center text-center text-xs md:text-lg",
})``;

const Toggle = styled.button.attrs({
    className: "bg-thril-grey-dark relative hover:bg-thril-red-dark w-8 md:w-16 rounded-l-md",
})``;

const InfoClosed = styled.div.attrs({
    className: "bg-transparent rounded-r-md grid gap-2 grid-cols-3 md:grid-cols-5 w-full py-2 rounded-r-md",
})``;

const InfoOpen = styled.div.attrs({
    className: "bg-transparent rounded-r-md grid gap-2 grid-cols-4 md:grid-cols-6 w-full py-2",
})``;

const LineItem = styled.div.attrs({
    className: "text-xs md:text-lg grid gap-2 grid-cols-4 md:grid-cols-6 text-center justify-center items-center mx-auto",
})``;

const LineItems = styled.div.attrs({
    className: "w-full",
})``;

const HorizontalLine = styled.div.attrs({
    className: "rounded-full h-1 w-4 md:w-8 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
})``;

const VeritcalLine = styled.div.attrs({
    className: "rounded-full h-4 md:h-8 w-1 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
})``;

export default function Shipment (props) {
    const [open, setOpen] = useState(false);
    const [totalPallets, setTotalPallets] = useState(0);

    const toggle = () => {
        setOpen(!open);
    };

    // sum pallets
    useEffect(() => {
        let pallets =0;
        props.items.forEach(item => {
           pallets += item.pallets;
        });
        setTotalPallets(pallets)
    },[])

    return(
        <Container>
            {!open && <ShipmentInfo>
                <Toggle onClick={toggle}>
                        <HorizontalLine />
                        <VeritcalLine />
                </Toggle>
                <InfoClosed>
                    <InfoItem className='col-span-1'> <InfoHeader>PRO</InfoHeader> <p>{props.pro}</p> </InfoItem>
                    <InfoItem className='col-span-1'> <InfoHeader>Carrier</InfoHeader> <p>{props.carrier.name}</p> </InfoItem>
                    <InfoItem className='col-span-1'> <InfoHeader>Status</InfoHeader> <p>{props.status}</p> </InfoItem>
                    <InfoItem className='col-span-2 md:col-span-1'><InfoHeader >Shipper</InfoHeader> <p>{props.shipper}</p></InfoItem>
                    <InfoItem className='col-span-1'> <InfoHeader>Pallets</InfoHeader> <p>{totalPallets}</p></InfoItem>
                </InfoClosed>
            </ShipmentInfo>}

            {open && <ShipmentInfo>
                <Toggle onClick={toggle}>
                    <HorizontalLine />
                </Toggle>
                <InfoOpen>
                    <InfoItem className='col-span-1'><InfoHeader>PRO</InfoHeader> <p>{props.pro}</p> </InfoItem>
                    <InfoItem className='col-span-2'><InfoHeader>Carrier</InfoHeader> <p>{props.carrier.name}</p> </InfoItem>
                    <InfoItem className='col-span-1'><InfoHeader>Status</InfoHeader> <p>{props.status}</p> </InfoItem>
                    <InfoItem className='col-span-2'><InfoHeader>Shipped On</InfoHeader> <p>{props.shipped_on}</p></InfoItem>
                    <InfoItem className='col-span-2'><InfoHeader >Shipper</InfoHeader> <p>{props.shipper}</p></InfoItem>
                    <InfoItem className='col-span-2'><InfoHeader>Destination</InfoHeader> <p>{props.destination}</p></InfoItem>
                    <InfoItem className='col-span-2'><InfoHeader>Est. Delivery Date</InfoHeader> <p>{props.est_delivery}</p></InfoItem>
                    <InfoItem className='col-span-1 md:col-span-3'><InfoHeader>Part Number</InfoHeader></InfoItem>
                    <InfoItem className='col-span-1'><InfoHeader>PO</InfoHeader></InfoItem>
                    <InfoItem className='col-span-1'><InfoHeader>Quantity</InfoHeader></InfoItem>
                    <InfoItem className='col-span-1'><InfoHeader>Pallets</InfoHeader></InfoItem>
                    <LineItems className='col-span-4 md:col-span-6'>
                        {props.items && props.items.length >= 1 && props.items.map((item, idx)=> (
                            <LineItem className={`item-${item.item_number}`} key={`item-${item.item_number}`}>
                                <div className='col-span-1 md:col-span-3'><p>{item.part_number}</p></div>
                                <div className='col-span-1'> <p>{item.purchase_order}</p></div>
                                <div className='col-span-1'><p>{item.quantity}</p></div>
                                <div className='col-span-1'> <p>{item.pallets}</p></div>
                            </LineItem>
                        ))}
                    </LineItems>
                    <InfoItem className="col-span-3 md:col-span-5"></InfoItem>
                    <InfoItem className='col-span-1'> <InfoHeader>Total Pallets</InfoHeader> <p>{totalPallets}</p></InfoItem>
                </InfoOpen>
            </ShipmentInfo>} 
        </Container>
    );
};