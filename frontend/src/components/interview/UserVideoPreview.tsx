import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Proper cleanup for webcam
export default function UserVideoPreview({ isVideoOn }: { isVideoOn: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let isMounted = true;

        const startCamera = async () => {
            // If already have a stream, don't request again
            if (streamRef.current) return;

            if (isVideoOn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                    if (!isMounted) {
                        // Immediately stop if component unmounted while waiting
                        stream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    streamRef.current = stream;

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        // Play only if not already playing
                        if (videoRef.current.paused) {
                            videoRef.current.play().catch(() => { }); // suppress play interruption errors
                        }
                    }
                } catch (err) {
                    console.error("Camera access error:", err);
                    // Only show toast if it's a real permission/device error, not just an interruption
                    if (isMounted) {
                        toast.error("Could not access camera. Please check permissions.");
                    }
                }
            }
        };

        if (isVideoOn) {
            startCamera();
        } else {
            // If video turned off, stop tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
        }

        return () => {
            isMounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [isVideoOn]);

    return (
        <video
            ref={videoRef}
            className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
            muted
            playsInline
        />
    );
}
