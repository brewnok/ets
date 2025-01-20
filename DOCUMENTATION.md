# Event Ticketing System Development Documentation

## Introduction
The Event Ticketing System is designed to streamline event management and enhance user convenience through an intuitive interface for booking tickets and verifying entries. The system consists of two distinct software components:

1. **SOFTWARE1 (Booking):** Enables users to book event tickets and generate a QR code after payment.
2. **SOFTWARE2 (Scanner):** Verifies entry by scanning the QR code and validating it against the database.

This documentation outlines the development process, technical considerations, and implementation details using HTML, CSS, JavaScript, and Python Flask.

---

## Architecture Diagram

![ets_architecture](ETS_ARCH.jpg)

---

## Development Details

### SOFTWARE1: Booking System

#### Features:
- User-friendly interface for ticket booking.
- Razorpay integration for secure payment.
- QR code generation containing a unique identifier (UNIQUE_ID).
- Data storage in MySQL database hosted on AWS RDS.

#### Development Steps:
1. **Frontend Development:**
   - Use **HTML, CSS, and JavaScript** to create the booking form.
     - Fields: `FIRSTNAME` (mandatory), `PHONE NUMBER` (mandatory), `EMAIL` (optional).
     - Include client-side validation for mandatory fields.
   - Add a "Submit" button to send user input to the server.

2. **Backend Development:**
   - Set up a **Flask** application for handling form submissions.
     - Endpoint: `/submit` to receive POST requests with user data.
   - Implement server-side validation for inputs.
   - Generate the `UNIQUE_ID` using the following format:
     ```
     UNIQUE_ID = FIRST_NAME + PHONE_NO + REG_DATE
     ```
   - Save the data in the MySQL database table with columns:
     - `FIRST_NAME`, `PHONE_NO`, `EMAIL_ID`, `UNIQUE_ID`, `REG_DATE`, `PRESENT` (default: `0`).

3. **Payment Integration:**
   - Integrate Razorpay API for payment processing.
   - Redirect users to the Razorpay payment page upon form submission.
   - Capture the payment status and handle success or failure responses.

4. **QR Code Generation:**
   - Use a Python library like `qrcode` to generate QR codes.
   - Encode the `UNIQUE_ID` into the QR code.
   - Display the QR code on the success page with an option to download.

#### Database Schema:
```sql
CREATE TABLE tickets (
    FIRST_NAME VARCHAR(50) NOT NULL,
    PHONE_NO VARCHAR(15) NOT NULL,
    EMAIL_ID VARCHAR(100),
    UNIQUE_ID VARCHAR(100) PRIMARY KEY,
    REG_DATE DATE NOT NULL,
    PRESENT BOOLEAN DEFAULT 0
);
```

---

### SOFTWARE2: Scanner Application

#### Features:
- QR code scanning capability.
- Database validation for entry approval.

#### Development Steps:
1. **Frontend Development:**
   - Use HTML and CSS to create a simple interface with a scanner button.
   - Implement QR code scanning functionality using **JavaScript** and a library like `instascan` or `jsQR`.

2. **Backend Development:**
   - Set up a Flask endpoint (`/validate`) to handle POST requests from the scanner app.
   - Extract the `UNIQUE_ID` from the scanned QR code and query the database.
     ```python
     SELECT * FROM tickets WHERE UNIQUE_ID = ?;
     ```
   - Check if the record exists and the `PRESENT` column is `0`.
     - If valid: Update `PRESENT` to `1` and return "ENTRY GRANTED."
     - If invalid: Return "ENTRY REJECTED."

3. **Database Interaction:**
   - Use Flask's SQLAlchemy or a library like `PyMySQL` for database operations.

#### Scanner Workflow:
1. User scans the QR code.
2. The `UNIQUE_ID` is extracted and sent to the Flask backend.
3. The backend validates the ID and responds with the result.
4. Display the result as a popup.

---

## Technical Considerations

### Security:
- Sanitize and validate user inputs to prevent SQL injection and XSS attacks.
- Use HTTPS for secure communication between client, server, and Razorpay.
- Store sensitive information (like Razorpay API keys) in environment variables.

### Scalability:
- Deploy the Flask application and database on scalable cloud infrastructure (e.g., AWS EC2 and RDS).
- Use connection pooling for database interactions.

### Error Handling:
- Implement robust error handling for payment failures and database queries.
- Provide user-friendly error messages for invalid inputs or QR codes.

### Testing:
- Perform end-to-end testing for booking and scanning workflows.
- Test the application for edge cases, such as duplicate registrations or invalid QR codes.

---

## Tools and Libraries
- **Frontend:** HTML, CSS, JavaScript, Bootstrap.
- **Backend:** Python Flask.
- **Database:** MySQL on AWS RDS.
- **Payment Gateway:** Razorpay.
- **QR Code Generation:** `qrcode` Python library.
- **QR Code Scanning:** `instascan` or `jsQR` JavaScript libraries.

---

## Deployment
1. Host the Flask application on a cloud platform (e.g., AWS, Heroku).
2. Use AWS RDS for database hosting.
3. Configure domain and SSL certificates for secure access.

This documentation serves as a guide for developing the Event Ticketing System with all necessary features and considerations for a seamless experience.

