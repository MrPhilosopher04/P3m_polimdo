// File: client/src/hooks/useReviews.js
import { useState, useEffect } from 'react';
import { 
  getMahasiswaReviews, 
  getDosenReviews 
} from '../services/reviewService';

export const useReviews = (userRole) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = userRole === 'mahasiswa' 
          ? await getMahasiswaReviews()
          : await getDosenReviews();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  return { reviews, loading };
};