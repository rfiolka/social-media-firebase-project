import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { Post as IPost } from "./main";

interface Props {
  post: IPost;
}

interface Like {
  userId: string;
  likeId: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth); //gives information about current logged in user
  const [likes, setLikes] = useState<Like[] | null>(null);

  //adding LIKE functionality
  const likesRef = collection(db, "likes"); //reference to likes collection
  const likesDoc = query(likesRef, where("postId", "==", post.id)); //first we specify what collection we want to get, then using where function we only get the data from a post we are currently in

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    ); //setting like object to be list of objects containing userId field
  };
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid, //current logged in user's id
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div>
      <div className="title">{post.title}</div>
      <div className="body">
        <p>{post.description}</p>
      </div>
      <div className="footer">
        {" "}
        <p> @{post.username}</p>
      </div>
      <button onClick={hasUserLiked ? removeLike : addLike}>
        {" "}
        {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
      </button>
      {likes && <p>Likes: {likes.length} </p>}{" "}
      {/*displaying likes only if they exist */}
    </div>
  );
};
