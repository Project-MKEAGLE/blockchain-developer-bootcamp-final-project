import React from 'react'


export default function Header({activeAccount, userBalance, owner, isPaused, pause, unpause}) {
    return (
        <div>
            <h1>Ticket Shop</h1>
            <h2>Supported Network: Ropsten</h2>
            <p>Account: {activeAccount}</p>
            <p>Balance: {userBalance}</p>
            {activeAccount === owner
                ? <button onClick={() => isPaused ? unpause() : pause()}>
                    {isPaused ? "Unpause" : "Pause"}
                </button>
                : null
            }
        </div>
    )
}

