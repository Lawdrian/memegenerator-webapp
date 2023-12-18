
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundComponent(){
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Die angeforderte Seite wurde nicht gefunden.</p>
      <Link to = "/">
          <button> Zurück </button>
      </Link>
    </div>
  );
};

