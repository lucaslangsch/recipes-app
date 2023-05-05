import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <label htmlFor="email">
        Email
        <input
          id="email"
          placeholder="email@email.com"
          name="email"
          data-testid="email-input"
          onChange={ ({ target }) => setEmail(target.value) }
          value={ email }
        />
      </label>
      <label htmlFor="password">
        Password
        <input
          id="password"
          name="password"
          data-testid="password-input"
          onChange={ ({ target }) => setPassword(target.value) }
          type="password"
          value={ password }
        />
      </label>
      <button data-testid="login-submit-btn">Enter</button>
    </div>
  );
}
