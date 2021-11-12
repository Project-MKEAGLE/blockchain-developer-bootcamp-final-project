import React from 'react'

export default function Register({registerBuyer, registerSeller, isBuyer, isSeller}) {

    return (
        <div>
            <h2>Register</h2>
            <button onClick={() => registerBuyer()} disabled={isBuyer}>
                {isBuyer ? "Registered" : "Register Buyer"}
            </button>

            <button onClick={() => registerSeller()} disabled={isSeller}>
                {isSeller ? "Registered" : "Register Seller"}
            </button>

        </div>
    )
}