import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import  { z }from 'zod';
import './index.css';

const contactFormSchema = z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z.string()
      .email("Invalid email address")
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email cannot exceed 100 characters"),
    subject: z.string()
      .min(5, "Subject must be at least 5 characters")
      .max(100, "Subject cannot exceed 100 characters"),
    message: z.string()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message cannot exceed 1000 characters")
  });

export function Form() {
    const [state, setState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [result, setResult] = useState(null);

    const sendEmail = (event) => {
        event.preventDefault();
        
        try {
            // Validate form data
            const validatedData = contactFormSchema.parse(state);
            
            // If validation passes, send the email
            fetch('/send', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedData),
            })
                .then(response => response.json())
                .then(response => {
                    setResult(response);
                    setState({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                    });
                })
                .catch(() => {
                    setResult({
                        success: false,
                        message: 'Something went wrong. Try again later'
                    });
                });
        } catch (error) {
            // Handle Zod validation errors
            if (error.errors) {
                setResult({
                    success: false,
                    message: error.errors[0].message
                });
            }
        }
    };

    const validateField = (name, value) => {
        try {
            // Create a partial schema for single field validation
            const partialSchema = z.object({
                [name]: contactFormSchema.shape[name]
            });
            
            partialSchema.parse({ [name]: value });
            return null; // No error
        } catch (error) {
            return error.errors[0].message;
        }
    };
    
    const onInputChange = (event) => {
        const { name, value } = event.target;
        
        // Validate the field while the user is typing. Maybe annoying?
        const error = validateField(name, value);
        
        setState(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Set validation result
        if (error) {
            setResult({
                success: false,
                message: error
            });
        } else {
            setResult(null);
        }
    };

    return (
        <div className="form-container">
            <h1>Contact us</h1>
            {result && (
                <div className={`message ${result.success ? 'success' : 'error'}`}>
                    {result.message}
                </div>
            )}
            <form onSubmit={sendEmail}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={state.name}
                        onChange={onInputChange}
                        required
                    />
                    <p className="char-count">
                        {state.name.length}/50 characters
                    </p>
                </div>
    
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={state.email}
                        onChange={onInputChange}
                        required
                    />
                </div>
    
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={state.subject}
                        onChange={onInputChange}
                        required
                    />
                    <p className="char-count">
                        {state.subject.length}/100 characters
                    </p>
                </div>
    
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={state.message}
                        onChange={onInputChange}
                        required
                        rows="5"
                    />
                    <p className="char-count">
                        {state.message.length}/1000 characters
                    </p>
                </div>
                <button type="submit" className="submit-button">Send Message</button>
            </form>
        </div>
    );
}

ReactDOM.render(<Form />, document.getElementById('root'));
