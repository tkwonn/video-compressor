import { sidebarItems } from "../constants";

type SidebarProps = {
  activeComponent: string,
  setActiveComponent: (component: string) => void
}

const Sidebar = ({ activeComponent, setActiveComponent }: SidebarProps) => {
  return (
    <div className="w-48 h-screen bg-gray-200 py-10">
      {sidebarItems.map((item) => (
        <div key={item.name} className="flex justify-center">
          <div 
            className={`w-3/4 flex items-center p-2 rounded-lg cursor-pointer ${activeComponent == item.name ? 'bg-white' : 'hover:bg-gray-100' }`} 
            onClick={() => setActiveComponent(item.name)}>
              <item.icon className="w-6 h-6 mr-2" />
              <span>{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;