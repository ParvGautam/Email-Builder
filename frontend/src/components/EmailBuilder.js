import React, { useRef, useState, useEffect } from "react";
import EmailEditor from "react-email-editor";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { Loader2, Save, Download, RefreshCcw } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

// Define API_BASE_URL at the top of the file
const API_BASE_URL = "https://email-builder-backend-1xwm.onrender.com"; // Change this to your backend URL as needed

const EmailBuilder = () => {
    const emailEditorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadLastTemplate();
    }, []);

    const loadLastTemplate = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/getEmailLayout`);
            if (response.data && response.data.design) {
                const unlayer = emailEditorRef.current?.editor;
                if (unlayer) {
                    unlayer.loadDesign(response.data.design);
                    setCurrentTemplate(response.data);
                    toast.success("Last template loaded successfully!");
                }
            }
        } catch (error) {
            console.error('Error loading last template:', error);
            toast.error("Failed to load last template.");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/uploadImage`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Image upload failed!");
            return null;
        }
    };

    const saveTemplate = async () => {
        if (!emailEditorRef.current) {
            toast.error("Editor not ready");
            return;
        }

        setLoading(true);
        const unlayer = emailEditorRef.current.editor;

        try {
            const design = await new Promise((resolve) => {
                unlayer.saveDesign((design) => resolve(design));
            });

            const { html } = await new Promise((resolve) => {
                unlayer.exportHtml((data) => resolve(data));
            });

            const templateName = currentTemplate?.name || "Untitled Template";

            const response = await axios.post(`${API_BASE_URL}/uploadEmailConfig`, {
                design,
                html,
                name: templateName,
                _id: currentTemplate?._id
            });

            setCurrentTemplate(response.data.template);
            toast.success("Template saved successfully!");
        } catch (error) {
            console.error("Error saving template:", error);
            toast.error("Failed to save template");
        } finally {
            setLoading(false);
        }
    };

    const exportHtml = () => {
        if (!emailEditorRef.current) {
            toast.error("Editor not ready");
            return;
        }

        setLoading(true);
        const unlayer = emailEditorRef.current.editor;

        unlayer.exportHtml(async (data) => {
            try {
                const { html } = data;
                const response = await axios.post(
                    `${API_BASE_URL}/renderAndDownloadTemplate`, 
                    { html },
                    { responseType: 'blob' }
                );

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'email-template.html');
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success("Template exported successfully!");
            } catch (error) {
                console.error("Error exporting template:", error);
                toast.error("Failed to export template");
            } finally {
                setLoading(false);
            }
        });
    };

    const onReady = () => {
        const unlayer = emailEditorRef.current.editor;
        unlayer.addEventListener('image:added', async (data) => {
            if (data.file) {
                const imageUrl = await handleUploadImage(data.file);
                if (imageUrl) {
                    unlayer.setImage(data.uuid, { src: imageUrl });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 to-indigo-100">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Email Builder</h1>
                        <div className="flex space-x-4">
                            <button 
                                onClick={loadLastTemplate}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 flex items-center"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <RefreshCcw className="h-5 w-5 mr-2" />}
                                {loading ? 'Loading...' : 'Load Template'}
                            </button>
                            <button 
                                onClick={saveTemplate}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 flex items-center"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="h-5 w-5 mr-2" />}
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button 
                                onClick={exportHtml}
                                disabled={loading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 flex items-center"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Download className="h-5 w-5 mr-2" />}
                                {loading ? 'Exporting...' : 'Export'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ height: "calc(100vh - 120px)", overflow: "hidden" }}>
                    <EmailEditor
                        ref={emailEditorRef}
                        onReady={onReady}
                        minHeight="100%" // Ensure the editor takes up the full height of the container
                        options={{
                            customCSS: [
                                'https://fonts.googleapis.com/css?family=Roboto'
                            ],
                            features: {
                                textEditor: {
                                    enabled: true,
                                    fontSize: true,
                                    fontFamily: true,
                                    fontWeight: true,
                                    alignment: true,
                                    color: true,
                                    lineHeight: true,
                                    padding: true,
                                    hyperlink: true,
                                    lists: true,
                                },
                            },
                            tools: {
                                image: {
                                    enabled: true,
                                    properties: {
                                        src: { value: '' },
                                    },
                                },
                            },
                            appearance: {
                                theme: 'light',
                                panels: {
                                    tools: { dock: 'left' },
                                },
                            },
                        }}
                    />
                </div>
            </main>

            <ToastContainer 
                position={isMobile ? "bottom-center" : "bottom-right"}
                className={isMobile ? "mb-20" : ""}
            />
        </div>
    );
};

export default EmailBuilder;
