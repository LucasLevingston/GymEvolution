import { Button } from '@/components/ui/button';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet title="Not Found" />
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404 Page Not Found
          </h1>
          <p className="text-gray-500">
            Sorry, we couldn&#x27;t find the page you&#x27;re looking for.
          </p>
        </div>
        <Button onClick={() => navigate('/')} className="p-5">
          Return to website
        </Button>
      </div>
    </>
  );
};

export default NotFound;
