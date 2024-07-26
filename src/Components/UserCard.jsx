import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Sheet from '@mui/joy/Sheet';
import { Box, Button, CardContent, Typography, Card } from '@mui/material';

export default function UserCard() {
    return (
        <Box
            sx={{
                width: '100%',
                position: 'relative',
                overflow: { xs: 'auto', sm: 'initial' },
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                <AspectRatio ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <CardContent>
                    <Typography variant="h6" fontWeight="lg">
                        Alex Morrison
                    </Typography>
                    <Typography variant="body2" fontWeight="lg" color="text.secondary">
                        Senior Journalist
                    </Typography>
                    <Sheet
                        sx={{
                            bgcolor: 'background.level1',
                            borderRadius: 'sm',
                            p: 1.5,
                            my: 1.5,
                            display: 'flex',
                            gap: 2,
                            '& > div': { flex: 1 },
                        }}
                    >
                        <div>
                            <Typography variant="caption" fontWeight="lg">
                                Articles
                            </Typography>
                            <Typography fontWeight="lg">34</Typography>
                        </div>
                        <div>
                            <Typography variant="caption" fontWeight="lg">
                                Followers
                            </Typography>
                            <Typography fontWeight="lg">980</Typography>
                        </div>
                        <div>
                            <Typography variant="caption" fontWeight="lg">
                                Rating
                            </Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                        </div>
                    </Sheet>
                    <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                        <Button variant="outlined" color="neutral">
                            Chat
                        </Button>
                        <Button variant="contained" color="primary">
                            Follow
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
