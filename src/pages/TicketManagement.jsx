import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rose from "../assets/rose.png";
import rosemary from "../assets/rosemary.png";
import logo from "../assets/bubble-logo.png";
import "../styles/ticketManagement.css";

function TicketManagement() {
 const navigate = useNavigate();

 const [tickets, setTickets] = useState(() => {
   const saved = localStorage.getItem("tickets");

   return saved
     ? JSON.parse(saved)
     : [
         {
           id: "#123",
           customer: "Username",
           email: "username123@gmail.com",
           phone: "12312312312",
           orderNumber: "#1024",
           amount: "$6.00",
           status: "Pending",
           date: "14-02-2026",
           issueType: "Refund",
           refundEligibility: "Approve",
           subject: "Refund",
           message: "I want a refund",
           orderItems: [
             { name: "Rosemary Bliss", price: "$3.00", qty: 1, image: rosemary },
             { name: "Sakura Bliss", price: "$3.00", qty: 1, image: rose },
           ],
         },
       ];
 });

 useEffect(() => {
   localStorage.setItem("tickets", JSON.stringify(tickets));
 }, [tickets]);

 const [filterStatus, setFilterStatus] = useState("All");
 const [ticketSearch, setTicketSearch] = useState("");
 const [selectedTicketId, setSelectedTicketId] = useState("#123");

 const selectedTicket =
   tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0];

 const [issueType, setIssueType] = useState(selectedTicket.issueType);
 const [refundEligibility, setRefundEligibility] = useState(
   selectedTicket.refundEligibility
 );
 const [status, setStatus] = useState(selectedTicket.status);
 const [note, setNote] = useState("");
 const [savedMessage, setSavedMessage] = useState("");

 const filteredTickets = tickets.filter((ticket) => {
   const matchesStatus =
     filterStatus === "All" || ticket.status === filterStatus;

   const matchesSearch = ticket.id
     .toLowerCase()
     .includes(ticketSearch.toLowerCase());

   return matchesStatus && matchesSearch;
 });

 const handleSelectTicket = (ticket) => {
   setSelectedTicketId(ticket.id);
   setIssueType(ticket.issueType);
   setRefundEligibility(ticket.refundEligibility);
   setStatus(ticket.status);
   setNote("");
   setSavedMessage("");
 };

 const handleUpdate = () => {
   if (!selectedTicket) return;

   const updatedTickets = tickets.map((ticket) =>
     ticket.id === selectedTicket.id
       ? {
           ...ticket,
           issueType,
           refundEligibility,
           status,
         }
       : ticket
   );

   setTickets(updatedTickets);
   setSavedMessage("Saved!");
 };

 return (
   <div className="purple-page ticket-page">
     <div className="ticket-layout">
       <div className="cs-sidebar">
         <div className="cs-logo-card">
           <img src={logo} alt="Bubble Logo" />
         </div>

         <button className="active">Ticket Management</button>

         <button onClick={() => navigate("/customer-service/faqs")}>
           FAQ Templates
         </button>

         <div className="cs-spacer" />

         <button onClick={() => navigate("/")}>Log out</button>
       </div>

       <div className="ticket-main">
         <div className="ticket-top-panel">
           <div className="ticket-filter-row">
             <input
               type="text"
               placeholder="Search by Ticket ID"
               value={ticketSearch}
               onChange={(e) => setTicketSearch(e.target.value)}
             />

             <select
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
               <option value="All">Filter By: All</option>
               <option value="Pending">Filter By: Pending</option>
               <option value="Open">Filter By: Open</option>
               <option value="Processed">Filter By: Processed</option>
             </select>
           </div>

           <table className="ticket-table">
             <thead>
               <tr>
                 <th>Ticket ID</th>
                 <th>Order ID.</th>
                 <th>Customer</th>
                 <th>Amount</th>
                 <th>Status</th>
                 <th>Date</th>
               </tr>
             </thead>

             <tbody>
               {filteredTickets.length > 0 ? (
                 filteredTickets.map((ticket) => (
                   <tr
                     key={ticket.id}
                     className={selectedTicketId === ticket.id ? "selected" : ""}
                     onClick={() => handleSelectTicket(ticket)}
                   >
                     <td>{ticket.id}</td>
                     <td>{ticket.orderNumber}</td>
                     <td>{ticket.customer}</td>
                     <td>{ticket.amount}</td>
                     <td>
                       <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                         {ticket.status}
                       </span>
                     </td>
                     <td>{ticket.date}</td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="6">No tickets found.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>

         <div className="ticket-details-panel">
           <div className="ticket-info-card">
             <h2>Ticket {selectedTicket.id}</h2>

             <div className="ticket-info-table">
               <div className="ticket-info-item">
                 <div className="ticket-info-head">Full Name</div>
                 <div className="ticket-info-value">{selectedTicket.customer}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Email</div>
                 <div className="ticket-info-value">{selectedTicket.email}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Phone Number</div>
                 <div className="ticket-info-value">{selectedTicket.phone}</div>
               </div>

               <div className="ticket-info-item">
                 <div className="ticket-info-head">Order Number</div>
                 <div className="ticket-info-value">{selectedTicket.orderNumber}</div>
               </div>
             </div>
           </div>

           <div className="ticket-content-grid">
             <div className="ticket-message-card">
               <div className="ticket-field">
                 <label>Subject</label>
                 <input type="text" value={selectedTicket.subject} readOnly />
               </div>

               <div className="ticket-field">
                 <label>Message</label>
                 <textarea value={selectedTicket.message} readOnly rows={8} />
               </div>
             </div>

             <div className="ticket-actions-card">
               <div className="ticket-field">
                 <label>Issue Type</label>
                 <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                   <option>Refund</option>
                   <option>Wrong Order</option>
                   <option>Missing Item</option>
                   <option>Late Delivery</option>
                   <option>Other</option>
                 </select>
               </div>

               <div className="ticket-field">
                 <label>Refund Eligibility</label>
                 <select value={refundEligibility} onChange={(e) => setRefundEligibility(e.target.value)}>
                   <option>Approve</option>
                   <option>Reject</option>
                   <option>Pending</option>
                 </select>
               </div>

               <div className="ticket-field">
                 <label>Status</label>
                 <select value={status} onChange={(e) => setStatus(e.target.value)}>
                   <option>Pending</option>
                   <option>Open</option>
                   <option>Processed</option>
                 </select>
               </div>

               <div className="ticket-field">
                 <label>Internal Note</label>
                 <textarea
                   rows={6}
                   placeholder="Write internal note..."
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                 />
               </div>

               <div className="ticket-button-column">
                 <button className="update-btn" onClick={handleUpdate}>
                   Update
                 </button>

                 {savedMessage && (
                   <span className="ticket-message saved">{savedMessage}</span>
                 )}
               </div>
             </div>
           </div>

           <div className="ticket-order-card">
             <h3>Order</h3>

             <table className="ticket-table">
               <thead>
                 <tr>
                   <th>Product</th>
                   <th>Price</th>
                   <th>Quantity</th>
                   <th>Subtotal</th>
                 </tr>
               </thead>

               <tbody>
                 {selectedTicket.orderItems.map((item, index) => (
                   <tr key={index}>
                     <td className="product-cell">
                       <img src={item.image} alt={item.name} />
                       {item.name}
                     </td>
                     <td>{item.price}</td>
                     <td>{item.qty}</td>
                     <td>{item.price}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}

export default TicketManagement;