import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-9xl font-bold text-primary">404</h1>
    <p className="text-2xl mb-8">Page Not Found</p>
    <Link to="/"><Button>Home</Button></Link>
  </div>
);
export default NotFound;
