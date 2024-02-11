import React, { useState } from 'react';

const IframeComponent = ({currentUrl}:{currentUrl:string}) => {
//   // Initialize the iframe URL state
//   const [iframeUrl, setIframeUrl] = useState('https://example.com');

//   // Function to update the iframe URL
//   function updateIframe(url:string) {
//     setIframeUrl(url);
//   }

  return (
    <div className="iframeParent" style={{ height: '100%' }}>
        <iframe 
        src={currentUrl} 
        style={{ width: '100%', height: '100%' }} 
        title="Iframe Example"
        ></iframe>
    </div>
  );
};

export default IframeComponent;
