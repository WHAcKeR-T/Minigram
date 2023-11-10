import { Models } from "appwrite";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetFeedPosts, useGetTopUsers } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const Home = () => {
  const { user } = useUserContext();
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetFeedPosts(user.following);
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetTopUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Your Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <>
              {user.following.length === 0 ? (
                <p className="body-medium text-dark-1 dark:text-light-1">
                  You should follow people in order to get your feed.
                </p>
              ) : (
                <ul className="flex flex-col flex-1 gap-9 w-full">
                  {posts?.map((post: Models.Document) => (
                    <li key={post.$id} className="flex justify-center w-full">
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text:dark-1 dark:text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map((creator) => (
              <li key={creator?.$id} className={`${user.id === creator?.$id && "hidden"}`}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
