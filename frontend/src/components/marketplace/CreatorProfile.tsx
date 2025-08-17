import React, { useState, useEffect } from 'react';
import StarRating from '../common/StarRating';
import ExpandableDescription from '../items/ExpandableDescription';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import { getActor } from '../../ic/agent';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/contexts/AuthContext';
import { AnonymousIdentity } from '@dfinity/agent';

interface CreatorProfileProps {
  owner: string;
  averageRating: number;
  commentsCount: number;
}

interface User {
  principal: string;
  balance: number;
  firstName?: string;
  lastName?: string;
  bio?: string;
  rate?: number;
  createdAt: number;
  updatedAt: number;
}

const CreatorProfile: React.FC<CreatorProfileProps> = ({
  owner,
  averageRating,
  commentsCount,
}) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { identity } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [owner]);

  const fetchUserProfile = async () => {
    try {
      const actor = await getActor(identity || new AnonymousIdentity());
      const ownerPrincipal = Principal.fromText(owner);
      const result = await actor.get_user_profile(ownerPrincipal);
      if (result && Array.isArray(result) && result.length > 0) {
        const userData = result[0];
        setUserProfile({
          principal: userData.principal.toText(),
          balance: Number(userData.balance),
          firstName: userData.firstName?.[0] || undefined,
          lastName: userData.lastName?.[0] || undefined,
          bio: userData.bio?.[0] || undefined,
          rate: userData.rate?.[0] ? Number(userData.rate[0]) : undefined,
          createdAt: Number(userData.createdAt),
          updatedAt: Number(userData.updatedAt),
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayName = userProfile?.firstName 
    ? `${userProfile.firstName}${userProfile.lastName ? ` ${userProfile.lastName}` : ''}`
    : owner.substring(0, 8) + '...';

  const displayInitial = userProfile?.firstName 
    ? userProfile.firstName[0].toUpperCase() 
    : owner.substring(0, 1).toUpperCase();

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-red-500 via-white to-gray-300 relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-white opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-200 opacity-30"></div>
      </div>

      {/* Profile Info */}
      <div className="p-6 -mt-16 relative z-10 bg-gray-800 rounded-b-xl">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-800 shadow-lg">
            <span className="text-white font-bold text-xl">
              {displayInitial}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">@{displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={averageRating || 5.0} totalRatings={commentsCount} size="sm" />
              <span className="text-gray-400 text-sm">({commentsCount})</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          {userProfile?.bio ? (
            <ExpandableDescription description={userProfile.bio} />
          ) : (
            <p className="text-gray-400 text-sm">
              Looking for a custom bundle or a specific theme? Just message me - I'm happy to help! Thanks for visiting my store and follow me now! ❤️ ...more
            </p>
          )}
        </div>

        {/* Platform Info */}
        <div className="space-y-2 text-sm text-gray-400">
          <div>Joined: {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'Information unavailable'}</div>
          <div>
            @{displayName} charges ${userProfile?.rate ? (userProfile.rate / 100).toFixed(0) : 'Information unavailable'}/hr for custom work
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
