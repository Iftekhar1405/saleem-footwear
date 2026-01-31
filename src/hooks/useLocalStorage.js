import { useState, useEffect } from "react";

/**
 * useLocalStorage - Custom React hook for managing localStorage with state synchronization
 * 
 * @description
 * This hook provides a way to persist state in localStorage and keep it synchronized
 * across the component lifecycle. It automatically handles JSON serialization/deserialization
 * and dispatches custom events when the value changes.
 * 
 * @param {string} key - The localStorage key to store the value under
 * @param {*} initialValue - The initial value to use if no value exists in localStorage
 * @returns {Array} A tuple containing [storedValue, setStoredValue] similar to useState
 * 
 * @example
 * const [user, setUser] = useLocalStorage('user', null);
 * setUser({ name: 'John', email: 'john@example.com' });
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      window.dispatchEvent(new Event(`${key}-updated`));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
