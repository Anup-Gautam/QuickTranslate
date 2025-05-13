import React, { useState } from 'react';
import { MessageSquare, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, signup, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, username, password);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MessageSquare className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          QuickChat
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
            
            {!isLogin && (
              <Input
                id="username"
                label="Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                icon={<User className="h-5 w-5 text-gray-400" />}
              />
            )}
            
            <Input
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />
            
            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'New to QuickChat?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={toggleMode}
              >
                {isLogin ? 'Create a new account' : 'Sign in to existing account'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;