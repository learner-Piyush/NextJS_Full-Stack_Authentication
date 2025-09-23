"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function ProfilePage() {
  const router = useRouter();
  const [data, setData] = React.useState("nothing");

  const onLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("✅ Logout success", response.data);
      toast.success("✅ Logout success");
      router.push("./login");
    } catch (error: any) {
      console.log("☹️ Logout failed", error.message);
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    const response = await axios.get("/api/users/me");
    console.log(response.data);
    setData(response.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <h2 className="p-1 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`./profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onLogout}
      >
        Logout
      </button>
      <button
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={getUserData}
      >
        Get User Details
      </button>
    </div>
  );
}

export default ProfilePage;
