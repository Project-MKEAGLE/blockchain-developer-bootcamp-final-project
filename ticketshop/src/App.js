import React, { useEffect, useState } from 'react'
import { getWeb3, getTicketShop } from './utils.js'
import Register from './Register.js'
import CreateEvent from './CreateEvent.js'
import EventList from './EventList.js'

export default function App() {
  const [web3, setWeb3] = useState(undefined)
  const [ts, setTs] = useState(undefined)
  const [accounts, setAccounts] = useState(undefined)
  const [activeAccount, setActiveAccount] = useState("Not connected")
  const [events, setEvents] = useState([])
  const [isBuyer, setIsBuyer] = useState(undefined)
  const [isSeller, setIsSeller] = useState(undefined)
  const [loading, setLoading] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3()
      const ts = await getTicketShop(web3)
      const accounts = await web3.eth.getAccounts()
      const activeAccount = accounts[0]
      const events = await ts.methods.getEvents().call()
      const isBuyer = await ts.methods.isBuyer(accounts[0]).call() 
      const isSeller = await ts.methods.isSeller(accounts[0]).call()
      
      setLoading(true)
      setWeb3(web3)
      setTs(ts)
      setAccounts(accounts)
      setActiveAccount(activeAccount)
      setEvents(events)
      setIsBuyer(isBuyer)
      setIsSeller(isSeller)
      setLoading(false)
    }
    init()
  }, [])

  const registerBuyer = () => {
    ts.methods.registerBuyer().send({from: accounts[0]})
  }

  const registerSeller = () => {
    ts.methods.registerSeller().send({from: accounts[0]})

  }
  
  const createEvent = (newEvent) => {
    setLoading(true)
    let formattedPrice = web3.utils.toWei(newEvent.eventPrice).toString()
    ts.methods.createEvent(newEvent.eventName, formattedPrice, newEvent.eventSupply).send({from: accounts[0]})
      .on('transactionHash', (hash) => {
        setLoading(false)
      })
  }

  const buyTicket = (eventId) => {
    ts.methods.buyTicket(eventId)
      .send({from: accounts[0], value: events[eventId].price})
      .then(console.log(ticketOwned(accounts[0], eventId)))
  }

  const ticketOwned = (address, eventId) => {
    ts.methods.getTicketOwned(address, eventId).call().toString()
  }


  
  return (
    <div className="App">
      <h1>Ticket Shop</h1>
      {activeAccount}
      {loading 
        ? <div id="loader"><p>Loading...</p></div>
        : <div>
            <Register
              registerBuyer={registerBuyer}
              registerSeller={registerSeller}
              isBuyer={isBuyer}
              isSeller={isSeller}
            />
            {isSeller
              ?
                <CreateEvent
                createEvent={createEvent}
                />
              : null
            }
            
            <EventList
              events={events}
              activeAccount={activeAccount}
              buyTicket={buyTicket}
              web3={web3}
              ticketOwned={ticketOwned}
            />
          </div>
      }
    </div>
  );
  
  
  
}


