import { useCallback, useState } from "react";
import ContactForm from "./ContactForm/ContactForm";
import { nanoid } from "nanoid";
import Filter from "./Filter/Filter";
import ContactList from "./ContactList/ContactList";
import { Container } from "./styles.jsx";
import { loadKey, saveKey } from "../utils";
import { useEffect } from "react";
import { useMemo } from "react";

const LOCALSTORAGE_CONTACTS_KEY = "contacts";

export const App = () => {
  const [contacts, setContacts] = useState(() => loadKey(LOCALSTORAGE_CONTACTS_KEY) || [
    {id: 'id-1', name: 'Rosie Simpson', number: '459-12-56'},
    {id: 'id-2', name: 'Hermione Kline', number: '443-89-12'},
    {id: 'id-3', name: 'Eden Clements', number: '645-17-79'},
    {id: 'id-4', name: 'Annie Copeland', number: '227-91-26'},
  ]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    saveKey(LOCALSTORAGE_CONTACTS_KEY, contacts);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()));
  }, [contacts, filter]);

  const onDelete = useCallback((idDel) => {
    setContacts(prevState => prevState.filter(({ id }) => id !== idDel ));
  }, []);

  const onChangeName = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const onChangeNumber = useCallback((event) => {
    setNumber(event.target.value);
  }, []);

  const onChangeFilter = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  const onSubmit = useCallback(event => {
    event.preventDefault();

    const isContact = contacts.some(({ name: contactName }) => contactName.toLowerCase() === name.toLowerCase());

    if (isContact) {
      alert(`${name} is already in contacts`);
      return;
    }

    const id = nanoid();
    setContacts(prevState => ([...prevState, { id, name, number }] ));
    setName("");
    setNumber("");
  }, [name, number, contacts]);


  return (
    <Container>
      <h1>Phonebook</h1>
      <ContactForm 
        name={name} 
        number={number} 
        onChangeName={onChangeName} 
        onChangeNumber={onChangeNumber}
        onSubmit={onSubmit}/>
      <h2>Contacts</h2>
      <Filter filter={filter} onChange={onChangeFilter} />
      <ContactList contacts={filteredContacts} onDelete={onDelete} />
    </Container>
    
  )
};
