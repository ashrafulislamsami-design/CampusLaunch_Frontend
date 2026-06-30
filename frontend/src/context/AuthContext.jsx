import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [userTeamId, setUserTeamId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Ref to track if we've already fetched data for the current token to prevent loops
  const lastFetchedToken = useRef(null);

  // Fetch unread notification count
  const refreshUnreadCount = async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newCount = res.data.count || 0;
      setUnreadCount(newCount);
      return newCount;
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      return null;
    }
  };

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('token', idToken);
          setIsAuthenticated(true);

          // Only fetch if this is a new token session
          if (lastFetchedToken.current !== idToken) {
            // Fetch User details
            const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: { 'Authorization': `Bearer ${idToken}` }
            });
            const userData = await userRes.json();
            if (userData && !userData.message) setUser(userData);

            // Fetch user's team
            const teamRes = await fetch(`${API_BASE_URL}/teams/user/me`, {
              headers: { 'Authorization': `Bearer ${idToken}` }
            });
            const teamData = await teamRes.json();
            if (teamData && teamData.length > 0) {
              setUserTeamId(teamData[0]._id);
            } else {
              setUserTeamId(null);
            }

            // Fetch unread notification count
            await refreshUnreadCount();

            lastFetchedToken.current = idToken;
          }
        } catch (err) {
          console.error('Error synchronizing Firebase user with backend:', err);
        }
      } else {
        // No Firebase user, but check if there's a local mock/test token (fallback for dev testing)
        const localToken = localStorage.getItem('token');
        if (localToken && (localToken.startsWith('mock_test_token_') || localToken.length < 200)) {
          setToken(localToken);
          setIsAuthenticated(true);

          if (lastFetchedToken.current !== localToken) {
            try {
              const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${localToken}` }
              });
              const userData = await userRes.json();
              if (userData && !userData.message) setUser(userData);

              const teamRes = await fetch(`${API_BASE_URL}/teams/user/me`, {
                headers: { 'Authorization': `Bearer ${localToken}` }
              });
              const teamData = await teamRes.json();
              if (teamData && teamData.length > 0) {
                setUserTeamId(teamData[0]._id);
              } else {
                setUserTeamId(null);
              }

              await refreshUnreadCount();
              lastFetchedToken.current = localToken;
            } catch (err) {
              console.error('Error fetching mock user details:', err);
            }
          }
        } else {
          setToken(null);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserTeamId(null);
          setUser(null);
          setUnreadCount(0);
          lastFetchedToken.current = null;
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserTeamId(null);
    setUser(null);
    setUnreadCount(0);
    lastFetchedToken.current = null;
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userTeamId, setUserTeamId, user, setUser, login, logout, loading, unreadCount, setUnreadCount, refreshUnreadCount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};