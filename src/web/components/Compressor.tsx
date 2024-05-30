import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

const Compressor: React.FC = () => (
    <div className="flex-grow bg-white rounded-lg">

        {/* Top Section */}
        <div className="flex items-center p-6">
            <NoteAddOutlinedIcon className="w-6 h-6 mr-1" />
            <span className="text-sm">Add file</span>
        </div>

        {/* Drag-n-drop Section */}
        <div className='h-96 flex justify-center items-center border-y border-gray-200'>
            <div className="p-10 bg-gray-100 border-2 border-dashed border-gray-300 rounded">
                <div className="flex flex-col items-center">
                    <CloudUploadOutlinedIcon className="w-12 h-12 mb-2" />
                    <p>Add or drag files here to start compression.</p>
                </div>
                <hr className="my-6" />
                <div className="text-sm font-normal flex justify-center items-center">
                    <dl>
                        <div className="flex">
                            <dt className="w-16">Step 1:</dt>
                            <dd>Add or drag files here to start compression.</dd>
                        </div>
                        <div className="flex">
                            <dt className="w-16">Step 2:</dt>
                            <dd>Change file size.</dd>
                        </div>
                        <div className="flex">
                            <dt className="w-16">Step 3:</dt>
                            <dd>Start compressing.</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="px-8 flex justify-between items-center">
            <div className="flex flex-col py-4">
                <div className="mb-4">
                    <label className="text-sm pr-2">File Size:</label>
                    <select className="border rounded-full p-1">
                        <option>70%</option>
                        <option>80%</option>
                        <option>90%</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm pr-2">File Location:</label>
                    <input className="border rounded p-2" type="text" value="Compressed" readOnly />
                </div>
            </div>
            <button className="bg-purple-500 text-white font-bold rounded-full px-8 py-2">Start All</button>
        </div>
    </div>
);

export default Compressor;