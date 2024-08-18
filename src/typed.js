import React, { useEffect } from 'react';
import Typed from 'typed.js';

const TypingEffect = () => {
  useEffect(() => {
    // Options for the Typed.js instance
    const options = {
      stringsElement: '#typed-output', // Target the content of the element
      typeSpeed: 50,   // Speed in milliseconds for typing each character
      backSpeed: 25,   // Speed in milliseconds for deleting each character
      loop: true,      // Enable looping
      backDelay: 2000, // Delay before starting to delete the text
      showCursor: true // Show the blinking cursor
    };

    // Initialize Typed.js
    const typed = new Typed('#typed-output', options);

    // Clean up function to destroy the instance on component unmount
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <h1 id="typed-output">Hello, this text will animate!</h1>
    </div>
  );
};

export default TypingEffect;
