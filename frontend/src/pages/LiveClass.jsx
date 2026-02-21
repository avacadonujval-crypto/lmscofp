import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API_BASE_URL from '../config/api';
import { Video, Loader2, PlayCircle, StopCircle } from 'lucide-react';

const LiveClass = () => {
    const { meetingId } = useParams();
    const { user } = useContext(AuthContext);
    const { darkMode } = useTheme();
    const jitsiContainerRef = useRef(null);
    const jitsiApiRef = useRef(null);
    const navigate = useNavigate();

    // Browser Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const streamRef = useRef(null);
    const hasAutoSavedRef = useRef(false);

    useEffect(() => {
        if (!user) return;

        const loadJitsiScript = () => {
            if (window.JitsiMeetExternalAPI) {
                startMeeting();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.async = true;
            script.onload = () => startMeeting();
            document.body.appendChild(script);
        };

        loadJitsiScript();

        return () => {
            if (jitsiApiRef.current) {
                jitsiApiRef.current.dispose();
            }
            stopBrowserRecording(false); // Clean up recording on unmount
        };
    }, [user, meetingId]);

    const startBrowserRecording = async () => {
        try {
            console.log("Starting browser recording with MP4 format...");

            // Get the user's own audio/video streams (already granted when joining meeting)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            streamRef.current = stream;
            recordedChunksRef.current = [];

            // Try MP4 format first, fallback to WebM if not supported
            let options = { mimeType: 'video/mp4' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm;codecs=vp9,opus' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options = { mimeType: 'video/webm' };
                }
            }

            console.log("Using recording format:", options.mimeType);

            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                    console.log(`Recorded chunk: ${event.data.size} bytes`);
                }
            };

            mediaRecorder.start(1000); // Collect data every second
            setIsRecording(true);

            // Auto-save the "Pending" metadata to DB
            await autoSaveVideoMetadata();

            console.log("Recording started successfully");

        } catch (err) {
            console.error("Error starting recording:", err);
            // Don't show alert - just log the error and continue with the meeting
            console.log("Recording could not be started, but meeting will continue normally");
        }
    };

    const stopBrowserRecording = () => {
        return new Promise((resolve) => {
            console.log("Stopping recording...");

            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                // Set the onstop handler before stopping
                mediaRecorderRef.current.onstop = () => {
                    console.log("Recording stopped, chunks ready:", recordedChunksRef.current.length);

                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                        streamRef.current = null;
                    }

                    setIsRecording(false);

                    // Reset the auto-save lock for next recording
                    hasAutoSavedRef.current = false;

                    resolve();
                };
                mediaRecorderRef.current.stop();
            } else {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
                setIsRecording(false);
                hasAutoSavedRef.current = false;
                resolve();
            }
        });
    };

    const startMeeting = () => {
        const domain = 'meet.ffmuc.net';

        if (jitsiContainerRef.current) {
            jitsiContainerRef.current.innerHTML = '';
        }

        const options = {
            roomName: `LMS-Live-${meetingId}`,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            userInfo: {
                displayName: `${user.name} (${user.role})`
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                disableDeepLinking: true,
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur', 'help', 'mute-everyone'
                ]
            }
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        jitsiApiRef.current.addEventListeners({
            videoConferenceJoined: () => {
                if (user.role === 'admin' && !isRecording && !mediaRecorderRef.current) {
                    console.log("Admin joined, auto-starting recording immediately...");
                    // Auto-start recording immediately - no delay needed
                    startBrowserRecording();
                }
            },
            videoConferenceLeft: async () => {
                console.log("User left conference");
                await handleHangup();
            }
        });
    };

    const autoSaveVideoMetadata = async () => {
        if (user.role !== 'admin' || hasAutoSavedRef.current) return;
        hasAutoSavedRef.current = true;

        try {
            // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'; // Removed local definition
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/api/admin/save-recording`, {
                title: `Live Session: ${meetingId} (${new Date().toLocaleDateString()})`,
                url: null, // This will trigger "Pending" status on backend
                meetingId: meetingId
            }, config);
            console.log("Recording metadata (Pending) saved.");
        } catch (err) {
            console.error("Failed to auto-save recording metadata:", err);
            hasAutoSavedRef.current = false; // Reset on failure so it can retry
        }
    };

    const uploadRecordedFile = async () => {
        if (recordedChunksRef.current.length === 0) {
            console.error("No recorded chunks available");
            alert("No recording data available. The recording may not have started properly.");
            return false;
        }

        setIsUploading(true);

        try {
            const mimeType = mediaRecorderRef.current?.mimeType || 'video/webm';
            console.log("Creating blob from", recordedChunksRef.current.length, "chunks with type:", mimeType);

            // Determine file extension based on mime type
            let extension = '.webm';
            let finalMimeType = mimeType;

            if (mimeType.includes('mp4')) {
                extension = '.mp4';
                finalMimeType = 'video/mp4';
            }

            const blob = new Blob(recordedChunksRef.current, { type: finalMimeType });
            const fileName = `recording-${meetingId}-${Date.now()}${extension}`;
            const file = new File([blob], fileName, { type: finalMimeType });

            console.log(`Uploading ${(file.size / 1024 / 1024).toFixed(2)} MB as ${file.name}`);

            const formData = new FormData();
            formData.append('video', file);
            formData.append('title', `Live Session: ${meetingId} (${new Date().toLocaleDateString()})`);
            formData.append('meetingId', meetingId);
            formData.append('duration', Math.round(blob.size / 1024 / 1024));

            // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'; // Removed local definition
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                },
                timeout: 300000 // 5 minute timeout for large files
            };

            console.log("Sending upload request to:", `${API_BASE_URL}/api/admin/upload-video`);
            const response = await axios.post(`${API_BASE_URL}/api/admin/upload-video`, formData, config);
            console.log("Recording uploaded successfully:", response.data);

            // Clear the recorded chunks after successful upload
            recordedChunksRef.current = [];

            return true;
        } catch (err) {
            console.error("Failed to upload recording:", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Upload failed: ${errorMsg}. Please check your internet connection and try again.`);
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const handleHangup = async () => {
        if (user.role === 'admin') {
            if (isRecording) {
                await stopBrowserRecording();
                const success = await uploadRecordedFile();
                if (success) {
                    navigate('/recorded-videos');
                } else {
                    alert("Meeting ended, but the recording failed to upload.");
                    navigate('/recorded-videos');
                }
            } else {
                navigate('/recorded-videos');
            }
        } else {
            navigate('/user-meetings');
        }
    };

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Header */}
            <div className="p-4 bg-gray-800 text-white flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold">Live Class: {meetingId}</h1>

                    {user?.role === 'admin' && (
                        <div className="flex items-center gap-4">
                            {isRecording ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-red-500/30">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    Auto-Recording in Progress
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg text-xs font-medium">
                                    <Video size={16} />
                                    Auto-Recording Starting...
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleHangup}
                    className="bg-red-600 px-6 py-2 rounded-xl hover:bg-red-700 font-bold text-sm transition shadow-lg shadow-red-900/20"
                >
                    Leave Class
                </button>
            </div>

            {/* Main View */}
            <div className="flex-1 relative">
                {isUploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[20] flex flex-col items-center justify-center text-white">
                        <Loader2 className="animate-spin text-[#cca466] mb-4" size={48} />
                        <h2 className="text-2xl font-bold mb-2">Uploading Recording...</h2>
                        <p className="text-gray-400">Please do not close this tab until the process is complete.</p>
                    </div>
                )}
                <div ref={jitsiContainerRef} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>
    );
};

export default LiveClass;
