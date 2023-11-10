import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useFollowUser } from "@/lib/react-query/queries";
import { checkIsFollowed } from "@/lib/utils";
import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser, setUser } = useUserContext();
  const { mutate: followUser } = useFollowUser();
  const followingList = currentUser?.following ?? [];
  const followersList = user?.followers ?? [];

  const [following, setFollowing] = useState<string[]>(followingList);
  const [followers, setFollowers] = useState<string[]>(followersList);

  const handleFollowUser = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();

    // Check if currentUser.$id and id are non-null strings
    if (currentUser?.id && id) {
      let followersArray = [...followers];
      let followingArray = [...following];

      if (followersArray.includes(currentUser.id)) {
        followersArray = followersArray.filter((Id) => Id !== currentUser.id);
        followingArray = followingArray.filter((Id) => Id !== id);
      } else {
        followersArray.push(currentUser.id);
        followingArray.push(id);
      }

      setFollowers(followersArray);
      setFollowing(followingArray);

      followUser({
        currentUserId: currentUser.id,
        userId: id,
        followersArray,
        followingArray,
      });
      setUser({
        ...currentUser,
        followers: followersArray,
        following: followingArray,
      });
    }
  };
  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`}>
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-2 dark:text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>

      {checkIsFollowed(following, user.$id) ? (
        <Button
          type="button"
          className="shad-button_primary px-8"
          onClick={(e) => handleFollowUser(e, user.$id)}
        >
          UnFollow
        </Button>
      ) : (
        <Button
          type="button"
          className="shad-button_primary px-8"
          onClick={(e) => handleFollowUser(e, user.$id)}
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default UserCard;
