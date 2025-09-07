import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Card } from "primereact/card";
import { useAuth } from "../hooks";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card title="Login" className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {login.isError && (
            <Message
              severity="error"
              text="Invalid email or password"
              className="w-full !mb-4"
            />
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              feedback={false}
              toggleMask
              required
            />
          </div>

          <Button
            type="submit"
            label="Login"
            className="w-full"
            loading={login.isPending}
            disabled={login.isPending || !email || !password}
          />
        </form>
      </Card>
    </div>
  );
}
