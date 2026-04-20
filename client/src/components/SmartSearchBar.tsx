import React, { useState } from 'react';
import { Paper, InputBase, Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';

interface SmartSearchBarProps {
    onSearch: (query: string) => void;
    onAISearch: (query: string) => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onSearch, onAISearch }) => {
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'regular' | 'ai'>('regular');

    const handleSearch = () => {
        if (searchMode === 'ai') {
            onAISearch(query);
        } else {
            onSearch(query);
        }
    };

    const handleModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newMode: 'regular' | 'ai' | null
    ) => {
        if (newMode !== null && newMode !== searchMode) {
            setSearchMode(newMode);
            setQuery(''); // Clear input
            onSearch(''); // Reset parent state
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ToggleButtonGroup
                    value={searchMode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                    sx={{
                        bgcolor: '#fff',
                        '& .Mui-selected': {
                            bgcolor: '#004d40 !important',
                            color: '#fff !important',

                        },
                        borderRadius: '10px',
                    }}
                >
                    <ToggleButton value="regular" sx={{ px: 3, fontWeight: 'bold', textTransform: 'none', borderRadius: '10px' }}>
                        Regular Search
                    </ToggleButton>
                    <ToggleButton value="ai" sx={{ px: 3, fontWeight: 'bold', textTransform: 'none', borderRadius: '10px' }}>
                        <AutoAwesomeIcon sx={{ fontSize: 18, mr: 1 }} />
                        Smart AI
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: '4px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '24px',
                    border: '1px solid #e0e0e0',
                    bgcolor: '#fff',
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
                    placeholder={searchMode === 'regular' ? "Search restaurant by name or city..." : "Describe exactly what you're craving..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                />

                <Box sx={{ display: 'flex', gap: 1, p: '4px', alignItems: 'center' }}>
                    <Button
                        variant={searchMode === 'ai' ? "contained" : "text"}
                        onClick={handleSearch}
                        startIcon={searchMode === 'ai' ? <AutoAwesomeIcon /> : <SearchIcon />}
                        sx={{
                            bgcolor: searchMode === 'ai' ? '#004d40' : 'transparent',
                            color: searchMode === 'ai' ? 'white' : '#004d40',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: '20px',
                            px: 2,
                            '&:hover': { bgcolor: searchMode === 'ai' ? '#00332c' : 'rgba(0,0,0,0.05)' }
                        }}
                    >
                        {searchMode === 'ai' ? 'Generate' : 'Search'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SmartSearchBar;