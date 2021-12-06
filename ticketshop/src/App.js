import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { ethers } from 'ethers'
import TicketShop from './contracts/TicketShop.json'
import detectEthereumProvider from '@metamask/detect-provider'
import Header from './Header.js'
import Register from './Register.js'
import CreateEvent from './CreateEvent.js'
import EventList from './EventList.js'

export default function App() {
  const [web3, setWeb3] = useState(undefined)
  const [ts, setTs] = useState(undefined)
  const [activeAccount, setActiveAccount] = useState("Not connected")
  const [userBalance, setUserBalance] = useState("Not connected")
  const [connected, setConnected] = useState(undefined)
  const [owner, setOwner] = useState(undefined)
  const [events, setEvents] = useState([])
  const [isSeller, setIsSeller] = useState(undefined)
  const [isPaused, setPaused] = useState(undefined)
  const [loading, setLoading] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [eventsCreated, setEventsCreated] = useState(undefined)
  
  const getWeb3 = () => new Promise( async (resolve, reject) => {
    const provider = await detectEthereumProvider()

    if(provider) {
      await provider.request({ method: 'eth_requestAccounts' })
        
      try {
        const web3 = new Web3(window.ethereum)
        resolve(web3)
      } catch(error) {
          reject(error)
        }
    } reject('Install Metamask')
  })

  const getTicketShop = async (web3) => {
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = TicketShop.networks[networkId]
    return new web3.eth.Contract( 
        TicketShop.abi,
        deployedNetwork &&
        deployedNetwork.address
    )
  }

  const connectWalletHandler = async () => {
    const web3 = await getWeb3()
    const ts = await getTicketShop(web3)
    const accounts = await web3.eth.getAccounts()
    const activeAccount = accounts[0]
    const owner = await ts.methods.owner().call()
    const events = await ts.methods.getEvents().call()
    const isSeller = await ts.methods.isSeller(activeAccount).call()
    
    setWeb3(web3)
    setTs(ts)
    setActiveAccount(activeAccount)
    setOwner(owner)
    setEvents(events)
    setIsSeller(isSeller)

    accountChangedHandler(accounts[0])
  }
    
  

  const accountChangedHandler = (newAccount) => {
    setConnected(false)
    setActiveAccount(newAccount)

    getUserBalance(newAccount)

    setConnected(true)
  }

  const chainChangedHandler = () => {
    window.location.reload()
  }

  const getUserBalance = async (account) => {
     let balance = await window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
     let formattedBalance = await ethers.utils.formatEther(balance)
    
     try{
       setUserBalance(formattedBalance)
     } catch(error) {
       setErrorMessage(error.message)
       console.log(errorMessage)
     }
  }

  const pause = async () => {
    setLoading(true)
    ts.methods.pause().send({from: activeAccount})
    .on('transactionHash', (hash) => {
      setPaused(true)
    }).then(setLoading(false))
  }

  const unpause = async () => {
    setLoading(true)
    ts.methods.unpause().send({from: activeAccount})
    .on('transactionHash', (hash) => {
      setPaused(false)
    }).then(setLoading(false))
  }

  const registerSeller = async () => {
    await ts.methods.registerSeller().send({from: activeAccount})
    const isSeller = await ts.methods.isSeller(activeAccount).call()
    setIsSeller(isSeller)
  }
  
  const createEvent = async (newEvent) => {
    let formattedPrice = web3.utils.toWei(newEvent.eventPrice).toString()
    await ts.methods.createEvent(newEvent.eventName, formattedPrice, newEvent.eventSupply).send({from: activeAccount})
      .catch(error => {
        console.log(error.message)
      })
    setEventsCreated(eventsCreated + 1)
  }

  const buyTicket = (eventId) => {
    setLoading(true)
    ts.methods.buyTicket(eventId)
      .send({from: activeAccount, value: events[eventId].price})
      .on('transactionHash', (hash) => {
        setLoading(false)
      })
  }

  // unused
  const getTicketOwned = async (account, eventId) => {
    await ts.methods.ticketOwned(account, eventId).call()
  }

  window.ethereum.on('accountsChanged', connectWalletHandler)
  
  window.ethereum.on('chainChanged', chainChangedHandler)

  return (
    <div className="App">

      <Header
        activeAccount={activeAccount}
        userBalance={userBalance}
        owner={owner}
        isPaused={isPaused}
        pause={pause}
        unpause={unpause}
      />

      {connected 
        ? null 
        : <button onClick={() => connectWalletHandler()}>Connect Wallet</button>
      }
      
      {loading
        ? <div id="loader"><p>Loading...</p></div>
        : <div>
            <Register
              registerSeller={registerSeller}
              isSeller={isSeller}
            />
            {isSeller
              ? isPaused 
                ? "Contract paused"
                : <CreateEvent
                    createEvent={createEvent}
                  />
              : null
            }
            
            {events.length > 0 
            ? <EventList
                events={events}
                activeAccount={activeAccount}
                getTicketOwned={getTicketOwned} //unused
                buyTicket={buyTicket}
                web3={web3}
                isPaused={isPaused}
              />
            : null
            }
          </div>
      }
    </div>
  );
}
