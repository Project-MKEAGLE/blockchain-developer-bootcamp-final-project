import React from 'react'


export default function EventList({events, activeAccount, buyTicket, web3, ticketOwned}) {
        
    return (
        <div>
            <h2>Events</h2>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Price</th>
                        <th>Tickets Left</th>
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
                            {newEvent.soldOut
                            ? "Sold Out!"
                            : <button onClick={() => {
                                    buyTicket(newEvent.id) 
                                    console.log(ticketOwned(activeAccount, newEvent.id))
                                }}
                              >
                                    Buy Now
                              </button>
                            }
                        </td>
                    </tr>
                    
                ))}
            </tbody>


            </table>
        </div>
    )
}