import './global.css';
import { useState } from 'react';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

const App = () => {
    const [activeComponent, setActiveComponent] = useState('Converter');

    return (
        <div className="flex">
            <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            <MainContent activeComponent={activeComponent} />
        </div>
    );
};

export default App;