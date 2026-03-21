import { useState, useEffect } from "react";
import { PostType } from "../../types/post";
import { UserProfileProps, UserType } from "../../types/user";
import { styles } from './UserProfile.styles';
import { EditProfileModal } from "../../components/EditProfile/EditProfile";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserProfile } from '../../services/profileService';
import { fetchUserById, fetchPostsByUserId } from '../../services/profileService';
import UserPost from "../../components/UserPosts/userPost";
import { getImageUrl } from "../../utils/imageUtils";

export const UserProfile: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id : string }>(); // Gets the :id from the URL
  const { user: loggedInUser } = useAuth(); // Gets the logged-in user from the Auth context
  const [userData, setUserData] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If theres an ID in the URL, use it. else use the logged-in user's ID
  const profileUserId = id || loggedInUser?._id;
  const loggedInUserId = loggedInUser?._id;

  const isOwnProfile = Boolean(profileUserId && loggedInUserId && profileUserId === loggedInUserId);

  // Catch navigation state to open edit modal
  useEffect(() => {
    // Check if the router passed 'editMode: true' AND that it's actually their profile
    if (location.state?.editMode && isOwnProfile) {
      setIsEditModalOpen(true);
      
      // Clear the router state so if the user refreshes the page, the modal doesn't get stuck open
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isOwnProfile]);

  // useEffect(() => {
  //   if (!profileUserId) return; // Wait until we have an ID

  //   const fetchProfileData = async () => {
  //     setIsLoading(true);
  //     setError(null);
      
  //     // Mock data injection matching your types
  //     setUserData({
  //       _id: profileUserId,
  //       username: 'Ofir',
  //       email: 'user@example.com',
  //       provider: 'local',
  //       profileImage: 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg', 
  //       createdAt: new Date().toISOString()
  //     });

  //     setPosts([
  //       { 
  //         _id: '1', 
  //         userId: profileUserId, 
  //         restaurant: { name: 'Trattoria Bella', city: 'Rome' }, 
  //         rating: 5, 
  //         text: 'Best carbonara ever!',
  //         imagePath: 'https://static.toiimg.com/thumb/53784736.cms?imgsize=51659&width=800&height=800',
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString()
  //       },
  //       { 
  //         _id: '2', 
  //         userId: profileUserId, 
  //         restaurant: { name: 'The Grind Cafe', city: 'Tel Aviv' }, 
  //         rating: 4, 
  //         imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRukVq3uaqVuS9RRUzaByz6y1CjWDF485z92Q&s',
  //         text: 'Great espresso, but limited seating.',
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString()
  //       },
  //     ]);
      
  //     setIsLoading(false);
  //   };

  //   fetchProfileData();
  // }, [profileUserId]);

  useEffect(() => {
  if (!profileUserId) return; 

  let isMounted = true;

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use Promise.all to fetch the user and posts at the same time using your Axios service
      const [userDataResult, postsDataResult] = await Promise.all([
        fetchUserById(profileUserId),
        fetchPostsByUserId(profileUserId)
      ]);

      console.log(`user data result: `, userDataResult);

      // Only update state if the component is still mounted
      if (isMounted) {
        setUserData(userDataResult);
        setPosts(postsDataResult);
      }
    } catch (err) {
      if (isMounted) {
        console.error("Error loading profile:", err);
        setError("Could not load profile data.");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  fetchProfileData();

  // Cleanup function to prevent React state update warnings if the user navigates away
  return () => {
    isMounted = false;
  };
}, [profileUserId]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedData: Partial<UserType>) => {
    // Prevent execution if we don't have the user's ID
    if (!userData?._id) return; 

    try {
        const formData = new FormData();

        if (updatedData.username) {
            formData.append('username', updatedData.username);
        }

        if (updatedData.profileImageUrl instanceof File) {
            formData.append('profileImage', updatedData.profileImageUrl);
        }

        // Send the request to your backend via the API service
        const updatedUserFromServer = await updateUserProfile(userData._id, formData);

        // Update the local state with the exact data returned by the server
        // (This ensures your UI uses the exact image URL generated by your backend)
        if (setUserData) {
            setUserData(updatedUserFromServer);
        }

    } catch (error) {
        console.error("Error updating profile:", error);
        // TODO: Add error handling UI, like a toast notification
    }
  };

  // Helper to safely render the profile image whether it's a URL string or a File object
  const getProfileImageUrl = (image?: string | File) => {
    if (!image) return 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg'; // Default fallback
    if (typeof image === 'string') return getImageUrl(image);
    return URL.createObjectURL(image);
  };

  const handleEditPost = (postId: string) => {
    console.log("Edit button clicked for post ID:", postId);
    // TODO: implement later
  };

  const handleDeletePost = (postId: string) => {
    console.log("Delete button clicked for post ID:", postId);
    // TODO: implement later
  };

  if (isLoading || !userData) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <img 
          src={getProfileImageUrl(userData?.profileImageUrl)} 
          alt={`${userData.username}'s avatar`} 
          style={styles.avatar} 
        />
        
        <div style={styles.headerInfo}>
          <div style={styles.usernameRow}>
            <h2 style={styles.username}>{userData.username}</h2>
            {isOwnProfile && (
              <button style={styles.editButton} onClick={handleEditProfile}>
                Edit Details
              </button>
            )}
          </div>

          <div style={styles.statsRow}>
            <span style={styles.stat}><strong>{posts.length}</strong> reviews</span>
          </div>
          
          {/* Displaying email as the only other user detail available */}
          <div style={styles.bioSection}>
            <p style={styles.joinDate}>Joined {new Date(userData.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>
      </header>

      <hr style={styles.divider} />

      {/* Posts Grid */}
      <section>
        <h3 style={styles.sectionTitle}>Reviews</h3>
        <div style={styles.grid}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px 0', color: '#888' }}>
              <p>This user hasn't posted any reviews yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} style={styles.gridItem}>
                <UserPost post={post} getImageUrl={getImageUrl} onEdit={handleEditPost} onDelete={handleDeletePost} />
              </div>
            )
          ))}
        </div>
      </section>
      {userData && (
        <EditProfileModal 
          currentUser={userData} 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={handleSaveProfile} 
        />
      )}
    </div>
  );
};