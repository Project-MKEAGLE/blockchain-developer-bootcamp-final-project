import React, { useState } from 'react'

export default function CreateEvent({createEvent}) {
    const [newEvent, setNewEvent] = useState(undefined)

    const updateEvent = (e, field) => {
        const value = e.target.value
        setNewEvent({...newEvent, [field]: value})
    }
    
    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={(e) => {
                e.preventDefault()
                createEvent(newEvent)
            }}>
                <label htmlFor="eventName">Event</label>
                <input
                    id="eventName"
                    type="text"
                    onChange={(e) => updateEvent(e, "eventName")}
                />
                <label htmlFor="eventPrice">Price</label>
                <input
                    id="eventPrice"
                    type="text"
                    onChange={(e) => updateEvent(e, "eventPrice")}
                />
                <label htmlFor="eventSupply">Supply</label>
                <input
                    id="eventSupply"
                    type="text"
                    onChange={(e) => updateEvent(e, "eventSupply")}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )   
}