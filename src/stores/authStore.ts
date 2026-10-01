import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/lib/mockTypes";
import { MOCK_ADMIN_CREDENTIALS } from "@/lib/mock/credentials";

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	register: (data: any) => Promise<void>;
	setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isLoading: false,
			error: null,

			login: async (email: string, password: string) => {
				set({ isLoading: true, error: null });
				try {
					// Simulate API call
					await new Promise((resolve) => setTimeout(resolve, 1000));

					const normalizedEmail = email.trim().toLowerCase();
					const isAdmin = normalizedEmail.includes("admin");
					if (
						isAdmin &&
						(normalizedEmail !== MOCK_ADMIN_CREDENTIALS.email ||
							password !== MOCK_ADMIN_CREDENTIALS.password)
					) {
						throw new Error("Invalid admin email or password.");
					}

					const role: UserRole = isAdmin ? "admin" : "politician";

					const mockUser: User = {
						id: `USER-${Math.random().toString(36).substr(2, 9)}`,
						fullName: normalizedEmail.split("@")[0],
						email: normalizedEmail,
						phone: "+2348012345678",
						role,
						verified: true,
						createdAt: new Date().toISOString(),
					};

					set({
						user: mockUser,
						token: "mock-jwt-token-" + Math.random().toString(36).substr(2),
						isLoading: false,
					});
				} catch (error: any) {
					set({ error: error.message, isLoading: false });
					throw error;
				}
			},

			register: async (data: any) => {
				set({ isLoading: true, error: null });
				try {
					await new Promise((resolve) => setTimeout(resolve, 1000));
					// Default role should be "politician" if registering through normal flow
					const role = data.role || "politician";
					if (!["admin", "politician"].includes(role)) {
						throw new Error("Invalid role");
					}

					const mockUser: User = {
						id: `USER-${Math.random().toString(36).substr(2, 9)}`,
						fullName: data.fullName,
						email: data.email,
						phone: data.phone,
						role: role as UserRole,
						verified: false,
						createdAt: new Date().toISOString(),
					};
					set({
						user: mockUser,
						token: "mock-jwt-token-" + Math.random().toString(36).substr(2),
						isLoading: false,
					});
				} catch (error: any) {
					set({ error: error.message, isLoading: false });
				}
			},

			logout: () => {
				set({ user: null, token: null, error: null });
			},

			setUser: (user) => {
				set({ user });
			},
		}),
		{
			name: "auth-storage",
			partialCursor: true,
		},
	),
);
