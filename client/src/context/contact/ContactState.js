import React, { useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import ContactContext from './contactContext'
import contactReducer from './contactReducer'
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
  CONTACT_ERROR,
  GET_CONTACTS,
  CLEAR_CONTACTS,
} from '../types'

const ContactState = (props) => {
  const initialState = {
    contacts: null,
    currentContact: null,
    filteredContacts: null,
    error: null,
    loading: true,
  }

  const [state, dispatch] = useReducer(contactReducer, initialState)

  //Get Contacts
  const getContacts = async () => {
    const config = {
      headers: {
        'x-auth-token': localStorage.token,
      },
    }
    try {
      const res = await axios.get('/api/contacts', config)
      dispatch({ type: GET_CONTACTS, payload: res.data })
    } catch (error) {
      dispatch({ type: CONTACT_ERROR, payload: error.response.message })
    }
  }
  //Add Contact
  const addContact = async (contact) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await axios.post('/api/contacts', contact, config)
      dispatch({ type: ADD_CONTACT, payload: res.data })
    } catch (error) {
      dispatch({ type: CONTACT_ERROR, payload: error.response.message })
    }
  }

  //Delete Contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/${id}`)
      dispatch({ type: DELETE_CONTACT, payload: id })
    } catch (error) {
      dispatch({
        type: CONTACT_ERROR,
        payload: error.response.message,
      })
    }
  }

  //Set Current Contact
  const setCurrentContact = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact })
  }
  //Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT })
  }

  //Update Contact
  const updateContact = async (contact) => {
    const { _id } = contact
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await axios.put(`/api/contacts/${_id}`, contact, config)
      dispatch({ type: UPDATE_CONTACT, payload: res.data })
    } catch (error) {
      dispatch({
        type: CONTACT_ERROR,
        payload: error.response.message,
      })
    }
  }
  //Filter Contact
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text })
  }

  //Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER })
  }

  //Clear Contacts
  const clearContacts = () => {
    dispatch({ type: CLEAR_CONTACTS })
  }

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        currentContact: state.currentContact,
        filteredContacts: state.filteredContacts,
        error: state.error,
        getContacts,
        addContact,
        deleteContact,
        setCurrentContact,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
        clearContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  )
}

export default ContactState
