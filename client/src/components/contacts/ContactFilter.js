import React, { useContext, useRef, useEffect } from 'react'
import ContactContext from '../../context/contact/contactContext'

const ContactFilter = () => {
  const contactContext = useContext(ContactContext)

  const { filterContacts, clearFilter, filteredContacts } = contactContext

  useEffect(() => {
    if (filteredContacts === null) {
      text.current.value = ''
    }
  })

  const text = useRef('')

  const handleChange = (e) => {
    if (text.current.value !== '') {
      filterContacts(e.target.value)
    } else clearFilter()
  }
  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Filter Contacts...'
        onChange={handleChange}
      />
    </form>
  )
}

export default ContactFilter
