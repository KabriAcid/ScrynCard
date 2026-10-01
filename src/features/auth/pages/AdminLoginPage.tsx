import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Shield, KeyRound, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { MOCK_ADMIN_CREDENTIALS } from "@/lib/mock/credentials";

export default function AdminLoginPage() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { login } = useAuthStore();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			setIsLoading(true);
			const normalizedEmail = email.trim().toLowerCase();
			if (
				normalizedEmail !== MOCK_ADMIN_CREDENTIALS.email ||
				password !== MOCK_ADMIN_CREDENTIALS.password
			) {
				throw new Error("Invalid admin email or password.");
			}
			await login(normalizedEmail, password);
			toast({
				title: "Admin Access Granted",
				description: "Redirecting to admin dashboard...",
			});
			setTimeout(() => navigate("/admin"), 500);
		} catch (err: any) {
			setError(err.message || "Login failed");
			toast({
				variant: "destructive",
				title: "Login Failed",
				description: err.message || "An error occurred",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
			<div className="w-full max-w-md space-y-6">
				<div className="space-y-2 text-center">
					<div className="flex justify-center">
						<Logo />
					</div>
					<h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
					<p className="text-muted-foreground">
						Super admin access to Scryncard platform
					</p>
				</div>
				<Card className="border-2 shadow-2xl">
					<CardHeader className="p-3 text-center">
						<CardTitle className="sr-only">Admin sign in</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
							<div className="space-y-2">
								<Label htmlFor="email">Admin Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										autoComplete="username"
										required
										placeholder="admin@scryncard.com"
										className="pl-10"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={isLoading}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="password"
										type="password"
										autoComplete="current-password"
										required
										className="pl-10"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={isLoading}
									/>
								</div>
							</div>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing In...
									</>
								) : (
									<>
										<Shield className="mr-2 h-4 w-4" />
										Sign In as Admin
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
				<p className="text-center text-xs text-muted-foreground">
					Admin access is restricted. Unauthorized access is monitored.
				</p>
			</div>
		</div>
	);
}
