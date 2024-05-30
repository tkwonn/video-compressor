import React from 'react';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';

interface SidebarProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeComponent, setActiveComponent }) => {
  
  return (
    <div className="w-48 h-screen bg-gray-200">
      <div className="flex justify-center mt-10 space-y-2">
        <div 
          className={`w-3/4 flex items-center p-2 rounded-lg cursor-pointer ${activeComponent == 'Compressor' ? 'bg-white' : 'hover:bg-gray-100' }`} 
          onClick={() => setActiveComponent('Compressor')}>
            <MovieFilterOutlinedIcon className="w-6 h-6 mr-2" />
            <span>Compressor</span>
        </div>
      </div>
      <div className="flex justify-center">
        <div 
            className={`w-3/4 flex items-center p-2 rounded-lg cursor-pointer ${activeComponent == 'Converter' ? 'bg-white' : 'hover:bg-gray-100' }`} 
            onClick={() => setActiveComponent('Converter')}>
              <DriveFileMoveOutlinedIcon className="w-6 h-6 mr-2" />
              <span>Converter</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;