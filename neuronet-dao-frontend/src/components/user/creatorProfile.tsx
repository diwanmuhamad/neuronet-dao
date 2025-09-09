import React, { useState, useEffect } from "react";
import { getActor } from "../../ic/agent";
import { Principal } from "@dfinity/principal";
import { useAuth } from "@/src/contexts/AuthContext";
import { AnonymousIdentity } from "@dfinity/agent";
import { User } from "./interfaces";

interface CreatorProfileProps {
  owner: string;
}

const CreatorProfile: React.FC<CreatorProfileProps> = ({ owner }) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { identity } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
    ? `${userProfile.firstName}${
        userProfile.lastName ? ` ${userProfile.lastName}` : ""
      }`
    : owner.substring(0, 8) + "...";

  const displayInitial = userProfile?.firstName
    ? userProfile.firstName[0].toUpperCase()
    : owner.substring(0, 1).toUpperCase();

  return (
    <div className="meta-info">
      <div
        style={{
          backgroundColor: "#66FF4A",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="avatar"
      >
        <span style={{ color: "black" }}>{displayInitial}</span>
      </div>
      <p className="tertiary-text">{displayName}</p>
    </div>
  );
};

export default CreatorProfile;
