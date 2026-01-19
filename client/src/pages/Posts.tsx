import React, { useState, useEffect } from 'react';
import { Container, Stack, Box, Typography, CircularProgress } from '@mui/material';
import Post from '../components/posts';
import type { PostType } from '../types/post';
import Navbar from '../components/Navbar';
import { CATEGORIES } from '../constants/categories';

// --- Mock Data Service (Simulating an API fetch) ---
const fetchPosts = (): Promise<PostType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
            _id: "post_001",
            userId: "user_999",
            restaurant: {
                name: "Restô Canto",
                city: "Búzios, Brazil"
            },
            rating: 5,
            text: "What could be better than an ocean view and fresh fruit? The grilled octopus is a must-try. Loved the atmosphere!",
            imagePath: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
          _id: "post_03",
          userId: "user_101",
          restaurant: {
            name: "The Witchery by the Castle",
            city: "Edinburgh, United Kingdom"
          },
          rating: 4.2,
          text: "Located in a historic setting with dramatic decor (think gothic), definitely worth a stop. Fresh fish and creative cocktails are the main event, but it's also recommended to save room for dessert. Diners say this is out of this world.",
          imagePath: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder for interior
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "post_04",
          userId: "user_102",
          restaurant: {
            name: "Abrasado",
            city: "Guaymallen, Argentina"
          },
          rating: 4.9,
          text: "Abrasado is a stunning place with outdoor seating. You can't miss the dry-aged steak - it's the brand concept. Excellent cocktails and a great selection of wines. Polite and professional service, which makes the experience even better.",
          imagePath: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder for steak
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    }, 800); // Simulate network delay
  });
};

const PostPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  // State for the filter. Default to the first category.
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);

  const handleSelectedCategory = (id: string) => {
    setSelectedCategory(id);
    console.log('Changed category!');
  }

  useEffect(() => {
    // Fetch data on component mount
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // const displayPosts = posts.filter(post => {
  //     // Example: return post.category === selectedCategory
  //     return true; 
  // });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#004d40' }} />
      </Box>
    );
  }

  return (
    <Box>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'white' }}>
            <Navbar
              selectedCategory={selectedCategory} 
              onSelectCategory={handleSelectedCategory} 
            />
        </Box>

        <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
        <Stack spacing={4}>
          {posts.map((post) => (
             <Box key={post._id} sx={{ position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: -10, right: 0, color: '#999', fontSize: '1rem' }}>
                </Typography>
                <Post post={post} />
             </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default PostPage;