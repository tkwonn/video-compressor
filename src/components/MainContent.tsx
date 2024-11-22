import Compressor from './Compressor';
import Converter from './Converter';

const MainContent = ({ activeComponent }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Compressor':
        return <Compressor />;
      case 'Converter':
        return <Converter />;
      default:
        return <Compressor />;
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