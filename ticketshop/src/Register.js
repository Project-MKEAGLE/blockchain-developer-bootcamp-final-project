import React from 'react'

export default function Register({registerSeller, isSeller}) {

    return (
        <div>
            <h2>Register</h2>

            <button onClick={() => registerSeller()} disabled={isSeller}>
                {isSeller ? "Registered" : "Register Seller"}
            </button>

        </div>
    )
}