import React from 'react';

const App: React.FC<{ title: string }> = ({ title }) => {
  const ref1 = React.useRef<HTMLElement>(null);
  console.log(ref1);
  return (
    <div className='App'>
      <h1>{title}</h1>
    </div>
  );
};

App.defaultProps = { title: undefined };
export default App;
