import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, CircularProgress, Stack, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Post from '../components/post';
import type { PostType } from '../types/post';
import CategoryFilter from '../components/CategoryFilter';
import { CATEGORIES } from '../constants/categories';
import postService from '../services/postService';
import SmartSearchBar from '../components/SmartSearchBar';

import { useNavigate } from 'react-router-dom';

const PostPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearch, setIsAiSearch] = useState(false);

  // State for the filter. Default to the first category.
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial load or when category/search changes
  useEffect(() => {
    // If it's an AI search, we don't paginate
    if (isAiSearch) return;

    const fetchPosts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await postService.getAllPosts(searchQuery, selectedCategory, page, 5);
        
        if (page === 1) {
          setPosts(data.posts);
        } else {
          // Append new posts avoiding duplicates (just in case)
          setPosts(prev => {
            const existingIds = new Set(prev.map(p => p._id));
            const newPosts = data.posts.filter(p => !existingIds.has(p._id));
            return [...prev, ...newPosts];
          });
        }
        
        setHasMore(page < data.totalPages);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchPosts();
  }, [page, selectedCategory, searchQuery, isAiSearch]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory && !isAiSearch && !searchQuery) return;
    setIsAiSearch(false);
    setSearchQuery('');
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
  };

  // Regular search
  const handleSearch = (query: string) => {
    setIsAiSearch(false);
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
  };

  // AI Search (Not paginated right now since the prompt returns a fixed query to Mongo, but handles large dumps usually)
  const handleAISearch = async (query: string) => {
    if (!query) return handleSearch('');
    
    setIsAiSearch(true);
    setLoading(true);
    try {
      const data = await postService.aiSearch(query);
      setPosts(data);
      setHasMore(false); // Disable infinite scroll for AI results
    } catch (err) {
      console.error("AI Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && !isAiSearch) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasMore, loading, loadingMore, isAiSearch]);


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
            <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={handleCategoryChange} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/addReview')}
            startIcon={<EditIcon />}
            sx={{ bgcolor: '#004d40', borderRadius: '24px', px: 3, py: 1, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#00332c' }, boxShadow: '0 4px 14px 0 rgba(0, 77, 64, 0.39)' }}
          >
            Write a Review
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#004d40' }} />
          </Box>
        ) : (
          <Stack spacing={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
            {posts.length === 0 ? (
              <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                No reviews found. Be the first to add one!
              </Typography>
            ) : (
              posts.map(post => (
                <Post key={post._id} post={post} />
              ))
            )}
            
            {/* Observer Element */}
            {hasMore && !isAiSearch && (
              <Box ref={observerTarget} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                {loadingMore && <CircularProgress size={30} sx={{ color: '#004d40' }} />}
              </Box>
            )}
            {!hasMore && posts.length > 0 && !isAiSearch && (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ pb: 4 }}>
                You've reached the end!
              </Typography>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default PostPage;