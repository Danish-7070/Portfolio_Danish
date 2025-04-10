import Script from 'next/script';

<Script
  src="https://accounts.google.com/gsi/client"
  strategy="lazyOnload"
  onLoad={() => {
    // present the sign in popup
  }}
/>;