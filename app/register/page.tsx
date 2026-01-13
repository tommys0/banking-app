"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (newUser: any) => {
      return api.post("users", newUser);
    },
    onSuccess: () => {
      alert("Registration successful! sending to login...");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      alert("Error: " + error.message);
    },
  });

  const handleRegister = () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    mutation.mutate({ username, password });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Register</h1>
        {/* Registration form will go here */}
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <Button
            onClick={handleRegister}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </Button>

          {mutation.isError && (
            <div className="text-red-500 text-sm">
              Something went wrong. Try again.
            </div>
          )}
        </div>
      </div>
    </>
  );
}