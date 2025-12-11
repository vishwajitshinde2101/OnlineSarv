import React, { useState } from 'react';

const LoginSignupForm: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  const commonInputClasses = "w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const commonButtonClasses = "w-full px-4 py-2 mt-4 font-bold text-white rounded-md transition-colors";

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        {isLoginView ? 'Welcome Back!' : 'Create an Account'}
      </h2>

      <form>
        {!isLoginView && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" required className={commonInputClasses} />
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input type="email" required className={commonInputClasses} />
        </div>

        {!isLoginView && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
            <input type="tel" required className={commonInputClasses} />
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input type="password" required className={commonInputClasses} />
        </div>

        {isLoginView && (
          <span className="text-xs text-brand-secondary hover:underline cursor-pointer float-right mt-2">
            Forgot Password?
          </span>
        )}

        <button
          type="submit"
          className={`${commonButtonClasses} bg-brand-primary hover:bg-brand-secondary`}
        >
          {isLoginView ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span
          onClick={toggleView}
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline cursor-pointer"
        >
          {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </span>
      </div>
    </div>
  );
};

export default LoginSignupForm;
