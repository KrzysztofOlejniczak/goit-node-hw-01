const path = require("path");
const fs = require("fs").promises;
const nanoid = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  await fs
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .then((contacts) => console.table(contacts))
    .catch((err) => console.log(err.message));
}

async function getContactById(contactId) {
  await fs
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .then((contacts) => contacts.find((contact) => contact.id === contactId))
    .then((contact) => {
      if (!contact) {
        console.log(`There is no contact with id: ${contactId}`);
        return;
      }
      console.table(contact);
    })
    .catch((err) => console.log(err.message));
}

async function removeContact(contactId) {
  const contacts = await fs
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .catch((err) => console.log(err.message));

  const newContacts = contacts.filter((contact) => contact.id !== contactId);

  if (contacts.length === newContacts.length) {
    console.log(`There is no contact with id: ${contactId}`);
    return;
  }

  await fs
    .writeFile(contactsPath, JSON.stringify(newContacts))
    .catch((err) => console.log(err.message));
  listContacts();
}

async function addContact(name, email, phone) {
  const newContact = { id: nanoid.nanoid(), name, email, phone };
  const contacts = await fs
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .catch((err) => console.log(err.message));

  if (
    contacts.find(
      (contact) =>
        contact.name.toLowerCase().replace(/\s/g, "") ===
        name.toLowerCase().replace(/\s/g, "")
    )
  ) {
    console.log(`Contact with name: ${name} is already in database.`);
    return;
  }

  if (
    contacts.find(
      (contact) =>
        contact.email.toLowerCase().replace(/\s/g, "") ===
        email.toLowerCase().replace(/\s/g, "")
    )
  ) {
    console.log(`Contact with email: ${email} is already in database.`);
    return;
  }

  if (
    contacts.find(
      (contact) =>
        contact.phone.toLowerCase().replace(/\s/g, "") ===
        phone.toLowerCase().replace(/\s/g, "")
    )
  ) {
    console.log(`Contact with phone: ${phone} is already in database.`);
    return;
  }

  await fs
    .writeFile(contactsPath, JSON.stringify([...contacts, newContact]))
    .catch((err) => console.log(err.message));
  listContacts();
}

module.exports = { listContacts, getContactById, removeContact, addContact };
