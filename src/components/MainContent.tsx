import Compressor from './Compressor';
import Converter from './Converter';
import VideoEditor from './VideoEditor';

const MainContent = ({ activeComponent }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Compressor':
        return <Compressor />;
      case 'Converter':
        return <Converter />;
      case 'Video Editor':
        return <VideoEditor />;
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