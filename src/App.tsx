import React from 'react';

const App: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className='App'>
      <h1>{title}</h1>
    </div>
  );
};

App.defaultProps = { title: undefined };
export default App;
