import { useContext, useState } from "react";
import apiContext from "../Context/apiContext";

export default function ContactAdder({
  newContact,
  setNewContact,
  setChatData,
  setAddContact,
}) {
  const { addContact } = useContext(apiContext);

  const onChange = (e) => {
    setNewContact((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };
  const onClick = (e) => {
    e.preventDefault();
    if (newContact.name === "" || newContact.phonenumber === "") {
      console.log("empty data");
      return;
    }
    setNewContact({ name: "", phonenumber: "" });
    addContact(newContact);
    setChatData((data) => {
      return { contacts: [...data.contacts, { ...newContact }] };
    });
  };
  return (
    <div className="contactAdderMain">
      <form className="mainAdderForm">
        <div
          className="closeButton"
          onClick={() => {
            setAddContact(false);
          }}
        >
          {" "}
          &times;{" "}
        </div>
        <input
          className="adderInput"
          type="text"
          placeholder="Name"
          name="name"
          value={newContact.name}
          onChange={onChange}
          required
        />
        <input
          className="adderInput"
          type="number"
          placeholder="Phone Number"
          name="phonenumber"
          value={newContact.phonenumber}
          onChange={onChange}
          required
        />
        <input
          className="adderButton"
          type="submit"
          value="Add Contact"
          onClick={onClick}
        />
      </form>
    </div>
  );
}
