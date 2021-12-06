import React from 'react'


export default function EventList({events, buyTicket, web3, isPaused, getTicketOwned}) {

    return (
        <div>
            <h2>Events</h2>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Price</th>
                        <th>Tickets Available</th>
                        <th>Sale End</th>
                        <th>Purchase Ticket</th>
                    </tr>
                </thead>

            <tbody>
                {events.map((newEvent) => (
                    <tr key={newEvent.id}>
                        <td>{newEvent.name}</td>
                        <td>{web3.utils.fromWei(newEvent.price)} ETH</td>
                        <td>{newEvent.supply - newEvent.amountSold}</td>
                        <td>{new Intl.DateTimeFormat("en-GB", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit"
                            }).format(newEvent.saleEnd * 1000)
                            }
                        </td>
                        <td>
                            <button onClick={async () => {buyTicket(newEvent.id)}} disabled={isPaused}>
                                    {isPaused ? "Contract paused" : "Buy Now"}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>


            </table>
        </div>
    )
}
