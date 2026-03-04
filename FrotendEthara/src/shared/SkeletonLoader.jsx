import { Skeleton, Box } from '@mui/material';

const SkeletonLoader = ({ type = 'list', count = 5 }) => {
  if (type === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width="60%" animation="wave" />
              <Skeleton variant="text" width="40%" animation="wave" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (type === 'table') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', mb: 1 }}>
            <Skeleton variant="rectangular" width="20%" height={40} animation="wave" sx={{ mr: 1 }} />
            <Skeleton variant="rectangular" width="30%" height={40} animation="wave" sx={{ mr: 1 }} />
            <Skeleton variant="rectangular" width="25%" height={40} animation="wave" sx={{ mr: 1 }} />
            <Skeleton variant="rectangular" width="25%" height={40} animation="wave" />
          </Box>
        ))}
      </Box>
    );
  }

  // Default rectangular
  return <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />;
};

export default SkeletonLoader;
