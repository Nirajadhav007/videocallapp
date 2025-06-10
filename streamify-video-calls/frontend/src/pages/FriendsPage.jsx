"use client"; // if you're using App Router

import { useEffect, useState } from "react";
import axios from "axios";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("/api/friends");
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <p className="text-center">Loading friends...</p>;

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        friends.map((friend) => <FriendCard key={friend._id} friend={friend} />)
      )}
    </div>
  );
};

export default FriendsPage;
