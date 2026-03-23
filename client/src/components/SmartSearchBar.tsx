import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Divider, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // אייקון נצנצים ל-AI

interface SmartSearchBarProps {
    onSearch: (query: string) => void;
    onAISearch: (query: string) => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onSearch, onAISearch }) => {
    const [query, setQuery] = useState('');

    return (
        <Paper
            elevation={0}
            sx={{
                p: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                borderRadius: '24px',
                border: '1px solid #e0e0e0',
                bgcolor: '#fff',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
                placeholder="Search restaurant or 'Spicy pasta in TLV'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
            />

            <IconButton onClick={() => onSearch(query)} sx={{ p: '10px' }}>
                <SearchIcon />
            </IconButton>

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

            <Tooltip title="AI Smart Search">
                <IconButton
                    onClick={() => onAISearch(query)}
                    sx={{
                        p: '10px',
                        color: '#004d40',
                        '&:hover': { color: '#00aa6c' }
                    }}
                >
                    <AutoAwesomeIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    );
};

export default SmartSearchBar;