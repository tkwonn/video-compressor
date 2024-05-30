import React from 'react';
import Compressor from './Compressor';
import Converter from './Converter';

interface MainContentProps {
  activeComponent: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeComponent }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Converter':
        return <Converter />;
      case 'Compressor':
        return <Compressor />;
      default:
        return <div>Select a component</div>;
    }
  };

  return (
    <div className='flex flex-grow h-screen bg-indigo-50'>
      <div className="w-full h-full flex flex-1 p-8">
        {renderComponent()}
      </div>
    </div>
  );
};

export default MainContent;