import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- Assets ---

const Table = (props: any) => {
    return (
        <group {...props}>
            {/* Table Top */}
            <mesh receiveShadow castShadow position={[0, 0.75, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 0.1, 64]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Table Base */}
            <mesh receiveShadow castShadow position={[0, 0.375, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 0.75, 32]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Table Base Plate */}
            <mesh receiveShadow castShadow position={[0, 0.025, 0]}>
                <cylinderGeometry args={[1, 1, 0.05, 32]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
        </group>
    );
};

const Chair = ({ position, rotation, color = "#475569" }: { position: [number, number, number], rotation: [number, number, number], color?: string }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.6, 0.1, 0.6]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.9, -0.25]} castShadow>
                <boxGeometry args={[0.6, 0.7, 0.1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            <mesh position={[0.25, 0.25, 0.25]}>
                <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[-0.25, 0.25, 0.25]}>
                <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0.25, 0.25, -0.25]}>
                <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[-0.25, 0.25, -0.25]}>
                <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
        </group>
    );
};

const Avatar = ({ position, rotation, color = "#3b82f6", name = "User", isSpeaking = false }: { position: [number, number, number], rotation: [number, number, number], color?: string, name?: string, isSpeaking?: boolean }) => {
    const group = useRef<THREE.Group>(null);

    // Subtle breathing animation
    useFrame((state) => {
        if (group.current) {
            // Breathing
            const breath = Math.sin(state.clock.elapsedTime * 2) * 0.005;
            group.current.position.y = position[1] + breath;

            // Speaking bounce
            if (isSpeaking) {
                group.current.position.y += Math.sin(state.clock.elapsedTime * 15) * 0.01 + 0.01;
            }
        }
    });

    const skinColor = "#e0ac69";
    const pantsColor = "#1e293b";

    return (
        <group ref={group} position={position} rotation={rotation}>
            <group position={[0, 0.85, 0]}> {/* Seating Offset */}

                {/* Head */}
                <mesh position={[0, 0.7, 0]} castShadow>
                    <boxGeometry args={[0.22, 0.25, 0.25]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>

                {/* Neck */}
                <mesh position={[0, 0.55, 0]} castShadow>
                    <cylinderGeometry args={[0.06, 0.06, 0.1]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>

                {/* Torso */}
                <mesh position={[0, 0.25, 0]} castShadow>
                    <boxGeometry args={[0.35, 0.5, 0.2]} />
                    <meshStandardMaterial color={color} />
                </mesh>

                {/* Right Arm (Resting on table/lap) */}
                <group position={[0.22, 0.45, 0]}>
                    <mesh position={[0.05, -0.2, 0]} rotation={[0, 0, -0.1]}>
                        <boxGeometry args={[0.1, 0.4, 0.1]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[0.1, -0.4, 0.15]} rotation={[-0.5, 0, -0.2]}> {/* Forearm */}
                        <boxGeometry args={[0.09, 0.35, 0.09]} />
                        <meshStandardMaterial color={skinColor} />
                    </mesh>
                </group>

                {/* Left Arm */}
                <group position={[-0.22, 0.45, 0]}>
                    <mesh position={[-0.05, -0.2, 0]} rotation={[0, 0, 0.1]}>
                        <boxGeometry args={[0.1, 0.4, 0.1]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[-0.1, -0.4, 0.15]} rotation={[-0.5, 0, 0.2]}> {/* Forearm */}
                        <boxGeometry args={[0.09, 0.35, 0.09]} />
                        <meshStandardMaterial color={skinColor} />
                    </mesh>
                </group>

                {/* Legs (Sitting) */}
                <group position={[0, 0, 0]}>
                    {/* Right Leg */}
                    <mesh position={[0.1, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0.1]}> {/* Thigh */}
                        <boxGeometry args={[0.14, 0.45, 0.14]} />
                        <meshStandardMaterial color={pantsColor} />
                    </mesh>
                    <mesh position={[0.13, -0.25, 0.4]} rotation={[0, 0, 0.1]}> {/* Shin */}
                        <boxGeometry args={[0.12, 0.45, 0.12]} />
                        <meshStandardMaterial color={pantsColor} />
                    </mesh>

                    {/* Left Leg */}
                    <mesh position={[-0.1, 0, 0.2]} rotation={[-Math.PI / 2, 0, -0.1]}> {/* Thigh */}
                        <boxGeometry args={[0.14, 0.45, 0.14]} />
                        <meshStandardMaterial color={pantsColor} />
                    </mesh>
                    <mesh position={[-0.13, -0.25, 0.4]} rotation={[0, 0, -0.1]}> {/* Shin */}
                        <boxGeometry args={[0.12, 0.45, 0.12]} />
                        <meshStandardMaterial color={pantsColor} />
                    </mesh>
                </group>

            </group>

            {/* Name Tag */}
            <Text
                position={[0, 1.8, 0]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineColor="black"
                outlineWidth={0.02}
                font="/fonts/Inter-Bold.ttf" // Fallback to default if load fails
            >
                {name}
            </Text>

            {/* Speaking Indicator */}
            {isSpeaking && (
                <mesh position={[0, 2.1, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.1, 0.2, 32]} />
                    <meshBasicMaterial color="#ef4444" />
                </mesh>
            )}
        </group>
    );
};

const Scene = () => {
    // 5 People configuration
    const avatars = [
        { id: 1, name: "You", position: [0, 0, 2], rotation: [0, 0, 0], color: "#3b82f6", isUser: true },
        { id: 2, name: "AI Agent 1", position: [1.9, 0, 0.6], rotation: [0, -2, 0], color: "#ef4444", isSpeaking: true },
        { id: 3, name: "AI Agent 2", position: [1.2, 0, -1.6], rotation: [0, -3.5, 0], color: "#22c55e" },
        { id: 4, name: "AI Agent 3", position: [-1.2, 0, -1.6], rotation: [0, 3.5, 0], color: "#eab308" },
        { id: 5, name: "AI Agent 4", position: [-1.9, 0, 0.6], rotation: [0, 2, 0], color: "#a855f7" },
    ];

    return (
        <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }}>
            <color attach="background" args={['#0f172a']} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
            <directionalLight position={[0, 10, 5]} intensity={0.5} />

            {/* Room Content */}
            <Table position={[0, -1, 0]} />

            {avatars.map((avatar) => (
                <group key={avatar.id}>
                    <Chair position={[avatar.position[0] * 1.3, -1, avatar.position[2] * 1.3]} rotation={[0, (avatar.rotation[1] as number) + Math.PI, 0] as any} />
                    <Avatar
                        name={avatar.name}
                        position={[avatar.position[0], -1, avatar.position[2]] as any}
                        rotation={avatar.rotation as any}
                        color={avatar.color}
                        isSpeaking={avatar.isSpeaking}
                    />
                </group>
            ))}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
            <ContactShadows opacity={0.4} scale={30} blur={2} far={4} />
        </Canvas>
    );
};

export default Scene;
