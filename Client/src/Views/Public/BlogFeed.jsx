import { blogPosts } from './Constant'; 
import {
  Container, Typography, Accordion, AccordionSummary, AccordionDetails,
  Box, Card, CardContent, Grid, Button, List, ListItem, ListItemText, Divider, Alert
} from "@mui/material";
import FeedIcon from '@mui/icons-material/Feed';
import DateRangeIcon from '@mui/icons-material/DateRange';
const BlogFeed = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={5}>
        <FeedIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          Just Buy Blog Feed
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Behind the scenes of rapid delivery, logistics, and community news.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {blogPosts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="overline" color="text.secondary" component="div">
                  {post.category}
                </Typography>
                <Typography variant="h6" component="div" fontWeight={600} gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.summary}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled', fontSize: '0.8rem' }}>
                    <DateRangeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    {post.date}
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                {/* In a real app, this would be a react-router Link */}
                <Button variant="contained" color="primary" fullWidth size="small">
                  Read Article
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogFeed;
