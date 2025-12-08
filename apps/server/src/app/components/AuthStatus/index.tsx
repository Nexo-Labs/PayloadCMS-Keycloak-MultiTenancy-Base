"use client";

import { useState } from "react";

interface AuthStatusProps {
    user: {
        id: string;
        email?: string | null;
        name?: string | null;
    } | null;
    signIn: () => Promise<void>;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({ user, signIn }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        console.log("[AuthStatus] Iniciando logout...");
        setIsLoggingOut(true);

        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("[AuthStatus] Resultado:", result);

            if (result.success && result.logoutUrl) {
                console.log("[AuthStatus] Redirigiendo a Keycloak logout...");
                window.location.href = result.logoutUrl;
            } else {
                console.log("[AuthStatus] Redirigiendo a home...");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("[AuthStatus] Error en logout:", error);
            setIsLoggingOut(false);
            window.location.href = "/";
        }
    };

    if (!user) {
        return (
            <div style={styles.container}>
                <p style={styles.text}>No has iniciado sesión</p>
                <button onClick={() => signIn()} style={styles.button}>
                    Iniciar sesión
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <p style={styles.text}>
                ✅ Conectado como:{" "}
                <strong>{user.email || user.name || user.id}</strong>
            </p>
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                    ...styles.button,
                    ...styles.logoutButton,
                    opacity: isLoggingOut ? 0.7 : 1,
                }}
            >
                {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        marginBottom: "1.5rem",
    },
    text: {
        margin: 0,
        fontSize: "0.95rem",
    },
    button: {
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        fontSize: "0.9rem",
        textDecoration: "none",
        backgroundColor: "#0070f3",
        color: "white",
    },
    logoutButton: {
        backgroundColor: "#dc3545",
    },
};
