import './App.css';
import { useState } from 'react';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

export const App = () => {
    const [activeComponent, setActiveComponent] = useState('Compressor');

    return (
        <div className="flex">
            <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            <MainContent activeComponent={activeComponent} />
        </div>
    );
};