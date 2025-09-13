export const formatTimeAgo = (timestamp: number | bigint): string => {
  const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  const date = new Date(timestampNumber / 1000000); // Convert from nanoseconds to milliseconds
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const formatDate = (timestamp: number | bigint): string => {
  const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  const date = new Date(timestampNumber / 1000000); // Convert from nanoseconds to milliseconds
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long' 
  };
  
  return date.toLocaleDateString('en-US', options);
};
