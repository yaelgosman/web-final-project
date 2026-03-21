import React, { useState, useEffect } from 'react';
import { Container, Stack, Box, Typography, CircularProgress, Grid, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Post from '../components/post';
import type { PostType } from '../types/post';
import Navbar from '../components/Navbar';
import { CATEGORIES } from '../constants/categories';
import postService from '../services/postService';
import SmartSearchBar from '../components/SmartSearchBar';

import { useNavigate } from 'react-router-dom';

// --- Mock Data Service (Simulating an API fetch) ---
const fetchPosts = (): Promise<PostType[]> => {
  return postService.getAllPosts();
}

const PostPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  // State for the filter. Default to the first category.
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);

  const handleSelectedCategory = (id: string) => {
    setSelectedCategory(id);
    console.log('Changed category!');
  }

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await postService.getAllPosts(query);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async (query: string) => {
    if (!query) return handleSearch('');
    setLoading(true);
    try {
      const data = await postService.aiSearch(query);
      setPosts(data);
    } catch (err) {
      console.error("AI Search failed", err);
    } finally {
      setLoading(false);
    }
  };

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


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress sx={{ color: '#004d40' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fdfbf7', minHeight: '100vh', pb: 8 }}>

      <Box sx={{ bgcolor: '#fff', pt: 4, pb: 2, borderBottom: '1px solid #eee' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{
            textAlign: 'center',
            fontFamily: 'serif',
            fontWeight: 900,
            mb: 3,
            color: '#2c3e50'
          }}>
            What are we eating today?
          </Typography>

          <SmartSearchBar
            onSearch={handleSearch}
            onAISearch={handleAISearch}
          />

          <Box sx={{ mt: 3 }}>
            <Navbar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>

          <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/addReview')}
                startIcon={<EditIcon />}
                sx={{ bgcolor: '#004d40', borderRadius: '24px', px: 3, py: 1, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#00332c' } }}
              >
                Write a Review
              </Button>
            </Box>

            <Stack spacing={4}>
              {posts.map(post => <Post key={post._id} post={post} />)}
            </Stack>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PostPage;